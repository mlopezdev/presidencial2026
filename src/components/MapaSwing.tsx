"use client";

import { useEffect, useMemo, useState } from "react";
import { CAND_META, GEO_TO_DATA, GEOJSON_URL, MAPA_FILES, MUNI_FILES, type DeptResult, type MuniResult, type MunisByDepto } from "@/lib/mapa-data";
import { diverge, geomToPath, makeProjection, type GeoJSON } from "@/lib/mapa-utils";

const PETRO = "GUSTAVO PETRO";
const RODOLFO = "RODOLFO HERNANDEZ";
const ELIMINADOS = ["FEDERICO GUTIERREZ", "SERGIO FAJARDO", "INGRID BETANCOURT", "JOHN MILTON RODRIGUEZ", "ENRIQUE GOMEZ MARTINEZ", "LUIS PEREZ"];

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");
const signed = (n: number) => (n >= 0 ? "+" : "") + fmt(n);

interface SwingRow {
  cod: number; name: string; total: number;
  petroR1: number; petroR2: number; petroDelta: number;
  rodolfoR1: number; rodolfoR2: number; rodolfoDelta: number;
  blancoR1: number; blancoR2: number;
  abstR1: number; abstR2: number;
  // pool de votos "redistribuibles" en 1ra (eliminados + blanco + nulo)
  eliminadosR1: number;
}

function buildSwing<T extends { cod: number; depto: string; total: number; candidatos: Record<string, number>; participacion?: { abst: number; blanco?: number } }>(
  r1: T, r2: T
): SwingRow {
  const p1 = r1.candidatos[PETRO] || 0, p2 = r2.candidatos[PETRO] || 0;
  const ro1 = r1.candidatos[RODOLFO] || 0, ro2 = r2.candidatos[RODOLFO] || 0;
  const elim = ELIMINADOS.reduce((s, k) => s + (r1.candidatos[k] || 0), 0);
  return {
    cod: r1.cod, name: r1.depto, total: r2.total,
    petroR1: p1, petroR2: p2, petroDelta: p2 - p1,
    rodolfoR1: ro1, rodolfoR2: ro2, rodolfoDelta: ro2 - ro1,
    blancoR1: r1.participacion?.blanco || 0,
    blancoR2: r2.participacion?.blanco || 0,
    abstR1: r1.participacion?.abst || 0,
    abstR2: r2.participacion?.abst || 0,
    eliminadosR1: elim,
  };
}

function buildSwingMuni(r1: MuniResult, r2: MuniResult): SwingRow {
  const p1 = r1.candidatos[PETRO] || 0, p2 = r2.candidatos[PETRO] || 0;
  const ro1 = r1.candidatos[RODOLFO] || 0, ro2 = r2.candidatos[RODOLFO] || 0;
  const elim = ELIMINADOS.reduce((s, k) => s + (r1.candidatos[k] || 0), 0);
  return {
    cod: r1.codMun, name: r1.mun, total: r2.total,
    petroR1: p1, petroR2: p2, petroDelta: p2 - p1,
    rodolfoR1: ro1, rodolfoR2: ro2, rodolfoDelta: ro2 - ro1,
    blancoR1: r1.participacion?.blanco || 0,
    blancoR2: r2.participacion?.blanco || 0,
    abstR1: r1.participacion?.abst || 0,
    abstR2: r2.participacion?.abst || 0,
    eliminadosR1: elim,
  };
}

