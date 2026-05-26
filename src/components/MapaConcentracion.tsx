"use client";

import { useEffect, useMemo, useState } from "react";
import { CAND_META, GEO_TO_DATA, GEOJSON_URL, MAPA_FILES, MUNI_FILES, type DeptResult, type MuniResult, type MunisByDepto } from "@/lib/mapa-data";
import { geomToPath, makeProjection, shade, type GeoJSON } from "@/lib/mapa-utils";

type Round = "r1" | "r2";
type Granularidad = "depto" | "muni";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

// HHI sobre los shares de cada candidato. Devuelve [0,1] (1 = un solo candidato se llevó todo).
function hhi(candidatos: Record<string, number>, total: number): number {
  if (total <= 0) return 0;
  let s = 0;
  for (const v of Object.values(candidatos)) {
    const share = v / total;
    s += share * share;
  }
  return s;
}

function topShare(candidatos: Record<string, number>, total: number): { name: string; share: number } | null {
  if (total <= 0) return null;
  let best: [string, number] | null = null;
  for (const [k, v] of Object.entries(candidatos)) {
    if (!best || v > best[1]) best = [k, v];
  }
  return best ? { name: best[0], share: best[1] / total } : null;
}

// HHI agregado de un depto a partir de sus municipios = promedio ponderado por votos
function hhiDeptoFromMunis(munis: MuniResult[]): { hhi: number; total: number } {
  let sumHhi = 0, totalVotes = 0;
  munis.forEach(m => {
    if (m.total > 0) {
      sumHhi += hhi(m.candidatos, m.total) * m.total;
      totalVotes += m.total;
    }
  });
  return { hhi: totalVotes > 0 ? sumHhi / totalVotes : 0, total: totalVotes };
}

