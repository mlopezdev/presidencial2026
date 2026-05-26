"use client";

import { useEffect, useMemo, useState } from "react";
import { CAND_META, GEO_TO_DATA, GEOJSON_URL, MAPA_FILES, type DeptResult } from "@/lib/mapa-data";

type Year = 2018 | 2022;
type Round = "r1" | "r2";
type Mode = "ganador" | "candidato";

interface GeoFeature {
  type: "Feature";
  properties: { NOMBRE_DPT: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}
interface GeoJSON { type: "FeatureCollection"; features: GeoFeature[] }

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

// Proyección equirectangular sobre bounding box → SVG
function makeProjection(features: GeoFeature[], width: number, height: number) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const walk = (coords: unknown) => {
    if (typeof (coords as number[])[0] === "number") {
      const [lng, lat] = coords as number[];
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else (coords as unknown[]).forEach(walk);
  };
  features.forEach((f) => walk(f.geometry.coordinates));
  // Mercator-lite: scale lng cos(midLat)
  const midLat = ((minLat + maxLat) / 2) * Math.PI / 180;
  const kx = Math.cos(midLat);
  const w = (maxLng - minLng) * kx;
  const h = maxLat - minLat;
  const pad = 10;
  const s = Math.min((width - pad * 2) / w, (height - pad * 2) / h);
  const ox = (width - w * s) / 2;
  const oy = (height - h * s) / 2;
  return (lng: number, lat: number) => [
    ox + (lng - minLng) * kx * s,
    oy + (maxLat - lat) * s,
  ];
}

function geomToPath(geom: GeoFeature["geometry"], proj: (lng: number, lat: number) => number[]): string {
  const ring = (r: number[][]) => r.map(([lng, lat], i) => {
    const [x, y] = proj(lng, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + "Z";
  if (geom.type === "Polygon") {
    return (geom.coordinates as number[][][]).map(ring).join(" ");
  }
  return (geom.coordinates as number[][][][]).flat().map(ring).join(" ");
}

function shade(hex: string, share: number) {
  // share ∈ [0,1] → mezcla con blanco para tonalidad
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const k = 0.15 + 0.85 * Math.max(0, Math.min(1, share)); // 15% mínimo para que se vea
  const mix = (c: number) => Math.round(255 - (255 - c) * k);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

interface Props { year: Year; onSelect?: (codDep: number, deptoName: string, round: Round) => void; selectedCodDep?: number | null; }

export default function MapaDepto({ year, onSelect, selectedCodDep }: Props) {
  const [round, setRound] = useState<Round>("r1");
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [data, setData] = useState<DeptResult[] | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("ganador");
  const [candFocus, setCandFocus] = useState<string | null>(null);

  useEffect(() => {
    fetch(GEOJSON_URL).then((r) => r.json()).then(setGeo);
  }, []);

  useEffect(() => {
    const key = `${year}-${round}` as keyof typeof MAPA_FILES;
    fetch(MAPA_FILES[key]).then((r) => r.json()).then((d: DeptResult[]) => {
      setData(d);
      // reset cand focus if doesn't exist
      const cands = Array.from(new Set(d.flatMap((x) => Object.keys(x.candidatos))));
      if (!candFocus || !cands.includes(candFocus)) setCandFocus(cands[0] || null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, round]);

  const dataByDepto = useMemo(() => {
    const m = new Map<string, DeptResult>();
    data?.forEach((d) => m.set(d.depto, d));
    return m;
  }, [data]);

  const allCands = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    data.forEach((d) => Object.keys(d.candidatos).forEach((c) => set.add(c)));
    // ordenar por votos totales desc
    const tot: Record<string, number> = {};
    data.forEach((d) => Object.entries(d.candidatos).forEach(([k, v]) => { tot[k] = (tot[k] || 0) + v; }));
    return Array.from(set).sort((a, b) => (tot[b] || 0) - (tot[a] || 0));
  }, [data]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);

  const featureFill = (name: string): { fill: string; depto?: DeptResult; winner?: string; share?: number } => {
    const canonical = GEO_TO_DATA[name];
    const d = canonical ? dataByDepto.get(canonical) : undefined;
    if (!d) return { fill: "#E5E7EB" };
    const entries = Object.entries(d.candidatos);
    if (mode === "ganador") {
      const [winner, votes] = entries.reduce((a, b) => b[1] > a[1] ? b : a);
      const share = votes / d.total;
      const color = CAND_META[winner]?.color || "#6B7280";
      return { fill: shade(color, share), depto: d, winner, share };
    } else {
      const votes = candFocus ? (d.candidatos[candFocus] || 0) : 0;
      const share = d.total > 0 ? votes / d.total : 0;
      const color = candFocus ? (CAND_META[candFocus]?.color || "#6B7280") : "#6B7280";
      return { fill: shade(color, share), depto: d, winner: candFocus || undefined, share };
    }
  };

  const hoverDepto = hover ? dataByDepto.get(GEO_TO_DATA[hover] || "") : undefined;

  // candidato seleccionado para leyenda en modo "candidato"
  const candFocusMeta = candFocus ? CAND_META[candFocus] : undefined;

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 820 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B3261E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Mapa departamental</div>
        <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.1 }}>
          Cómo votó cada departamento
        </h2>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
          Resultados consolidados por departamento. Cambia entre <strong>ganador</strong> (color del candidato más votado, intensidad = margen) o <strong>candidato</strong> (intensidad = % obtenido en cada departamento).
          {year === 2022 && <> · <strong>Haz click en un departamento</strong> para ver sus municipios.</>}
        </p>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10 }}>
          {(["r1", "r2"] as Round[]).map((r) => (
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
          {(["ganador", "candidato"] as Mode[]).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 16px", border: 0, borderRadius: 7,
              background: mode === m ? "#fff" : "transparent",
              color: mode === m ? "var(--ink)" : "var(--ink-2)",
              boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none", textTransform: "capitalize",
            }}>{m === "ganador" ? "Ganador por depto" : "% por candidato"}</button>
          ))}
        </div>
        {mode === "candidato" && (
          <select value={candFocus || ""} onChange={(e) => setCandFocus(e.target.value)} style={{
            fontFamily: "inherit", fontSize: 14, padding: "9px 14px", border: "1px solid var(--line)",
            borderRadius: 9, background: "#fff", color: "var(--ink)", cursor: "pointer",
          }}>
            {allCands.map((c) => (
              <option key={c} value={c}>{CAND_META[c]?.short || c}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24, alignItems: "start" }}>
        {/* Mapa */}
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12, position: "relative" }}>
          {!geo || !data || !proj ? (
            <div style={{ height: 520, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando mapa…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              {geo.features.map((f, i) => {
                const name = f.properties.NOMBRE_DPT;
                const path = geomToPath(f.geometry, proj);
                const { fill, depto } = featureFill(name);
                const isHover = hover === name;
                const isSelected = depto && selectedCodDep === depto.cod;
                const clickable = !!(onSelect && depto && year === 2022);
                return (
                  <path key={i} d={path} fill={fill}
                    stroke={isSelected ? "#B3261E" : isHover ? "#1D1D1F" : "rgba(0,0,0,0.35)"}
                    strokeWidth={isSelected ? 2 : isHover ? 1.6 : 0.5}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover((h) => (h === name ? null : h))}
                    onClick={() => { if (clickable && depto) onSelect!(depto.cod, depto.depto, round); }}
                    style={{ cursor: clickable ? "pointer" : "default", transition: "stroke-width 120ms" }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Panel lateral */}
        <aside style={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {hoverDepto ? hoverDepto.depto : "Pasa el cursor por un departamento"}
            </div>
            {hoverDepto ? (
              <>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>
                  Total: <strong style={{ color: "var(--ink)" }}>{fmt(hoverDepto.total)}</strong> votos
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {Object.entries(hoverDepto.candidatos)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, votes], i) => {
                      const share = (votes / hoverDepto.total) * 100;
                      const meta = CAND_META[name];
                      return (
                        <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, fontSize: 13 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: meta?.color || "#9CA3AF", flexShrink: 0 }} />
                            <span style={{ color: i === 0 ? "var(--ink)" : "var(--ink-2)", fontWeight: i === 0 ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {meta?.short || name}
                            </span>
                          </div>
                          <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{pct(share, 1)}</span>
                        </div>
                      );
                    })}
                </div>
                {hoverDepto.participacion && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--ink-3)" }}>
                    Censo: {fmt(hoverDepto.participacion.censo)} · Abstención: {pct((hoverDepto.participacion.abst / hoverDepto.participacion.censo) * 100)}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Cada color identifica al candidato {mode === "ganador" ? "ganador del departamento" : "seleccionado"}. La intensidad refleja {mode === "ganador" ? "su porcentaje obtenido" : "el % de votos en cada departamento"}.
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {mode === "ganador" ? "Candidatos en la contienda" : `${CAND_META[candFocus || ""]?.short || candFocus} · escala`}
            </div>
            {mode === "ganador" ? (
              <div style={{ display: "grid", gap: 6 }}>
                {allCands.map((c) => {
                  const meta = CAND_META[c];
                  return (
                    <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 3, background: meta?.color || "#9CA3AF" }} />
                      <span style={{ color: "var(--ink-2)" }}>{meta?.short || c}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{meta?.spectrum}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div style={{ height: 12, borderRadius: 3, background: `linear-gradient(90deg, ${shade(candFocusMeta?.color || "#6B7280", 0.05)} 0%, ${shade(candFocusMeta?.color || "#6B7280", 1)} 100%)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                  <span>0%</span><span>100%</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
