"use client";

import { useEffect, useMemo, useState } from "react";
import { GEO_TO_DATA, GEOJSON_URL, MAPA_FILES, MUNI_FILES, type DeptResult, type MunisByDepto, type MuniResult } from "@/lib/mapa-data";

type Round = "r1" | "r2";
type Metric = "abst" | "blanco" | "nulo" | "noMarcado" | "protesta";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

const METRICS: { k: Metric; label: string; hint: string; color: string }[] = [
  { k: "abst",      label: "Abstención",     hint: "% del censo electoral que no votó",          color: "#B3261E" },
  { k: "protesta",  label: "Voto protesta",  hint: "blanco + nulo + no marcado / votos emitidos", color: "#7C3AED" },
  { k: "blanco",    label: "Voto blanco",    hint: "% blanco sobre votos emitidos",              color: "#374151" },
  { k: "nulo",      label: "Voto nulo",      hint: "% nulo sobre votos emitidos",                color: "#D97706" },
  { k: "noMarcado", label: "No marcado",     hint: "% tarjetones sin marcar sobre votos emitidos",color: "#0891B2" },
];

interface GeoFeature {
  type: "Feature";
  properties: { NOMBRE_DPT: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}
interface GeoJSON { type: "FeatureCollection"; features: GeoFeature[] }

function makeProjection(features: GeoFeature[], width: number, height: number) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const walk = (c: unknown) => {
    if (typeof (c as number[])[0] === "number") {
      const [lng, lat] = c as number[];
      if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    } else (c as unknown[]).forEach(walk);
  };
  features.forEach((f) => walk(f.geometry.coordinates));
  const midLat = ((minLat + maxLat) / 2) * Math.PI / 180;
  const kx = Math.cos(midLat);
  const w = (maxLng - minLng) * kx; const h = maxLat - minLat;
  const pad = 10;
  const s = Math.min((width - pad * 2) / w, (height - pad * 2) / h);
  const ox = (width - w * s) / 2; const oy = (height - h * s) / 2;
  return (lng: number, lat: number) => [ox + (lng - minLng) * kx * s, oy + (maxLat - lat) * s];
}

