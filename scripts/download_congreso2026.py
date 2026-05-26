#!/usr/bin/env python3
"""
Descarga datos oficiales de Senado + Cámara 2026 desde la Registraduría,
agrega in-streaming (no carga el CSV completo a memoria), y emite JSON
pequeños en public/data/congreso-2026/.

Fuente: https://api-escrutinioscongreso2026.registraduria.gov.co
        + S3 firmado en elecciones-congreso-prod-us-east-1.s3.us-east-1.amazonaws.com

El MMV (Modelo Matemático Votos) trae cada combinación
(mesa × partido × candidato) con su número de votos.
- CAN='000' significa voto al partido/lista (sin preferente).
- CAN!='000' es voto preferente al candidato.
"""
from __future__ import annotations
import csv, json, os, sys, time, urllib.request, urllib.error, gzip, shutil
from pathlib import Path
from collections import defaultdict

API = "https://api-escrutinioscongreso2026.registraduria.gov.co"
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "data" / "congreso-2026"
TMP_DIR = Path("/tmp/congreso2026_dl")
TMP_DIR.mkdir(exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

CORPS = {"SENADO", "CAMARA"}  # ignoramos CONSULTAS y CITREP por ahora

def http_get_json(url: str):
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())

def list_comisiones() -> list[dict]:
    return http_get_json(f"{API}/esc/v1/comisiones/general/01")["listaComisiones"]

def get_mmv_url(codigo: str) -> str | None:
    data = http_get_json(f"{API}/esc/v1/documentos-publicados/documentos/comision/{codigo}")
    for d in data.get("listaDocumentos", []):
        if d.get("tipoDocumento") == "MMV":
            return d["urlArchivo"]
    return None

def download(url: str, dest: Path) -> None:
    # streaming descarga
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        shutil.copyfileobj(r, f, length=1024 * 1024)

# ─── Acumuladores ────────────────────────────────────────────────────────
# El voto blanco/nulo/no-marcado vive bajo PAR='0000' "CANDIDATOS TOTALES",
# identificado por el código CAN (no por el nombre del partido):
CAN_INVALIDO = {"996": "blanco", "997": "nulo", "998": "no_marcado"}

def clasifica_invalido(can_id: str) -> str | None:
    return CAN_INVALIDO.get(can_id.strip())

def normalize_partido_name(nombre: str) -> str:
    """Para Cámara, el mismo movimiento aparece con PAR distinto en cada circunscripción.
    Agrupamos por nombre. También limpia sufijos como ' SENADO'."""
    n = nombre.strip()
    for suf in (" SENADO", " CAMARA", " CÁMARA"):
        if n.upper().endswith(suf): n = n[:-len(suf)].strip()
    return n

class Aggregator:
    """Para una corporación (SENADO o CAMARA). Agrupa partidos por nombre normalizado."""
    def __init__(self, corp: str):
        self.corp = corp
        # key partido = nombre normalizado
        self.partidos: dict[str, dict] = {}       # nombre -> {nombre}
        self.candidatos: dict[tuple, dict] = {}   # (partido_nombre, CANCEDULA) -> {partido, nombre, cedula}
        # Agregados
        self.dep_partido: dict = defaultdict(lambda: defaultdict(int))  # dep_id -> {partido_nom: votos}
        self.dep_cand: dict = defaultdict(lambda: defaultdict(int))     # dep_id -> {(partido,cedula): votos}
        self.mun_partido: dict = defaultdict(lambda: defaultdict(int))  # (dep_id, mun_id) -> {partido_nom: votos}
        self.partido_total: dict = defaultdict(int)
        self.cand_total: dict = defaultdict(int)
        # depto metadata (nombres y totales) + voto blanco/nulo/no marcado
        self.dep_meta: dict = {}   # dep_id -> {nombre}
        self.mun_meta: dict = {}   # (dep_id, mun_id) -> {nombre}
        self.dep_invalido: dict = defaultdict(lambda: {"blanco": 0, "nulo": 0, "no_marcado": 0})
        self.mun_invalido: dict = defaultdict(lambda: {"blanco": 0, "nulo": 0, "no_marcado": 0})

    def feed(self, row: list[str]) -> None:
        try:
            votos = int(row[18])
        except (ValueError, IndexError):
            return
        if votos == 0:
            return
        dep_id, dep_nom = row[0], row[1].strip()
        mun_id, mun_nom = row[2], row[3].strip()
        par_nom_raw = row[14].strip()
        can_id = row[15]
        cedula = row[16].strip()
        can_nom = row[17].strip()

        self.dep_meta.setdefault(dep_id, dep_nom)
        self.mun_meta.setdefault((dep_id, mun_id), mun_nom)

        # blanco / nulo / no-marcado → bajo PAR='0000', distinguido por CAN
        inv = clasifica_invalido(can_id)
        if inv is not None:
            self.dep_invalido[dep_id][inv] += votos
            self.mun_invalido[(dep_id, mun_id)][inv] += votos
            return
        # cualquier otra fila bajo "CANDIDATOS TOTALES" (PAR 0000) no es partido real
        if par_nom_raw.upper() == "CANDIDATOS TOTALES" or row[13].strip() == "0000":
            return

        partido = normalize_partido_name(par_nom_raw)
        if partido not in self.partidos:
            self.partidos[partido] = {"nombre": partido}

        self.dep_partido[dep_id][partido] += votos
        self.mun_partido[(dep_id, mun_id)][partido] += votos
        self.partido_total[partido] += votos

        # voto preferente al candidato (sólo si CAN != '000' y tiene cédula real)
        if can_id != "000" and cedula and clasifica_invalido(can_id) is None:
            key = (partido, cedula)
            if key not in self.candidatos:
                self.candidatos[key] = {"partido": partido, "nombre": can_nom, "cedula": cedula}
            self.dep_cand[dep_id][key] += votos
            self.cand_total[key] += votos

    def to_json(self) -> dict:
        partidos = [{"nombre": p["nombre"], "votos_nacional": self.partido_total[p["nombre"]]} for p in self.partidos.values()]
        partidos = [p for p in partidos if p["votos_nacional"] > 0]
        partidos.sort(key=lambda x: -x["votos_nacional"])

        cand_top = [{**meta, "votos": self.cand_total[k]} for k, meta in self.candidatos.items() if self.cand_total[k] > 0]
        cand_top.sort(key=lambda x: -x["votos"])

        deptos = []
        for dep_id in sorted(self.dep_meta):
            par_votos = self.dep_partido[dep_id]
            cand_votos = self.dep_cand[dep_id]
            top_cands = sorted(cand_votos.items(), key=lambda x: -x[1])[:25]
            inv = self.dep_invalido[dep_id]
            deptos.append({
                "id_depto": dep_id,
                "departamento": self.dep_meta[dep_id],
                "total": sum(par_votos.values()),
                "partidos": dict(par_votos),
                "blanco": inv["blanco"],
                "nulo": inv["nulo"],
                "no_marcado": inv["no_marcado"],
                "top_candidatos": [{**self.candidatos[k], "votos": v} for k, v in top_cands],
            })

        munis = defaultdict(list)
        for (dep_id, mun_id), par_votos in self.mun_partido.items():
            inv = self.mun_invalido[(dep_id, mun_id)]
            munis[dep_id].append({
                "id_muni": mun_id,
                "municipio": self.mun_meta[(dep_id, mun_id)],
                "total": sum(par_votos.values()),
                "partidos": dict(par_votos),
                "blanco": inv["blanco"],
                "nulo": inv["nulo"],
                "no_marcado": inv["no_marcado"],
            })
        munis_out = {k: sorted(v, key=lambda x: -x["total"]) for k, v in munis.items()}

        return {
            "corporacion": self.corp,
            "partidos": partidos,
            "candidatos": cand_top,
            "deptos": deptos,
            "munis_por_depto": munis_out,
        }