export default function MapaSwing() {
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [d1, setD1] = useState<DeptResult[] | null>(null);
  const [d2, setD2] = useState<DeptResult[] | null>(null);
  const [m1, setM1] = useState<MunisByDepto | null>(null);
  const [m2, setM2] = useState<MunisByDepto | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ cod: number; name: string } | null>(null);

  useEffect(() => { fetch(GEOJSON_URL).then(r => r.json()).then(setGeo); }, []);
  useEffect(() => {
    fetch(MAPA_FILES["2022-r1"]).then(r => r.json()).then(setD1);
    fetch(MAPA_FILES["2022-r2"]).then(r => r.json()).then(setD2);
    fetch(MUNI_FILES["2022-r1"]).then(r => r.json()).then(setM1);
    fetch(MUNI_FILES["2022-r2"]).then(r => r.json()).then(setM2);
  }, []);

  const swing = useMemo(() => {
    if (!d1 || !d2) return new Map<string, SwingRow>();
    const m2 = new Map(d2.map(d => [d.depto, d]));
    const out = new Map<string, SwingRow>();
    d1.forEach(d => { const r2 = m2.get(d.depto); if (r2) out.set(d.depto, buildSwing(d, r2)); });
    return out;
  }, [d1, d2]);

  const swingMuni = useMemo(() => {
    if (!selected || !m1 || !m2) return [] as SwingRow[];
    const lst1 = m1[String(selected.cod)] || [];
    const lst2 = m2[String(selected.cod)] || [];
    const idx2 = new Map(lst2.map(m => [m.codMun, m]));
    return lst1.map(a => {
      const b = idx2.get(a.codMun);
      return b ? buildSwingMuni(a, b) : null;
    }).filter((x): x is SwingRow => x != null);
  }, [selected, m1, m2]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);

  // Métrica para el mapa: votos netos ganados por Petro − votos netos ganados por Rodolfo (normalizado por total r2)
  const balance = (s: SwingRow) => s.total > 0 ? (s.petroDelta - s.rodolfoDelta) / s.total : 0;

  const maxAbs = useMemo(() => {
    let m = 0;
    swing.forEach(s => { m = Math.max(m, Math.abs(balance(s))); });
    return m || 0.01;
  }, [swing]);

  const hoverData = hover ? swing.get(GEO_TO_DATA[hover] || "") : undefined;

  // Análisis: dónde tenían más fuerza los eliminados, y a quién benefició
  const eliminadosAnalysis = useMemo(() => {
    if (!d1 || !d2) return [];
    return ELIMINADOS.map(cand => {
      // Sumar dónde estaba fuerte el eliminado en r1, y comparar el delta agregado
      const m2 = new Map(d2.map(d => [d.depto, d]));
      let votosR1 = 0, petroGain = 0, rodolfoGain = 0;
      // Top 5 deptos donde más votos tuvo en r1
      const fuerza = d1.map(d => ({ d, v: d.candidatos[cand] || 0 }))
        .filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 5);
      fuerza.forEach(({ d, v }) => {
        const r2 = m2.get(d.depto);
        if (!r2) return;
        votosR1 += v;
        petroGain += (r2.candidatos[PETRO] || 0) - (d.candidatos[PETRO] || 0);
        rodolfoGain += (r2.candidatos[RODOLFO] || 0) - (d.candidatos[RODOLFO] || 0);
      });
      return { cand, votosR1, petroGain, rodolfoGain, fuerza };
    }).filter(x => x.votosR1 > 0);
  }, [d1, d2]);

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 820 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1F8F5C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Swing 1ra → 2da · 2022</div>
        <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>
          A dónde fueron los votos de Fico, Fajardo, Íngrid
        </h2>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
          Cuando Fede, Fajardo, Íngrid y los demás quedaron fuera, su electorado se redistribuyó. El mapa colorea el <strong>balance neto</strong> de votos ganados por cada finalista: <span style={{ color: CAND_META[RODOLFO].color, fontWeight: 700 }}>azul = Rodolfo creció más</span>, <span style={{ color: CAND_META[PETRO].color, fontWeight: 700 }}>dorado = Petro creció más</span>. Haz click en un departamento para ver el detalle municipal.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12 }}>
          {!geo || !proj || swing.size === 0 ? (
            <div style={{ height: 520, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {geo.features.map((f, i) => {
                const name = f.properties.NOMBRE_DPT;
                const s = swing.get(GEO_TO_DATA[name] || "");
                const fill = !s ? "#E5E7EB" : diverge(CAND_META[RODOLFO].color, CAND_META[PETRO].color, balance(s) / maxAbs);
                const isHover = hover === name;
                const isSelected = s && selected?.cod === s.cod;
                return (
                  <path key={i} d={geomToPath(f.geometry, proj)} fill={fill}
                    stroke={isSelected ? "#B3261E" : isHover ? "#1D1D1F" : "rgba(0,0,0,0.35)"}
                    strokeWidth={isSelected ? 2 : isHover ? 1.6 : 0.5}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover(h => h === name ? null : h)}
                    onClick={() => { if (s) setSelected({ cod: s.cod, name: s.name }); }}
                    style={{ cursor: s ? "pointer" : "default" }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Panel */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 16 }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {hoverData ? hoverData.name : "Balance del swing"}
            </div>
            {hoverData ? (
              <SwingDetail s={hoverData} />
            ) : (
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                El balance compara cuántos votos ganó Petro vs Rodolfo en la segunda vuelta respecto a la primera, en cada departamento. Pasa el cursor por uno para ver los números.
              </div>
            )}
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Escala (Δ Petro − Δ Rodolfo) / total r2</div>
            <div style={{ height: 12, borderRadius: 3, background: `linear-gradient(90deg, ${CAND_META[RODOLFO].color} 0%, #FFFFFF 50%, ${CAND_META[PETRO].color} 100%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
              <span>Rodolfo +{pct(maxAbs * 100, 0)}</span><span>0</span><span>Petro +{pct(maxAbs * 100, 0)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Drill-down muni del depto seleccionado */}
      {selected && swingMuni.length > 0 && (
        <div style={{ marginTop: 24, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1F8F5C", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {selected.name} · swing municipal · {swingMuni.length} municipios
            </div>
            <button type="button" onClick={() => setSelected(null)} style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
              padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 6,
              background: "#fff", color: "var(--ink-2)",
            }}>cerrar ×</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.2fr) 110px 110px 1fr", padding: "8px 12px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
            <div>Municipio</div>
            <div style={{ textAlign: "right" }}>Δ Petro</div>
            <div style={{ textAlign: "right" }}>Δ Rodolfo</div>
            <div>Balance</div>
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {[...swingMuni].sort((a, b) => balance(b) - balance(a)).slice(0, 200).map(s => {
              const bal = balance(s);
              return (
                <div key={s.cod} style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.2fr) 110px 110px 1fr", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #F2F4F7", fontSize: 13, gap: 10 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: "var(--ink)" }}>{s.name}</div>
                  <div style={{ textAlign: "right", color: CAND_META[PETRO].color, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{signed(s.petroDelta)}</div>
                  <div style={{ textAlign: "right", color: CAND_META[RODOLFO].color, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{signed(s.rodolfoDelta)}</div>
                  <div style={{ position: "relative", height: 18, background: "#F7F8FA", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.15)" }} />
                    {bal !== 0 && (
                      <div style={{
                        position: "absolute",
                        left: bal > 0 ? "50%" : `${50 + bal / maxAbs * 50}%`,
                        width: `${Math.min(50, Math.abs(bal / maxAbs) * 50)}%`,
                        top: 3, bottom: 3,
                        background: bal > 0 ? CAND_META[PETRO].color : CAND_META[RODOLFO].color,
                        borderRadius: 2,
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Análisis de eliminados */}
      <div style={{ marginTop: 32, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>¿A quién benefició cada eliminado?</h3>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "var(--ink-3)" }}>
          En los <strong>5 departamentos donde cada eliminado fue más fuerte en 1ra vuelta</strong>, comparamos cuánto creció Petro y cuánto creció Rodolfo en 2da. No es trasvase directo (puede mezclarse con abstención y blanco), pero es la mejor pista agregada.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {eliminadosAnalysis.map(({ cand, votosR1, petroGain, rodolfoGain }) => {
            const total = Math.abs(petroGain) + Math.abs(rodolfoGain) || 1;
            const petroPct = (petroGain / total) * 100;
            const rodolfoPct = (rodolfoGain / total) * 100;
            const meta = CAND_META[cand];
            return (
              <div key={cand} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: meta?.color || "#9CA3AF" }} />
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{meta?.short || cand}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-3)" }}>{fmt(votosR1)} votos r1</span>
                </div>
                <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: "#F2F4F7" }}>
                  <div style={{ width: `${Math.max(0, rodolfoPct)}%`, background: CAND_META[RODOLFO].color }} />
                  <div style={{ width: `${Math.max(0, petroPct)}%`, background: CAND_META[PETRO].color }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6, color: "var(--ink-3)" }}>
                  <span style={{ color: CAND_META[RODOLFO].color, fontWeight: 600 }}>Rodolfo {signed(rodolfoGain)}</span>
                  <span style={{ color: CAND_META[PETRO].color, fontWeight: 600 }}>Petro {signed(petroGain)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SwingDetail({ s }: { s: SwingRow }) {
  return (
    <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 4 }}>
        <span style={{ color: CAND_META[PETRO].color, fontWeight: 600 }}>Petro</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(s.petroR1)} → {fmt(s.petroR2)}</span>
        <span style={{ color: "var(--ink-3)" }}>cambio</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: s.petroDelta >= 0 ? "#1F8F5C" : "#B3261E", fontWeight: 600 }}>{signed(s.petroDelta)}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 4, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
        <span style={{ color: CAND_META[RODOLFO].color, fontWeight: 600 }}>Rodolfo</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(s.rodolfoR1)} → {fmt(s.rodolfoR2)}</span>
        <span style={{ color: "var(--ink-3)" }}>cambio</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: s.rodolfoDelta >= 0 ? "#1F8F5C" : "#B3261E", fontWeight: 600 }}>{signed(s.rodolfoDelta)}</span>
      </div>
      <div style={{ paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--ink-3)", display: "grid", gap: 3 }}>
        <div>Pool eliminados r1: <span style={{ color: "var(--ink-2)" }}>{fmt(s.eliminadosR1)}</span></div>
        <div>Blanco: <span style={{ color: "var(--ink-2)" }}>{fmt(s.blancoR1)} → {fmt(s.blancoR2)}</span></div>
        <div>Abstención: <span style={{ color: "var(--ink-2)" }}>{fmt(s.abstR1)} → {fmt(s.abstR2)}</span></div>
      </div>
    </div>
  );
}
