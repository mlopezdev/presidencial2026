"use client";

import { useEffect, useMemo, useState } from "react";
import { CONGRESO_FILES, normalizaPartidoMovimiento, partidoColor, type Corporacion, type DeptoCongreso, type MuniCongreso, type MunisCongresoPorDepto, type PartidosFile } from "@/lib/congreso-data";
import { GEO_TO_DATA, GEOJSON_URL } from "@/lib/mapa-data";
import { geomToPath, makeProjection, shade, type GeoJSON } from "@/lib/mapa-utils";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

interface Loaded {
  partidos: PartidosFile;
  deptos: DeptoCongreso[];
  munis: MunisCongresoPorDepto;
}

export default function CongresoDashboard() {
  const [corp, setCorp] = useState<Corporacion>("senado");
  const [agruparMov, setAgruparMov] = useState(true); // útil sobre todo en Cámara
  const [data, setData] = useState<Record<Corporacion, Loaded | null>>({ senado: null, camara: null });
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selectedDep, setSelectedDep] = useState<{ cod: string; name: string } | null>(null);

  useEffect(() => { fetch(GEOJSON_URL).then(r => r.json()).then(setGeo); }, []);

  useEffect(() => {
    if (data[corp]) return;
    const files = CONGRESO_FILES[corp];
    Promise.all([
      fetch(files.partidos).then(r => r.json()),
      fetch(files.deptos).then(r => r.json()),
      fetch(files.munis).then(r => r.json()),
    ]).then(([p, d, m]) => setData(prev => ({ ...prev, [corp]: { partidos: p, deptos: d, munis: m } })));
    setSelectedDep(null);
  }, [corp, data]);

  const current = data[corp];

  // ─── Agrupar movimientos similares (Cámara) ───
  const partidosAgregados = useMemo(() => {
    if (!current) return [] as { nombre: string; votos: number }[];
    if (!agruparMov) return current.partidos.partidos.map(p => ({ nombre: p.nombre, votos: p.votos_nacional }));
    const agg = new Map<string, number>();
    current.partidos.partidos.forEach(p => {
      const k = normalizaPartidoMovimiento(p.nombre);
      agg.set(k, (agg.get(k) || 0) + p.votos_nacional);
    });
    return Array.from(agg.entries()).map(([nombre, votos]) => ({ nombre, votos })).sort((a, b) => b.votos - a.votos);
  }, [current, agruparMov]);

  // Helper para colapsar el record de partidos de un depto/muni igual que el nacional
  function agruparPartidos(p: Record<string, number>): Record<string, number> {
    if (!agruparMov) return p;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(p)) {
      const nk = normalizaPartidoMovimiento(k);
      out[nk] = (out[nk] || 0) + v;
    }
    return out;
  }

  const totalNacional = useMemo(() => partidosAgregados.reduce((s, p) => s + p.votos, 0), [partidosAgregados]);

  const totalInvalido = useMemo(() => {
    if (!current) return { blanco: 0, nulo: 0, no_marcado: 0 };
    return current.deptos.reduce((acc, d) => ({
      blanco: acc.blanco + d.blanco,
      nulo: acc.nulo + d.nulo,
      no_marcado: acc.no_marcado + d.no_marcado,
    }), { blanco: 0, nulo: 0, no_marcado: 0 });
  }, [current]);

  // Mapa: por cada depto en geojson, calcular partido ganador
  const ganadorPorDepto = useMemo(() => {
    if (!current) return new Map<string, { partido: string; votos: number; share: number; total: number }>();
    const m = new Map<string, { partido: string; votos: number; share: number; total: number }>();
    current.deptos.forEach(d => {
      const p = agruparPartidos(d.partidos);
      const entries = Object.entries(p);
      if (!entries.length) return;
      const [winner, votes] = entries.reduce((a, b) => b[1] > a[1] ? b : a);
      m.set(d.departamento, { partido: winner, votos: votes, share: votes / d.total, total: d.total });
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, agruparMov]);

  const W = 720, H = 720;
  const proj = useMemo(() => geo ? makeProjection(geo.features, W, H) : null, [geo]);

  const hoverDepto = useMemo(() => {
    if (!hover || !current) return undefined;
    const canon = GEO_TO_DATA[hover];
    if (!canon) return undefined;
    return current.deptos.find(d => d.departamento === canon);
  }, [hover, current]);

  // Drill-down muni
  const selectedMunis = useMemo(() => {
    if (!current || !selectedDep) return [] as MuniCongreso[];
    return current.munis[selectedDep.cod] || [];
  }, [current, selectedDep]);

  if (!current) return <div style={{ padding: 40, color: "var(--ink-3)" }}>Cargando datos de Congreso 2026…</div>;

  return (
    <div>
      {/* Controles globales */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10 }}>
          {(["senado", "camara"] as Corporacion[]).map(c => (
            <button key={c} type="button" onClick={() => setCorp(c)} style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "9px 20px", border: 0, borderRadius: 7,
              background: corp === c ? "#fff" : "transparent",
              color: corp === c ? "var(--ink)" : "var(--ink-2)",
              boxShadow: corp === c ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              textTransform: "capitalize",
            }}>{c}</button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={agruparMov} onChange={(e) => setAgruparMov(e.target.checked)} />
          Agrupar listas departamentales del mismo movimiento
        </label>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 40 }}>
        {[
          { label: "Votos válidos", value: fmt(totalNacional), color: "var(--ink)" },
          { label: "Partidos / movimientos", value: String(partidosAgregados.length), color: "var(--brand, #1E40AF)" },
          { label: "Candidatos con voto preferente", value: fmt(current.partidos.candidatos.length), color: "#7C3AED" },
          { label: "Voto blanco", value: fmt(totalInvalido.blanco), color: "#374151" },
          { label: "Voto nulo + no marcado", value: fmt(totalInvalido.nulo + totalInvalido.no_marcado), color: "#D97706" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: s.color, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Sección 1: Ranking nacional de partidos */}
      <section style={{ marginBottom: 64 }}>
        <h3 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Ranking de partidos
        </h3>
        <p style={{ fontSize: 14, color: "var(--ink-3)", margin: "0 0 18px" }}>Votos nacionales por {corp === "senado" ? "lista al Senado" : "movimiento en Cámara"}. {agruparMov && "Listas departamentales del mismo movimiento están agrupadas."}</p>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 20 }}>
          {partidosAgregados.slice(0, 20).map(p => {
            const share = (p.votos / totalNacional) * 100;
            const color = partidoColor(p.nombre);
            return (
              <div key={p.nombre} style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1.6fr) 1fr 90px 60px", gap: 14, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F2F4F7" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</span>
                </div>
                <div style={{ position: "relative", height: 12, background: "#F7F8FA", borderRadius: 3 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${share}%`, background: color, borderRadius: 3 }} />
                </div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-2)" }}>{fmt(p.votos)}</div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: color, fontSize: 14 }}>{pct(share, 1)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sección 2: Mapa */}
      <section style={{ marginBottom: 64 }}>
        <h3 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Partido ganador por departamento
        </h3>
        <p style={{ fontSize: 14, color: "var(--ink-3)", margin: "0 0 18px" }}>Color del partido más votado en cada depto. Intensidad = % obtenido. Click en un depto para ver detalle municipal.</p>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 12 }}>
            {!geo || !proj ? (
              <div style={{ height: 520, display: "grid", placeItems: "center", color: "var(--ink-3)" }}>Cargando mapa…</div>
            ) : (
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
                {geo.features.map((f, i) => {
                  const name = f.properties.NOMBRE_DPT;
                  const canon = GEO_TO_DATA[name];
                  const g = canon ? ganadorPorDepto.get(canon) : undefined;
                  const fill = !g ? "#E5E7EB" : shade(partidoColor(g.partido), g.share);
                  const isHover = hover === name;
                  const isSelected = canon && selectedDep?.name === canon;
                  const dep = canon ? current.deptos.find(d => d.departamento === canon) : undefined;
                  return (
                    <path key={i} d={geomToPath(f.geometry, proj)} fill={fill}
                      stroke={isSelected ? "#B3261E" : isHover ? "#1D1D1F" : "rgba(0,0,0,0.35)"}
                      strokeWidth={isSelected ? 2 : isHover ? 1.6 : 0.5}
                      onMouseEnter={() => setHover(name)}
                      onMouseLeave={() => setHover(h => h === name ? null : h)}
                      onClick={() => { if (dep) setSelectedDep({ cod: dep.id_depto, name: dep.departamento }); }}
                      style={{ cursor: dep ? "pointer" : "default" }}
                    />
                  );
                })}
              </svg>
            )}
          </div>
          <aside style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 16 }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                {hoverDepto ? hoverDepto.departamento : "Pasa el cursor por un depto"}
              </div>
              {hoverDepto ? (
                <DeptoBreakdown depto={hoverDepto} agruparPartidos={agruparPartidos} />
              ) : (
                <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
                  Cada departamento se colorea según el partido / movimiento más votado para {corp === "senado" ? "Senado" : "Cámara"}.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Sección 3: Top candidatos */}
      <section style={{ marginBottom: 64 }}>
        <h3 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Top candidatos por voto preferente
        </h3>
        <p style={{ fontSize: 14, color: "var(--ink-3)", margin: "0 0 18px" }}>Los {Math.min(50, current.partidos.candidatos.length)} candidatos más votados nacional para {corp === "senado" ? "Senado" : "Cámara"}.</p>
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "40px minmax(180px, 1.4fr) 1fr 110px", padding: "12px 18px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
            <div>#</div>
            <div>Candidato</div>
            <div>Partido</div>
            <div style={{ textAlign: "right" }}>Votos</div>
          </div>
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            {current.partidos.candidatos.slice(0, 50).map((c, i) => {
              const partidoDisplay = agruparMov ? normalizaPartidoMovimiento(c.partido) : c.partido;
              return (
                <div key={c.cedula} style={{ display: "grid", gridTemplateColumns: "40px minmax(180px, 1.4fr) 1fr 110px", padding: "10px 18px", borderBottom: "1px solid #F2F4F7", fontSize: 13, gap: 10, alignItems: "center" }}>
                  <div style={{ color: "var(--ink-3)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>CC {c.cedula}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: partidoColor(partidoDisplay), flexShrink: 0 }} />
                    <span style={{ color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{partidoDisplay}</span>
                  </div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--ink)" }}>{fmt(c.votos)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección 4: Drill-down muni cuando hay depto seleccionado */}
      {selectedDep && (
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 24, fontWeight: 600, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
              {selectedDep.name} · detalle municipal
            </h3>
            <button type="button" onClick={() => setSelectedDep(null)} style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
              padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 6,
              background: "#fff", color: "var(--ink-2)",
            }}>cerrar ×</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.4fr) 110px 1fr", padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
              <div>Municipio</div>
              <div style={{ textAlign: "right" }}>Votos</div>
              <div>Composición de partidos (top 6)</div>
            </div>
            <div style={{ maxHeight: 600, overflowY: "auto" }}>
              {selectedMunis.slice(0, 200).map(m => {
                const agg = agruparPartidos(m.partidos);
                const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 6);
                return (
                  <div key={m.id_muni} style={{ display: "grid", gridTemplateColumns: "minmax(160px, 1.4fr) 110px 1fr", padding: "10px 16px", borderBottom: "1px solid #F2F4F7", fontSize: 13, gap: 12, alignItems: "center" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.municipio}</div>
                    <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{fmt(m.total)}</div>
                    <div>
                      <div style={{ display: "flex", height: 12, borderRadius: 3, overflow: "hidden", background: "#F2F4F7" }}>
                        {entries.map(([k, v]) => {
                          const w = (v / m.total) * 100;
                          return <div key={k} title={`${k}: ${pct((v / m.total) * 100)}`} style={{ width: `${w}%`, background: partidoColor(k) }} />;
                        })}
                      </div>
                      {entries[0] && (
                        <div style={{ marginTop: 3, fontSize: 11, color: "var(--ink-3)" }}>
                          Gana <span style={{ color: partidoColor(entries[0][0]), fontWeight: 700 }}>{entries[0][0].length > 35 ? entries[0][0].slice(0, 35) + "…" : entries[0][0]}</span> con {pct((entries[0][1] / m.total) * 100)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {selectedMunis.length > 200 && (
                <div style={{ padding: "10px 16px", fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
                  Mostrando 200 de {selectedMunis.length}.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DeptoBreakdown({ depto, agruparPartidos }: { depto: DeptoCongreso; agruparPartidos: (p: Record<string, number>) => Record<string, number> }) {
  const agg = agruparPartidos(depto.partidos);
  const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 10 }}>
        Total: <strong style={{ color: "var(--ink)" }}>{fmt(depto.total)}</strong> votos · Blanco {fmt(depto.blanco)} · Nulo {fmt(depto.nulo)}
      </div>
      <div style={{ display: "grid", gap: 5, fontSize: 12 }}>
        {entries.map(([k, v], i) => {
          const share = (v / depto.total) * 100;
          const color = partidoColor(k);
          return (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0 }} />
                <span style={{ color: i === 0 ? "var(--ink)" : "var(--ink-2)", fontWeight: i === 0 ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span>
              </div>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{pct(share)}</span>
            </div>
          );
        })}
      </div>
      {depto.top_candidatos.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Top candidatos locales</div>
          <div style={{ display: "grid", gap: 4, fontSize: 12 }}>
            {depto.top_candidatos.slice(0, 5).map(c => (
              <div key={c.cedula} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
                <span style={{ color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nombre}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-3)" }}>{fmt(c.votos)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