# ─── Pipeline principal ─────────────────────────────────────────────────
def main():
    aggs = {"SENADO": Aggregator("SENADO"), "CAMARA": Aggregator("CAMARA")}

    comisiones = list_comisiones()
    print(f"Comisiones a procesar: {len(comisiones)}")

    skip_codes = {"1050"}  # consulados consulta — sólo consultas
    # Por ahora también dejamos pasar CITREP en Cámara: vienen como CORNOMBRE CIRCUNSCRIPCION X y los marcaremos como CAMARA si así viene
    rows_total = 0
    t0 = time.time()
    for i, c in enumerate(comisiones, 1):
        cod = c["codigo"]; et = c["etiqueta"]
        if cod in skip_codes:
            print(f"  [{i}/{len(comisiones)}] {cod} {et} — saltado"); continue
        print(f"  [{i}/{len(comisiones)}] {cod} {et} … ", end="", flush=True)
        url = get_mmv_url(cod)
        if not url:
            print("sin MMV"); continue
        tmp = TMP_DIR / f"mmv_{cod}.csv"
        try:
            download(url, tmp)
            size_mb = tmp.stat().st_size / 1024 / 1024
            rows_here = 0
            with open(tmp, encoding="utf-8", errors="replace") as f:
                r = csv.reader(f, delimiter=";")
                next(r, None)
                for row in r:
                    if len(row) < 19: continue
                    corp = row[11]
                    if corp == "SENADO":
                        aggs["SENADO"].feed(row); rows_here += 1
                    elif corp == "CAMARA":
                        aggs["CAMARA"].feed(row); rows_here += 1
                    # CITREP venían como CIRCUNSCRIPCION X — los ignoramos para simplificar
            rows_total += rows_here
            print(f"{size_mb:.1f}MB · {rows_here:,} filas senado/cam")
        finally:
            try: tmp.unlink()
            except FileNotFoundError: pass

    dt = time.time() - t0
    print(f"\nTotal procesado: {rows_total:,} filas en {dt:.1f}s\n")

    # Volcar JSON
    for corp_key, agg in aggs.items():
        slug = corp_key.lower()
        data = agg.to_json()

        # 3 archivos por corporación: meta+partidos+candidatos, deptos, munis
        with open(OUT_DIR / f"{slug}-partidos.json", "w") as f:
            json.dump({"partidos": data["partidos"], "candidatos": data["candidatos"][:500]}, f, ensure_ascii=False)
        with open(OUT_DIR / f"{slug}-deptos.json", "w") as f:
            json.dump(data["deptos"], f, ensure_ascii=False)
        with open(OUT_DIR / f"{slug}-munis.json", "w") as f:
            json.dump(data["munis_por_depto"], f, ensure_ascii=False)

        n_part = len(data["partidos"])
        n_cand = len(data["candidatos"])
        tot = sum(p["votos_nacional"] for p in data["partidos"])
        print(f"{corp_key}: {tot:,} votos · {n_part} partidos · {n_cand} candidatos · {len(data['deptos'])} deptos")

    meta = {
        "fuente": "Registraduría Nacional del Estado Civil — escrutinios 2026",
        "descargado": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "comisiones_procesadas": len(comisiones) - 1,
        "corporaciones": list(CORPS),
    }
    with open(OUT_DIR / "metadata.json", "w") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"\nDone → {OUT_DIR}")

if __name__ == "__main__":
    main()