export default function MapaConcentracion() {
  const [round, setRound] = useState<Round>("r1");
  const [granu, setGranu] = useState<Granularidad>("depto");
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [data, setData] = useState<DeptResult[] | null>(null);
  const [munis, setMunis] = useState<MunisByDepto | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ cod: number; name: string } | null>(null);

  useEffect(() => { fetch(GEOJSON_URL).then(r => r.json()).then(setGeo); }, []);
  useEffect(() => {
    fetch(MAPA_FILES[`2022-${round}` as keyof typeof MAPA_FILES]).then(r => r.json()).then(setData);
    fetch(MUNI_FILES[`2022-${round}` as keyof typeof MUNI_FILES]).then(r => r.json()).then(setMunis);
    setSelected(null);
  }, [round]);

  const byDepto = useMemo(() => {
    const m = new Map<string, DeptResult>();
    data?.forEach(d => m.set(d.depto, d));
    return m;
  }, [data]);

  // Para cada depto, calcular HHI según modo
  const deptoMetric = useMemo(() => {
    const out = new Map<number, { hhi: number; total: number; top: { name: string; share: number } | null }>();
    if (granu === "depto") {
      data?.forEach(d => {
        out.set(d.cod, { hhi: hhi(d.candidatos, d.total), total: d.total, top: topShare(d.candidatos, d.total) });
      });
    } else {
      if (data && munis) {
        data.forEach(d => {
          const lst = munis[String(d.cod)] || [];
          const agg = hhiDeptoFromMunis(lst);
          out.set(d.cod, { hhi: agg.hhi, total: agg.total, top: topShare(d.candidatos, d.total) });
        });
      }
    }
    return out;
  }, [data, munis, granu]);

  // Escala: HHI mínimo y máximo observados (para spread)
  const { hMin, hMax } = useMemo(() => {
    let mn = 1, mx = 0;
    deptoMetric.forEach(v => { if (v.total > 0) { if (v.hhi < mn) mn = v.hhi; if (v.hhi > mx) mx = v.hhi; } });
    if (mn === 1 && mx === 0) return { hMin: 0, hMax: 1 };
    return { hMin: mn, hMax: mx };
  }, [deptoMetric]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);

  const hoverDepto = hover ? byDepto.get(GEO_TO_DATA[hover] || "") : undefined;
  const hoverMetric = hoverDepto ? deptoMetric.get(hoverDepto.cod) : undefined;

  // Ranking de munis del depto seleccionado
  const selectedMunis = useMemo(() => {
    if (!selected || !munis) return [] as { m: MuniResult; hhi: number; top: { name: string; share: number } | null }[];
    const lst = munis[String(selected.cod)] || [];
    return lst.map(m => ({ m, hhi: hhi(m.candidatos, m.total), top: topShare(m.candidatos, m.total) }))
      .filter(x => x.m.total > 0);
  }, [selected, munis]);

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 820 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0891B2", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Concentración del voto · 2022</div>
        <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>
          Polarización o dispersión
        </h2>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
          Índice <strong>HHI</strong> (Herfindahl) de los porcentajes por candidato. Alto = un candidato barrió. Bajo = los votos se repartieron entre varios. Cambia entre <strong>depto</strong> (HHI del depto) y <strong>muni</strong> (promedio ponderado del HHI de cada municipio).
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10 }}>
          {(["r1", "r2"] as Round[]).map(r => (
            <button key={r} type="button" onClick={() => setRound(r)} style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 16px", border: 0, borderRadius: 7,
              background: round === r ? "#fff" : "transparent",
              color: round === r ? "var(--ink)" : "var(--ink-2)",
              boxShadow: round === r ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>{r === "r1" ? "1ra vuelta" : "2da vuelta"}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10 }}>
          {(["depto", "muni"] as Granularidad[]).map(g => (
            <button key={g} type="button" onClick={() => setGranu(g)} style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 16px", border: 0, borderRadius: 7,
              background: granu === g ? "#fff" : "transparent",
              color: granu === g ? "var(--ink)" : "var(--ink-2)",
              boxShadow: granu === g ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>{g === "depto" ? "HHI por depto" : "HHI promedio muni"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12 }}>
          {!geo || !proj || !data ? (
            <div style={{ height: 520, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {geo.features.map((f, i) => {
                const name = f.properties.NOMBRE_DPT;
                const d = byDepto.get(GEO_TO_DATA[name] || "");
                const v = d ? deptoMetric.get(d.cod) : undefined;
                const t = v && hMax > hMin ? (v.hhi - hMin) / (hMax - hMin) : 0;
                const fill = !v || v.total === 0 ? "#E5E7EB" : shade("#0891B2", t);
                const isHover = hover === name;
                const isSelected = d && selected?.cod === d.cod;
                return (
                  <path key={i} d={geomToPath(f.geometry, proj)} fill={fill}
                    stroke={isSelected ? "#B3261E" : isHover ? "#1D1D1F" : "rgba(0,0,0,0.35)"}
                    strokeWidth={isSelected ? 2 : isHover ? 1.6 : 0.5}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover(h => h === name ? null : h)}
                    onClick={() => { if (d) setSelected({ cod: d.cod, name: d.depto }); }}
                    style={{ cursor: d ? "pointer" : "default" }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 16 }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {hoverDepto ? hoverDepto.depto : "HHI nacional"}
            </div>
            <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 44, fontWeight: 600, color: "#0891B2", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {hoverMetric ? hoverMetric.hhi.toFixed(3) : "—"}
            </div>
            {hoverMetric && hoverMetric.top && (
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Lidera <span style={{ color: CAND_META[hoverMetric.top.name]?.color || "var(--ink)", fontWeight: 700 }}>{CAND_META[hoverMetric.top.name]?.short || hoverMetric.top.name}</span> con {pct(hoverMetric.top.share * 100)} de los votos.
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.4 }}>
              Rango HHI {round === "r1" ? "1ra" : "2da"}: <strong>{hMin.toFixed(3)}</strong> (más disperso) ↔ <strong>{hMax.toFixed(3)}</strong> (más concentrado).
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Más concentrados (un candidato barrió)</div>
            <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
              {Array.from(deptoMetric.entries())
                .map(([cod, v]) => ({ cod, ...v, depto: data?.find(d => d.cod === cod)?.depto || String(cod) }))
                .filter(x => x.total > 0)
                .sort((a, b) => b.hhi - a.hhi).slice(0, 5).map(x => (
                  <button key={x.cod} type="button" onClick={() => setSelected({ cod: x.cod, name: x.depto })} style={{
                    display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center",
                    fontFamily: "inherit", cursor: "pointer", border: 0, background: "transparent",
                    padding: "4px 0", textAlign: "left", color: "var(--ink-2)",
                  }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.depto}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "#0891B2" }}>{x.hhi.toFixed(3)}</span>
                  </button>
                ))}
            </div>
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 10, paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Más dispersos (votos repartidos)</div>
              <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                {Array.from(deptoMetric.entries())
                  .map(([cod, v]) => ({ cod, ...v, depto: data?.find(d => d.cod === cod)?.depto || String(cod) }))
                  .filter(x => x.total > 0)
                  .sort((a, b) => a.hhi - b.hhi).slice(0, 5).map(x => (
                    <button key={x.cod} type="button" onClick={() => setSelected({ cod: x.cod, name: x.depto })} style={{
                      display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center",
                      fontFamily: "inherit", cursor: "pointer", border: 0, background: "transparent",
                      padding: "4px 0", textAlign: "left", color: "var(--ink-2)",
                    }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.depto}</span>
                      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--ink-2)" }}>{x.hhi.toFixed(3)}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Escala</div>
            <div style={{ height: 12, borderRadius: 3, background: `linear-gradient(90deg, ${shade("#0891B2", 0.05)} 0%, ${shade("#0891B2", 1)} 100%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
              <span>Disperso ({hMin.toFixed(2)})</span><span>Concentrado ({hMax.toFixed(2)})</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.4 }}>
              Referencia: 8 candidatos repartidos por igual ⇒ 0,125. Un solo candidato ⇒ 1,000. 2da vuelta tiende a valores altos por ser bipersonal.
            </div>
          </div>
        </aside>
      </div>

      {/* Drill-down muni */}
      {selected && selectedMunis.length > 0 && (
        <div style={{ marginTop: 24, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0891B2", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {selected.name} · {selectedMunis.length} municipios · HHI por muni
            </div>
            <button type="button" onClick={() => setSelected(null)} style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
              padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 6,
              background: "#fff", color: "var(--ink-2)",
            }}>cerrar ×</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.5fr) 1fr 110px 90px", padding: "8px 12px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
            <div>Municipio</div>
            <div>Lidera</div>
            <div style={{ textAlign: "right" }}>Votos</div>
            <div style={{ textAlign: "right" }}>HHI</div>
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {[...selectedMunis].sort((a, b) => b.hhi - a.hhi).slice(0, 200).map(({ m, hhi: hhiVal, top }) => {
              const meta = top ? CAND_META[top.name] : undefined;
              return (
                <div key={m.codMun} style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.5fr) 1fr 110px 90px", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #F2F4F7", fontSize: 13, gap: 10 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: "var(--ink)" }}>{m.mun}</div>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: meta?.color || "#9CA3AF", flexShrink: 0 }} />
                    <span style={{ color: "var(--ink-2)" }}>{meta?.short || top?.name}</span>
                    {top && <span style={{ color: "var(--ink-3)", fontSize: 12 }}>· {pct(top.share * 100)}</span>}
                  </div>
                  <div style={{ textAlign: "right", color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>{fmt(m.total)}</div>
                  <div style={{ textAlign: "right", color: "#0891B2", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{hhiVal.toFixed(3)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
