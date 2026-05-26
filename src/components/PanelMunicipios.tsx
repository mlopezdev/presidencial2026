"use client";

import { useEffect, useMemo, useState } from "react";
import { CAND_META, MUNI_FILES, type MunisByDepto, type MuniResult } from "@/lib/mapa-data";

type Round = "r1" | "r2";
type SortBy = "total" | "share" | "abst";

const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmt = (n: number) => n.toLocaleString("es-CO");

interface Props {
  round: Round;
  codDep: number | null;
  deptoName: string | null;
  onClose: () => void;
}

export default function PanelMunicipios({ round, codDep, deptoName, onClose }: Props) {
  const [all, setAll] = useState<MunisByDepto | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("total");
  const [candFocus, setCandFocus] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(MUNI_FILES[`2022-${round}` as keyof typeof MUNI_FILES])
      .then((r) => r.json())
      .then(setAll);
  }, [round]);

  const munis: MuniResult[] = useMemo(() => {
    if (!all || codDep == null) return [];
    return all[String(codDep)] || [];
  }, [all, codDep]);

  const allCands = useMemo(() => {
    const tot: Record<string, number> = {};
    munis.forEach((m) => Object.entries(m.candidatos).forEach(([k, v]) => { tot[k] = (tot[k] || 0) + v; }));
    return Object.keys(tot).sort((a, b) => tot[b] - tot[a]);
  }, [munis]);

  useEffect(() => {
    if (!candFocus && allCands.length) setCandFocus(allCands[0]);
    if (candFocus && allCands.length && !allCands.includes(candFocus)) setCandFocus(allCands[0]);
  }, [allCands, candFocus]);

  const sorted = useMemo(() => {
    const filtered = search
      ? munis.filter((m) => m.mun.includes(search.toUpperCase()))
      : munis;
    const arr = [...filtered];
    if (sortBy === "total") arr.sort((a, b) => b.total - a.total);
    else if (sortBy === "share") arr.sort((a, b) => {
      const sa = candFocus ? (a.candidatos[candFocus] || 0) / (a.total || 1) : 0;
      const sb = candFocus ? (b.candidatos[candFocus] || 0) / (b.total || 1) : 0;
      return sb - sa;
    });
    else if (sortBy === "abst") arr.sort((a, b) => {
      const aa = a.participacion ? a.participacion.abst / (a.participacion.censo || 1) : 0;
      const ab = b.participacion ? b.participacion.abst / (b.participacion.censo || 1) : 0;
      return ab - aa;
    });
    return arr;
  }, [munis, sortBy, candFocus, search]);

  if (codDep == null) return null;

  const totals = munis.reduce((acc, m) => {
    acc.total += m.total;
    Object.entries(m.candidatos).forEach(([k, v]) => { acc.cands[k] = (acc.cands[k] || 0) + v; });
    if (m.participacion) {
      acc.censo += m.participacion.censo;
      acc.abst += m.participacion.abst;
    }
    return acc;
  }, { total: 0, cands: {} as Record<string, number>, censo: 0, abst: 0 });

  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B3261E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Drill-down municipal · {round === "r1" ? "1ra vuelta" : "2da vuelta"}
        </div>
        <button type="button" onClick={onClose} style={{
          fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 6,
          background: "#fff", color: "var(--ink-2)",
        }}>← volver al mapa</button>
      </div>
      <h2 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 6px", lineHeight: 1.1 }}>
        {deptoName} · {munis.length} municipios
      </h2>
      <p style={{ margin: "0 0 24px", fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5 }}>
        Resultados consolidados por municipio. Total del depto: <strong>{fmt(totals.total)}</strong> votos · Abstención: <strong>{totals.censo > 0 ? pct((totals.abst / totals.censo) * 100) : "—"}</strong>
      </p>

      {/* Controles */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input type="search" placeholder="Buscar municipio…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ fontFamily: "inherit", fontSize: 14, padding: "9px 14px", border: "1px solid var(--line)", borderRadius: 9, background: "#fff", color: "var(--ink)", minWidth: 220 }}
        />
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#F2F4F7", borderRadius: 10 }}>
          {([{ k: "total", l: "Más votos" }, { k: "share", l: "% candidato" }, { k: "abst", l: "Más abstención" }] as { k: SortBy; l: string }[]).map((o) => (
            <button key={o.k} type="button" onClick={() => setSortBy(o.k)} style={{
              fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              padding: "8px 14px", border: 0, borderRadius: 7,
              background: sortBy === o.k ? "#fff" : "transparent",
              color: sortBy === o.k ? "var(--ink)" : "var(--ink-2)",
              boxShadow: sortBy === o.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>{o.l}</button>
          ))}
        </div>
        {sortBy === "share" && (
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

      {/* Resumen agregado del depto */}
      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Total del depto por candidato
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {Object.entries(totals.cands).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
            const share = (v / totals.total) * 100;
            const meta = CAND_META[k];
            return (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: meta?.color || "#9CA3AF" }} />
                  <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>{meta?.short || k}</span>
                </div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>
                  {pct(share)} <span style={{ color: "var(--ink-3)", fontWeight: 400, fontSize: 12 }}>· {fmt(v)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de municipios */}
      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1.5fr) 90px 1fr 90px", padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "#FAFBFC" }}>
          <div>Municipio</div>
          <div style={{ textAlign: "right" }}>Votos</div>
          <div>Composición</div>
          <div style={{ textAlign: "right" }}>Abst.</div>
        </div>
        <div style={{ maxHeight: 600, overflowY: "auto" }}>
          {sorted.slice(0, 200).map((m) => {
            const entries = Object.entries(m.candidatos).sort((a, b) => b[1] - a[1]);
            const [winner, wv] = entries[0];
            const winnerShare = (wv / m.total) * 100;
            const abst = m.participacion ? (m.participacion.abst / (m.participacion.censo || 1)) * 100 : null;
            const winnerMeta = CAND_META[winner];
            return (
              <div key={m.codMun} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1.5fr) 90px 1fr 90px", padding: "10px 16px", borderBottom: "1px solid #F2F4F7", alignItems: "center", fontSize: 13, gap: 12 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: "var(--ink)" }}>{m.mun}</div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{fmt(m.total)}</div>
                <div>
                  <div style={{ display: "flex", height: 12, borderRadius: 3, overflow: "hidden", background: "#F2F4F7" }}>
                    {entries.map(([k, v]) => {
                      const w = (v / m.total) * 100;
                      return <div key={k} title={`${CAND_META[k]?.short || k}: ${pct((v / m.total) * 100)}`} style={{ width: `${w}%`, background: CAND_META[k]?.color || "#9CA3AF" }} />;
                    })}
                  </div>
                  <div style={{ marginTop: 3, fontSize: 11, color: "var(--ink-3)" }}>
                    Gana <span style={{ color: winnerMeta?.color, fontWeight: 700 }}>{winnerMeta?.short || winner}</span> con {pct(winnerShare)}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: abst != null && abst > 55 ? "#B3261E" : "var(--ink-2)" }}>
                  {abst != null ? pct(abst, 1) : "—"}
                </div>
              </div>
            );
          })}
          {sorted.length > 200 && (
            <div style={{ padding: "12px 16px", fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
              Mostrando 200 de {sorted.length}. Refina la búsqueda.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