function geomToPath(geom: GeoFeature["geometry"], proj: (lng: number, lat: number) => number[]) {
  const ring = (r: number[][]) => r.map(([lng, lat], i) => {
    const [x, y] = proj(lng, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + "Z";
  if (geom.type === "Polygon") return (geom.coordinates as number[][][]).map(ring).join(" ");
  return (geom.coordinates as number[][][][]).flat().map(ring).join(" ");
}

// gradiente blanco → color, según valor normalizado en [0,1]
function shade(hex: string, t: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const k = 0.08 + 0.92 * Math.max(0, Math.min(1, t));
  const mix = (c: number) => Math.round(255 - (255 - c) * k);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

function deptValue(d: DeptResult | undefined, metric: Metric): number | null {
  if (!d || !d.participacion) return null;
  const p = d.participacion;
  if (metric === "abst") return p.censo > 0 ? p.abst / p.censo : null;
  if (p.votoTotal <= 0) return null;
  if (metric === "blanco") return p.blanco / p.votoTotal;
  if (metric === "nulo") return p.nulo / p.votoTotal;
  if (metric === "noMarcado") return p.noMarcado / p.votoTotal;
  if (metric === "protesta") return (p.blanco + p.nulo + p.noMarcado) / p.votoTotal;
  return null;
}

function muniValue(m: MuniResult, metric: Metric): number | null {
  const p = m.participacion;
  if (!p) return null;
  if (metric === "abst") return p.censo > 0 ? p.abst / p.censo : null;
  if (p.votoTotal <= 0) return null;
  if (metric === "blanco") return p.blanco / p.votoTotal;
  if (metric === "nulo") return p.nulo / p.votoTotal;
  if (metric === "noMarcado") return p.noMarcado / p.votoTotal;
  if (metric === "protesta") return (p.blanco + p.nulo + p.noMarcado) / p.votoTotal;
  return null;
}

export default function MapaCalidad() {
  const [round, setRound] = useState<Round>("r1");
  const [metric, setMetric] = useState<Metric>("abst");
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

  const metricMeta = METRICS.find(m => m.k === metric)!;

  // Escala dinámica por percentil 95 para que no se aplasten los valores
  const scaleMax = useMemo(() => {
    if (!data) return 1;
    const vals = data.map(d => deptValue(d, metric)).filter((v): v is number => v != null).sort((a, b) => a - b);
    if (!vals.length) return 1;
    const p95 = vals[Math.min(vals.length - 1, Math.floor(vals.length * 0.95))];
    return Math.max(p95, 0.05);
  }, [data, metric]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);

  // valor sobre el que pasa el cursor
  const hoverDepto = hover ? byDepto.get(GEO_TO_DATA[hover] || "") : undefined;
  const hoverVal = hoverDepto ? deptValue(hoverDepto, metric) : null;

  // ranking top 5 / bottom 5 del país
  const ranking = useMemo(() => {
    if (!data) return { top: [] as { d: DeptResult; v: number }[], bottom: [] as { d: DeptResult; v: number }[] };
    const arr = data.map(d => ({ d, v: deptValue(d, metric) })).filter((x): x is { d: DeptResult; v: number } => x.v != null);
    arr.sort((a, b) => b.v - a.v);
    return { top: arr.slice(0, 5), bottom: arr.slice(-5).reverse() };
  }, [data, metric]);

  // promedio nacional
  const nacional = useMemo(() => {
    if (!data) return null;
    const tot = data.reduce((a, d) => {
      if (!d.participacion) return a;
      a.censo += d.participacion.censo;
      a.abst += d.participacion.abst;
      a.votoTotal += d.participacion.votoTotal;
      a.blanco += d.participacion.blanco;
      a.nulo += d.participacion.nulo;
      a.noMarcado += d.participacion.noMarcado;
      return a;
    }, { censo: 0, abst: 0, votoTotal: 0, blanco: 0, nulo: 0, noMarcado: 0 });
    if (metric === "abst") return tot.censo > 0 ? tot.abst / tot.censo : null;
    if (tot.votoTotal <= 0) return null;
    if (metric === "blanco") return tot.blanco / tot.votoTotal;
    if (metric === "nulo") return tot.nulo / tot.votoTotal;
    if (metric === "noMarcado") return tot.noMarcado / tot.votoTotal;
    return (tot.blanco + tot.nulo + tot.noMarcado) / tot.votoTotal;
  }, [data, metric]);

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 820 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Abstención · Calidad del voto · 2022</div>
        <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: "clamp(24px, 6vw, 38px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>
          Quién no votó, quién votó en blanco
        </h2>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
          Mapas de abstención y voto protesta para 2022, por departamento. <strong>Haz click en un departamento</strong> para ver el detalle municipal.
        </p>
      </div>

      {/* Controles */}
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
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10, flexWrap: "wrap" }}>
          {METRICS.map(m => (
            <button key={m.k} type="button" onClick={() => setMetric(m.k)} style={{
              fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              padding: "8px 14px", border: 0, borderRadius: 7,
              background: metric === m.k ? "#fff" : "transparent",
              color: metric === m.k ? "var(--ink)" : "var(--ink-2)",
              boxShadow: metric === m.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>{m.label}</button>
          ))}
        </div>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--ink-3)", fontStyle: "italic" }}>{metricMeta.hint}</p>

      <div className="cmap-grid">
        {/* Mapa */}
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12 }}>
          {!geo || !data || !proj ? (
            <div style={{ height: 520, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {geo.features.map((f, i) => {
                const name = f.properties.NOMBRE_DPT;
                const d = byDepto.get(GEO_TO_DATA[name] || "");
                const v = deptValue(d, metric);
                const fill = v == null ? "#E5E7EB" : shade(metricMeta.color, v / scaleMax);
                const isHover = hover === name;
                const isSelected = d && selected?.cod === d.cod;
                const clickable = !!d;
                return (
                  <path key={i} d={geomToPath(f.geometry, proj)} fill={fill}
                    stroke={isSelected ? "#B3261E" : isHover ? "#1D1D1F" : "rgba(0,0,0,0.35)"}
                    strokeWidth={isSelected ? 2 : isHover ? 1.6 : 0.5}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover(h => h === name ? null : h)}
                    onClick={() => { if (clickable && d) setSelected({ cod: d.cod, name: d.depto }); }}
                    style={{ cursor: clickable ? "pointer" : "default", transition: "stroke-width 120ms" }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Panel lateral */}
        <aside className="cmap-aside">
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {hoverDepto ? hoverDepto.depto : `Promedio nacional · ${metricMeta.label}`}
            </div>
            <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 44, fontWeight: 600, color: metricMeta.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {(hoverVal ?? nacional) != null ? pct(((hoverVal ?? nacional)!) * 100) : "—"}
            </div>
            {hoverDepto && hoverDepto.participacion && (
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", display: "grid", gap: 4 }}>
                <div>Censo: <span style={{ color: "var(--ink-2)" }}>{fmt(hoverDepto.participacion.censo)}</span></div>
                <div>Votos emitidos: <span style={{ color: "var(--ink-2)" }}>{fmt(hoverDepto.participacion.votoTotal)}</span></div>
                <div>Blanco / Nulo / No marcado: <span style={{ color: "var(--ink-2)" }}>{fmt(hoverDepto.participacion.blanco)} · {fmt(hoverDepto.participacion.nulo)} · {fmt(hoverDepto.participacion.noMarcado)}</span></div>
                <div>Abstención: <span style={{ color: "var(--ink-2)" }}>{fmt(hoverDepto.participacion.abst)}</span></div>
              </div>
            )}
          </div>

          {/* Ranking */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Top 5 más {metricMeta.label.toLowerCase()}</div>
            <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
              {ranking.top.map(({ d, v }, i) => (
                <button key={d.cod} type="button" onClick={() => setSelected({ cod: d.cod, name: d.depto })} style={{
                  display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 8, alignItems: "center",
                  fontFamily: "inherit", cursor: "pointer", border: 0, background: "transparent",
                  padding: "4px 0", textAlign: "left", color: "var(--ink-2)",
                }}>
                  <span style={{ color: "var(--ink-3)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.depto}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: metricMeta.color }}>{pct(v * 100)}</span>
                </button>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 10, paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Menos {metricMeta.label.toLowerCase()}</div>
              <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                {ranking.bottom.map(({ d, v }, i) => (
                  <button key={d.cod} type="button" onClick={() => setSelected({ cod: d.cod, name: d.depto })} style={{
                    display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 8, alignItems: "center",
                    fontFamily: "inherit", cursor: "pointer", border: 0, background: "transparent",
                    padding: "4px 0", textAlign: "left", color: "var(--ink-2)",
                  }}>
                    <span style={{ color: "var(--ink-3)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.depto}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--ink-2)" }}>{pct(v * 100)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Escala */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Escala</div>
            <div style={{ height: 12, borderRadius: 3, background: `linear-gradient(90deg, ${shade(metricMeta.color, 0.05)} 0%, ${shade(metricMeta.color, 1)} 100%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
              <span>0%</span><span>{pct(scaleMax * 100, 0)}+</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Drill-down municipal */}
      {selected && munis && (
        <MetricMuniDetail
          codDep={selected.cod}
          deptoName={selected.name}
          metric={metric}
          metricMeta={metricMeta}
          munis={munis[String(selected.cod)] || []}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

// ─── Detalle municipal de la métrica seleccionada ───
function MetricMuniDetail({
  codDep, deptoName, metric, metricMeta, munis, onClose,
}: {
  codDep: number; deptoName: string; metric: Metric;
  metricMeta: typeof METRICS[number]; munis: MuniResult[]; onClose: () => void;
}) {
  void codDep;
  const rows = useMemo(() => {
    return munis.map(m => ({ m, v: muniValue(m, metric) }))
      .filter((x): x is { m: MuniResult; v: number } => x.v != null)
      .sort((a, b) => b.v - a.v);
  }, [munis, metric]);

  const max = rows.length ? rows[0].v : 0;

  return (
    <div style={{ marginTop: 28, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: metricMeta.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {deptoName} · {munis.length} municipios · {metricMeta.label}
        </div>
        <button type="button" onClick={onClose} style={{
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 6,
          background: "#fff", color: "var(--ink-2)",
        }}>cerrar ×</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.5fr) 1fr 90px", padding: "8px 12px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
        <div>Municipio</div>
        <div>{metricMeta.label}</div>
        <div style={{ textAlign: "right" }}>%</div>
      </div>
      <div style={{ maxHeight: 520, overflowY: "auto" }}>
        {rows.slice(0, 200).map(({ m, v }) => {
          const w = max > 0 ? (v / max) * 100 : 0;
          return (
            <div key={m.codMun} style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.5fr) 1fr 90px", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #F2F4F7", fontSize: 13, gap: 10 }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink)", fontWeight: 600 }}>{m.mun}</div>
              <div style={{ position: "relative", height: 14, background: "#F2F4F7", borderRadius: 3 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: metricMeta.color, borderRadius: 3, opacity: 0.85 }} />
              </div>
              <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: metricMeta.color, fontWeight: 600 }}>{pct(v * 100, 1)}</div>
            </div>
          );
        })}
        {rows.length > 200 && (
          <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
            Mostrando 200 de {rows.length}.
          </div>
        )}
      </div>
    </div>
  );
}
