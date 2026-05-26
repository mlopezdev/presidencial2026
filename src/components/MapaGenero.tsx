"use client";

import { useEffect, useMemo, useState } from "react";
import { CAND_META, GEO_TO_DATA, GEOJSON_URL, MAPA_FILES, MUNI_FILES, type DeptResult, type MuniResult, type MunisByDepto } from "@/lib/mapa-data";
import { geomToPath, makeProjection, shade, type GeoJSON } from "@/lib/mapa-utils";

type Round = "r1" | "r2";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

function pctMujeres(p?: { censoM: number; censoH: number }): number | null {
  if (!p) return null;
  const total = p.censoM + p.censoH;
  return total > 0 ? p.censoM / total : null;
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 3) return 0;
  let sx = 0, sy = 0;
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; }
  const mx = sx / n, my = sy / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx2 += a * a; dy2 += b * b;
  }
  const den = Math.sqrt(dx2 * dy2);
  return den > 0 ? num / den : 0;
}

export default function MapaGenero() {
  const [round, setRound] = useState<Round>("r1");
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [data, setData] = useState<DeptResult[] | null>(null);
  const [munis, setMunis] = useState<MunisByDepto | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ cod: number; name: string } | null>(null);
  const [candFocus, setCandFocus] = useState<string | null>(null);

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

  const allCands = useMemo(() => {
    if (!data) return [] as string[];
    const tot: Record<string, number> = {};
    data.forEach(d => Object.entries(d.candidatos).forEach(([k, v]) => { tot[k] = (tot[k] || 0) + v; }));
    return Object.keys(tot).sort((a, b) => tot[b] - tot[a]);
  }, [data]);

  useEffect(() => {
    if (!candFocus && allCands.length) setCandFocus(allCands[0]);
    if (candFocus && allCands.length && !allCands.includes(candFocus)) setCandFocus(allCands[0]);
  }, [allCands, candFocus]);

  // %mujeres por depto
  const deptoPctMuj = useMemo(() => {
    const m = new Map<number, number>();
    data?.forEach(d => {
      const v = pctMujeres(d.participacion);
      if (v != null) m.set(d.cod, v);
    });
    return m;
  }, [data]);

  // Para la escala, % mujeres oscila típicamente entre 0.48 y 0.55 — uso esa banda
  const { mMin, mMax } = useMemo(() => {
    const vals = Array.from(deptoPctMuj.values()).sort((a, b) => a - b);
    if (!vals.length) return { mMin: 0.48, mMax: 0.55 };
    return { mMin: vals[0], mMax: vals[vals.length - 1] };
  }, [deptoPctMuj]);

  // Scatter data nacional: cada muni es un punto (x = %mujeres, y = %voto del candidato)
  const allMunisFlat: MuniResult[] = useMemo(() => {
    if (!munis) return [];
    return Object.values(munis).flat();
  }, [munis]);

  const scatterAll = useMemo(() => {
    if (!candFocus) return [] as { x: number; y: number; m: MuniResult }[];
    return allMunisFlat.map(m => {
      const pm = pctMujeres(m.participacion);
      if (pm == null || m.total <= 0) return null;
      const share = (m.candidatos[candFocus] || 0) / m.total;
      return { x: pm, y: share, m };
    }).filter((p): p is { x: number; y: number; m: MuniResult } => p != null);
  }, [allMunisFlat, candFocus]);

  const scatterSelected = useMemo(() => {
    if (!selected || !munis || !candFocus) return [] as { x: number; y: number; m: MuniResult }[];
    return (munis[String(selected.cod)] || []).map(m => {
      const pm = pctMujeres(m.participacion);
      if (pm == null || m.total <= 0) return null;
      const share = (m.candidatos[candFocus] || 0) / m.total;
      return { x: pm, y: share, m };
    }).filter((p): p is { x: number; y: number; m: MuniResult } => p != null);
  }, [selected, munis, candFocus]);

  const correlations = useMemo(() => {
    if (!allMunisFlat.length) return [] as { cand: string; r: number; n: number }[];
    return allCands.map(cand => {
      const xs: number[] = [], ys: number[] = [];
      allMunisFlat.forEach(m => {
        const pm = pctMujeres(m.participacion);
        if (pm == null || m.total <= 0) return;
        xs.push(pm);
        ys.push((m.candidatos[cand] || 0) / m.total);
      });
      return { cand, r: pearson(xs, ys), n: xs.length };
    }).sort((a, b) => b.r - a.r);
  }, [allMunisFlat, allCands]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);
  const hoverDepto = hover ? byDepto.get(GEO_TO_DATA[hover] || "") : undefined;
  const hoverPctMuj = hoverDepto ? deptoPctMuj.get(hoverDepto.cod) : null;

  const candMeta = candFocus ? CAND_META[candFocus] : undefined;
  const scatterPoints = selected ? scatterSelected : scatterAll;

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 820 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B5649C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Brecha de género · 2022</div>
        <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>
          ¿Vota distinto donde hay más mujeres?
        </h2>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
          Cruzamos el <strong>% de mujeres en el censo electoral</strong> de cada municipio con el <strong>% de voto</strong> que recibió cada candidato. No mide voto individual (no hay urna por género), pero revela patrones geográficos: ¿el voto por Petro o Fico se concentró en zonas con censo más femenino?
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
        <select value={candFocus || ""} onChange={(e) => setCandFocus(e.target.value)} style={{
          fontFamily: "inherit", fontSize: 14, padding: "9px 14px", border: "1px solid var(--line)",
          borderRadius: 9, background: "#fff", color: "var(--ink)", cursor: "pointer",
        }}>
          {allCands.map(c => <option key={c} value={c}>{CAND_META[c]?.short || c}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 1fr", gap: 24, alignItems: "start" }}>
        {/* Mapa %mujeres */}
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12 }}>
          <div style={{ padding: "6px 8px 12px", fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            % mujeres en el censo · por departamento
          </div>
          {!geo || !proj || !data ? (
            <div style={{ height: 480, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {geo.features.map((f, i) => {
                const name = f.properties.NOMBRE_DPT;
                const d = byDepto.get(GEO_TO_DATA[name] || "");
                const v = d ? deptoPctMuj.get(d.cod) : undefined;
                const t = v != null && mMax > mMin ? (v - mMin) / (mMax - mMin) : 0;
                const fill = v == null ? "#E5E7EB" : shade("#B5649C", t);
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px" }}>
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{pct(mMin * 100)}</span>
            <div style={{ flex: 1, height: 10, margin: "0 8px", borderRadius: 2, background: `linear-gradient(90deg, ${shade("#B5649C", 0.05)} 0%, ${shade("#B5649C", 1)} 100%)` }} />
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{pct(mMax * 100)}</span>
          </div>
        </div>

        {/* Scatter */}
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            % mujeres (eje x) · % voto {candMeta?.short || candFocus} (eje y)
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 10 }}>
            {selected ? <>Municipios de <strong>{selected.name}</strong> · {scatterPoints.length} puntos · <button type="button" onClick={() => setSelected(null)} style={{ fontFamily: "inherit", fontSize: 12, cursor: "pointer", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: 4, marginLeft: 6, background: "#fff" }}>ver nacional</button></> : <>Todos los municipios · {scatterPoints.length} puntos</>}
          </div>
          <Scatter points={scatterPoints} color={candMeta?.color || "#6B7280"} />
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
            <strong>Correlación de Pearson (nacional):</strong>{" "}
            {(() => {
              const c = correlations.find(x => x.cand === candFocus);
              if (!c) return "—";
              const sign = c.r > 0 ? "+" : "";
              const strength = Math.abs(c.r) < 0.1 ? "muy débil" : Math.abs(c.r) < 0.3 ? "débil" : Math.abs(c.r) < 0.5 ? "moderada" : "fuerte";
              return <span style={{ color: candMeta?.color, fontWeight: 600 }}>r = {sign}{c.r.toFixed(3)} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>({strength})</span></span>;
            })()}
          </div>
        </div>
      </div>

      {/* Panel de hover */}
      {hoverDepto && (
        <div style={{ marginTop: 14, background: "#FAFBFC", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "var(--ink-2)", display: "flex", flexWrap: "wrap", gap: 24 }}>
          <div><strong style={{ color: "var(--ink)" }}>{hoverDepto.depto}</strong></div>
          <div>Censo mujeres: <strong style={{ color: "#B5649C" }}>{hoverPctMuj != null ? pct(hoverPctMuj * 100, 2) : "—"}</strong></div>
          <div>Mujeres: {hoverDepto.participacion ? fmt(hoverDepto.participacion.censoM) : "—"} · Hombres: {hoverDepto.participacion ? fmt(hoverDepto.participacion.censoH) : "—"}</div>
        </div>
      )}

      {/* Correlaciones */}
      <div style={{ marginTop: 24, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Correlación por candidato (todos los municipios)</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--ink-3)" }}>
          Pearson r entre <em>% mujeres en censo</em> y <em>% voto</em> del candidato, a nivel municipal. Positivo = obtuvo mejor % donde había más mujeres registradas. <strong>Ojo</strong>: no implica que las mujeres hayan votado por él — sólo correlación geográfica con la composición del censo.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {correlations.map(({ cand, r }) => {
            const meta = CAND_META[cand];
            const w = Math.abs(r) * 100;
            return (
              <div key={cand} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: meta?.color || "#9CA3AF" }} />
                  <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13 }}>{meta?.short || cand}</span>
                  <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: r >= 0 ? "#B5649C" : "#0891B2", fontSize: 13 }}>
                    {r >= 0 ? "+" : ""}{r.toFixed(3)}
                  </span>
                </div>
                <div style={{ position: "relative", height: 8, background: "#F2F4F7", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.18)" }} />
                  <div style={{
                    position: "absolute",
                    left: r >= 0 ? "50%" : `${50 - w / 2}%`,
                    width: `${w / 2}%`,
                    top: 0, bottom: 0,
                    background: r >= 0 ? "#B5649C" : "#0891B2",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Scatter({ points, color }: { points: { x: number; y: number; m: MuniResult }[]; color: string }) {
  const W = 520, H = 320, padL = 40, padR = 10, padT = 10, padB = 30;
  if (!points.length) return <div style={{ height: H, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Sin datos</div>;

  // límites
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  points.forEach(p => {
    if (p.x < xMin) xMin = p.x; if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y; if (p.y > yMax) yMax = p.y;
  });
  // expandir un poco para que los puntos no toquen bordes
  const xRange = xMax - xMin || 0.01;
  const yRange = yMax - yMin || 0.01;
  xMin -= xRange * 0.05; xMax += xRange * 0.05;
  yMin = Math.max(0, yMin - yRange * 0.05); yMax += yRange * 0.05;
  yMax = Math.min(1, yMax);

  const xOf = (v: number) => padL + ((v - xMin) / (xMax - xMin)) * (W - padL - padR);
  const yOf = (v: number) => H - padB - ((v - yMin) / (yMax - yMin)) * (H - padT - padB);

  const xTicks = 5, yTicks = 5;
  const xVals = Array.from({ length: xTicks }, (_, i) => xMin + ((xMax - xMin) * i) / (xTicks - 1));
  const yVals = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* gridlines */}
      {yVals.map((v, i) => (
        <g key={`y${i}`}>
          <line x1={padL} y1={yOf(v)} x2={W - padR} y2={yOf(v)} stroke="rgba(0,0,0,0.06)" />
          <text x={padL - 6} y={yOf(v) + 4} fontSize="10" fill="var(--ink-3)" textAnchor="end">{(v * 100).toFixed(0)}%</text>
        </g>
      ))}
      {xVals.map((v, i) => (
        <g key={`x${i}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={H - padB} stroke="rgba(0,0,0,0.04)" />
          <text x={xOf(v)} y={H - padB + 14} fontSize="10" fill="var(--ink-3)" textAnchor="middle">{(v * 100).toFixed(0)}%</text>
        </g>
      ))}
      {/* points */}
      {points.map((p, i) => {
        const r = Math.max(2, Math.min(8, Math.sqrt(p.m.total) / 40));
        return (
          <circle key={i} cx={xOf(p.x)} cy={yOf(p.y)} r={r} fill={color} fillOpacity={0.35} stroke={color} strokeOpacity={0.5} strokeWidth={0.5}>
            <title>{p.m.mun} · {pct(p.x * 100)} muj. · {pct(p.y * 100)} voto</title>
          </circle>
        );
      })}
    </svg>
  );
}
