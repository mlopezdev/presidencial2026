"use client";

import { useState, useMemo, useRef } from "react";
import { ALL_CANDIDATES, IDEOLOGY_MATRIX, getCandidatePhoto, type Candidate } from "@/lib/data";
import { COMPARE_QUESTIONS, COMPARE_CATEGORIES } from "@/lib/compare-questions";
import { TEMAS, getPosicion, type Posicion } from "@/lib/posiciones-data";
import { Avatar } from "@/components/ui/Avatar";
import { Chevron } from "@/components/ui/Chevron";

// ─── Vista: Temas polémicos (todos los candidatos) ───
const POS_META: Record<Posicion, { icon: string; color: string; bg: string }> = {
  si:             { icon: "✓", color: "#1F8F5C", bg: "rgba(31,143,92,0.10)" },
  no:             { icon: "✕", color: "#C8453C", bg: "rgba(200,69,60,0.10)" },
  no_pronunciado: { icon: "—", color: "#86868B", bg: "rgba(134,134,139,0.07)" },
};

function TemasView() {
  const [activeTema, setActiveTema] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
          color: "var(--brand)", background: "rgba(47,107,138,0.1)", padding: "5px 11px",
          borderRadius: 999, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
          ⚡ Temas polémicos
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
          Los 14 frente a frente
        </h3>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)" }}>
          Posición de cada candidato en 15 temas polémicos. Toca un tema para ver el detalle.
        </p>
      </div>

      {/* Leyenda */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        {(["si","no","no_pronunciado"] as Posicion[]).map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: POS_META[p].bg,
              border: `1px solid ${POS_META[p].color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: POS_META[p].color }}>
              {POS_META[p].icon}
            </span>
            {p === "si" ? "Sí" : p === "no" ? "No" : "Sin pronunciarse"}
          </div>
        ))}
      </div>

      {/* Header con avatares */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 900 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `minmax(280px,1fr) repeat(${ALL_CANDIDATES.length}, 48px)`,
            gap: 4, padding: "0 0 12px", borderBottom: "2px solid var(--line)",
            alignItems: "flex-end",
          }}>
            <div />
            {ALL_CANDIDATES.map((c) => (
              <div key={c.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ boxShadow: `0 0 0 2px ${c.color}`, borderRadius: "50%" }}>
                  <Avatar name={c.name} color={c.color} size={36} photo={getCandidatePhoto(c.name)} />
                </div>
                <div style={{ fontSize: 8, fontWeight: 600, color: "var(--ink-3)", textAlign: "center",
                  lineHeight: 1.2, width: 44,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {c.name.split(" ").slice(-1)[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Filas de temas */}
          {TEMAS.map((tema) => {
            const isActive = activeTema === tema.id;
            return (
              <div key={tema.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div
                  onClick={() => setActiveTema(isActive ? null : tema.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `minmax(280px,1fr) repeat(${ALL_CANDIDATES.length}, 48px)`,
                    gap: 4, padding: "10px 0", alignItems: "center", cursor: "pointer",
                    background: isActive ? "rgba(47,107,138,0.04)" : "transparent",
                    transition: "background 140ms ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#FAFBFC"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", flexShrink: 0 }}>
                      {tema.numero}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", lineHeight: 1.35 }}>
                      {tema.pregunta}
                    </span>
                  </div>
                  {ALL_CANDIDATES.map((c) => {
                    const pos = getPosicion(c.name, tema.id);
                    const meta = POS_META[pos];
                    return (
                      <div key={c.name} style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: meta.bg, border: `1px solid ${meta.color}25`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 700, color: meta.color,
                        }}>
                          {meta.icon}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detalle expandido */}
                {isActive && (
                  <div style={{ padding: "12px 0 20px", background: "rgba(47,107,138,0.03)" }}>
                    <div style={{ padding: "0 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {(["si","no","no_pronunciado"] as Posicion[]).map((p) => {
                        const group = ALL_CANDIDATES.filter((c) => getPosicion(c.name, tema.id) === p);
                        if (!group.length) return null;
                        const meta = POS_META[p];
                        return (
                          <div key={p} style={{
                            flex: "1 1 200px", background: "#fff", borderRadius: 14, padding: "14px 16px",
                            border: `1px solid ${meta.color}20`,
                          }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: meta.color,
                              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                              {meta.icon} {p === "si" ? "Sí" : p === "no" ? "No" : "Sin pronunciarse"}
                              <span style={{ marginLeft: 6, fontWeight: 500, color: "var(--ink-3)" }}>({group.length})</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {group.map((c) => (
                                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <Avatar name={c.name} color={c.color} size={24} photo={getCandidatePhoto(c.name)} />
                                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{c.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const COMPARE_NAMES = ["Iván Cepeda", "Abelardo de la Espriella", "Paloma Valencia", "Claudia López", "Roy Barreras", "Sergio Fajardo", "Miguel Uribe Londoño", "Luis Gilberto Murillo"];

// ─── Matriz ideológica SVG ───
function IdeologyMatrixView() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const plotted = useMemo(() => ALL_CANDIDATES.map((c) => {
    const coords = IDEOLOGY_MATRIX[c.name];
    if (!coords) return null;
    return { ...c, ...coords };
  }).filter(Boolean) as (Candidate & { econ: number; social: number })[], []);

  const W = 1200, H = 900, pad = 90;
  const toX = (econ: number) => pad + ((econ + 1) / 2) * (W - 2 * pad);
  const toY = (social: number) => pad + ((social + 1) / 2) * (H - 2 * pad);

  const active = pinned || hovered;
  const activeCand = plotted.find((c) => c.name === active);

  const quadrantName = (c: { econ: number; social: number }) => {
    const isLeft = c.econ < 0, isProg = c.social < 0;
    if (isLeft && isProg) return { label: "Progresista estatista", color: "#B3261E" };
    if (!isLeft && isProg) return { label: "Progresista liberal", color: "#2F6B8A" };
    if (isLeft && !isProg) return { label: "Conservador estatista", color: "#8B5A3C" };
    return { label: "Conservador liberal", color: "#1E40AF" };
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--brand)", background: "rgba(47,107,138,0.1)", padding: "5px 11px", borderRadius: 999, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
          ⊞ Matriz ideológica
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1,
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
          ¿Hacia dónde apunta cada candidato?
        </h3>
        <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.45 }}>
          Pasa el cursor sobre cualquier punto para ver detalles. Toca para fijar la selección.
        </p>
      </div>

      <div ref={wrapRef} onMouseMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (r) setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
      }} style={{ background: "linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)", border: "1px solid var(--line)", borderRadius: 28, padding: 16, position: "relative", overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <rect x={pad} y={pad} width={(W - 2*pad)/2} height={(H - 2*pad)/2} fill="#B3261E" opacity="0.045" />
          <rect x={pad + (W-2*pad)/2} y={pad} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="#2F6B8A" opacity="0.045" />
          <rect x={pad} y={pad + (H-2*pad)/2} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="#8B5A3C" opacity="0.045" />
          <rect x={pad + (W-2*pad)/2} y={pad + (H-2*pad)/2} width={(W-2*pad)/2} height={(H-2*pad)/2} fill="#1E40AF" opacity="0.045" />
          {[-0.75,-0.5,-0.25,0.25,0.5,0.75].map((v) => <line key={"gx"+v} x1={toX(v)} y1={pad} x2={toX(v)} y2={H-pad} stroke="rgba(0,0,0,0.06)" strokeDasharray="2 6" />)}
          {[-0.75,-0.5,-0.25,0.25,0.5,0.75].map((v) => <line key={"gy"+v} x1={pad} y1={toY(v)} x2={W-pad} y2={toY(v)} stroke="rgba(0,0,0,0.06)" strokeDasharray="2 6" />)}
          <rect x={pad} y={pad} width={W-2*pad} height={H-2*pad} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" rx="12" />
          <line x1={pad} y1={toY(0)} x2={W-pad} y2={toY(0)} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
          <line x1={toX(0)} y1={pad} x2={toX(0)} y2={H-pad} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
          <text x={pad+6} y={toY(0)-14} fontSize="16" fill="#515154" textAnchor="start" fontWeight="700" letterSpacing="0.08em">← ESTADO</text>
          <text x={W-pad-6} y={toY(0)-14} fontSize="16" fill="#515154" textAnchor="end" fontWeight="700" letterSpacing="0.08em">MERCADO →</text>
          <text x={toX(0)+14} y={pad+22} fontSize="16" fill="#515154" fontWeight="700" letterSpacing="0.08em">↑ PROGRESISTA</text>
          <text x={toX(0)+14} y={H-pad-10} fontSize="16" fill="#515154" fontWeight="700" letterSpacing="0.08em">↓ CONSERVADOR</text>
          {activeCand && (
            <g>
              <circle cx={toX(activeCand.econ)} cy={toY(activeCand.social)} r={34} fill={activeCand.color} opacity="0.12" />
              <circle cx={toX(activeCand.econ)} cy={toY(activeCand.social)} r={24} fill="none" stroke={activeCand.color} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5" />
            </g>
          )}
          {plotted.map((c) => {
            const cx = toX(c.econ), cy = toY(c.social);
            const isActive = active === c.name, dimmed = active && !isActive;
            const r = isActive ? 18 : 14;
            return (
              <g key={c.name} onMouseEnter={() => setHovered(c.name)} onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned(pinned === c.name ? null : c.name)} style={{ cursor: "pointer" }} opacity={dimmed ? 0.35 : 1}>
                <circle cx={cx} cy={cy} r={30} fill="transparent" />
                <circle cx={cx} cy={cy} r={r} fill={c.color} stroke="#fff" strokeWidth={isActive ? 4 : 3}
                  style={{ transition: "all 200ms cubic-bezier(0.2,0.8,0.2,1)" }} />
                {isActive && pinned === c.name && <circle cx={cx} cy={cy} r={r+6} fill="none" stroke={c.color} strokeWidth="2" />}
              </g>
            );
          })}
        </svg>
        {activeCand && (() => {
          const q = quadrantName(activeCand);
          const tooltipW = 300;
          const rect = wrapRef.current?.getBoundingClientRect();
          const maxX = rect?.width || 1200, maxY = rect?.height || 900;
          let left = cursor.x + 18, top = cursor.y + 18;
          if (left + tooltipW > maxX - 12) left = cursor.x - tooltipW - 18;
          if (top + 180 > maxY - 12) top = cursor.y - 180 - 18;
          return (
            <div style={{ position: "absolute", left, top, width: tooltipW, background: "#fff", borderRadius: 16, boxShadow: "0 24px 60px -20px rgba(13,30,45,0.3), 0 0 0 1px rgba(0,0,0,0.06)", padding: 18, pointerEvents: "none", zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <Avatar name={activeCand.name} color={activeCand.color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeCand.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{activeCand.party}</div>
                </div>
              </div>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: q.color, background: q.color + "18", padding: "4px 10px", borderRadius: 6, marginBottom: 10, textTransform: "uppercase" }}>{q.label}</div>
              <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}>
                  <span>Economía</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{activeCand.econ >= 0 ? "Mercado" : "Estado"} · {activeCand.econ >= 0 ? "+" : ""}{activeCand.econ.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}>
                  <span>Social</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{activeCand.social >= 0 ? "Conservador" : "Progresista"} · {activeCand.social >= 0 ? "+" : ""}{activeCand.social.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>{plotted.length} candidatos en la matriz</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {plotted.map((c) => {
            const isActive = active === c.name;
            return (
              <button key={c.name} type="button" onClick={() => setPinned(pinned === c.name ? null : c.name)}
                onMouseEnter={() => setHovered(c.name)} onMouseLeave={() => setHovered(null)}
                style={{
                  fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                  padding: "8px 14px 8px 8px", borderRadius: 999,
                  border: isActive ? `1.5px solid ${c.color}` : "1px solid rgba(0,0,0,0.1)",
                  background: isActive ? `${c.color}12` : "#fff",
                  color: "var(--ink)", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "all 140ms ease",
                }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5 }}>
        <strong>Horizontal:</strong> intervención del Estado ←→ libre mercado · <strong>Vertical:</strong> valores progresistas ↑↓ conservadores.
        La ubicación es una aproximación basada en declaraciones públicas.
      </p>
    </div>
  );
}

// ─── Fila de pregunta ───
function QuestionRow({ question, candidates, expanded, onToggle, activeCandidate, setActiveCandidate }: {
  question: typeof COMPARE_QUESTIONS[0]; candidates: Candidate[];
  expanded: boolean; onToggle: () => void;
  activeCandidate: string | null; setActiveCandidate: (n: string | null) => void;
}) {
  const answerFor = (name: string) => question.yes.includes(name) ? "yes" : question.no.includes(name) ? "no" : "na";

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `minmax(280px, 1fr) repeat(${candidates.length}, 64px) 48px`,
        alignItems: "center", padding: "20px 28px", gap: 8, cursor: "pointer",
        transition: "background 160ms ease",
      }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FAFBFC"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        onClick={onToggle}>
        <div style={{ paddingRight: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", background: "#F2F4F7", padding: "3px 10px", borderRadius: 999 }}>{question.cat}</span>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              <span style={{ color: "#1F8F5C", fontWeight: 600 }}>{question.yes.filter(n => candidates.some(c => c.name === n)).length} Sí</span>
              {" · "}
              <span style={{ color: "#C8453C", fontWeight: 600 }}>{question.no.filter(n => candidates.some(c => c.name === n)).length} No</span>
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1.35 }}>{question.q}</div>
        </div>
        {candidates.map((c) => {
          const ans = answerFor(c.name);
          const bg = ans === "yes" ? "#1F8F5C" : ans === "no" ? "#C8453C" : "#E8EEF3";
          const fg = ans === "na" ? "#86868B" : "#fff";
          const icon = ans === "yes" ? "✓" : ans === "no" ? "✕" : "—";
          const isActive = expanded && activeCandidate === c.name;
          return (
            <div key={c.name} style={{ display: "flex", justifyContent: "center" }}>
              <button type="button" disabled={ans === "na"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (ans === "na") return;
                  if (expanded && activeCandidate === c.name) onToggle();
                  else { if (!expanded) onToggle(); setActiveCandidate(c.name); }
                }}
                style={{
                  width: 44, height: 44, borderRadius: "50%", border: 0, cursor: ans === "na" ? "default" : "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 600, fontFamily: "inherit",
                  background: bg, color: fg,
                  boxShadow: isActive ? "0 0 0 3px rgba(47,107,138,0.35)" : "none",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                }}>
                {icon}
              </button>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", color: "var(--ink-3)" }}>
          <div style={{ transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 220ms ease" }}>
            <Chevron dir="right" />
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#FAFBFC", borderRadius: 18, padding: 22, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
              {candidates.map((c) => {
                const ans = answerFor(c.name);
                if (ans === "na") return null;
                const isActive = activeCandidate === c.name;
                return (
                  <button key={c.name} type="button" onClick={() => setActiveCandidate(c.name)} style={{
                    fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                    padding: "8px 14px 8px 8px", borderRadius: 999,
                    border: isActive ? `1.5px solid ${c.color}` : "1px solid rgba(0,0,0,0.1)",
                    background: "#fff", color: "var(--ink)", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 8,
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 140ms ease",
                  }}>
                    <Avatar name={c.name} color={c.color} size={26} />
                    {c.name}
                    <span style={{ fontSize: 11, fontWeight: 700, color: ans === "yes" ? "#1F8F5C" : "#C8453C", marginLeft: 2 }}>
                      {ans === "yes" ? "SÍ" : "NO"}
                    </span>
                  </button>
                );
              })}
            </div>
            {activeCandidate && (() => {
              const c = candidates.find((x) => x.name === activeCandidate);
              const ans = answerFor(activeCandidate);
              const quote = question.quotes[activeCandidate];
              if (!c || ans === "na") return null;
              return (
                <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", borderLeft: `4px solid ${ans === "yes" ? "#1F8F5C" : "#C8453C"}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <Avatar name={c.name} color={c.color} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: ans === "yes" ? "rgba(31,143,92,0.12)" : "rgba(200,69,60,0.12)", color: ans === "yes" ? "#1F8F5C" : "#C8453C" }}>
                        {ans === "yes" ? "Responde SÍ" : "Responde NO"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{quote || "Posición declarada en su plan de gobierno."}</p>
                    <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-3)" }}>{c.party}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página Compara ───
export default function ComparaPage() {
  const [view, setView] = useState<"preguntas" | "temas" | "matriz">("temas");
  const [category, setCategory] = useState("Todas");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const candidates = useMemo(() => COMPARE_NAMES.map((n) => ALL_CANDIDATES.find((c) => c.name === n)).filter(Boolean) as Candidate[], []);
  const categories = ["Todas", ...COMPARE_CATEGORIES];
  const filtered = COMPARE_QUESTIONS
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => category === "Todas" || q.cat === category)
    .filter(({ q }) => !search.trim() || q.q.toLowerCase().includes(search.toLowerCase()));

  const toggleRow = (i: number) => {
    if (expandedIdx === i) { setExpandedIdx(null); setActiveCandidate(null); }
    else { setExpandedIdx(i); setActiveCandidate(null); }
  };

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 96px" }}>
      <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 36px" }}>
        <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "var(--brand)", letterSpacing: "-0.01em" }}>Comparar candidatos</p>
        <h1 style={{ margin: "0 0 16px", fontSize: "clamp(36px,5vw,56px)", fontWeight: 600, letterSpacing: "-0.035em", color: "var(--ink)", lineHeight: 1.02,
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
          ¿Qué opina cada uno?
        </h1>
        <p style={{ margin: 0, fontSize: 21, color: "var(--ink-2)", lineHeight: 1.45 }}>
          15 preguntas clave, o una vista en matriz ideológica para entender a todos de un vistazo.
        </p>
      </div>

      {/* Toggle de vista */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "#fff", borderRadius: 14, border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
          {[
            { k: "temas",     l: "Temas polémicos",   icon: "⚡" },
            { k: "preguntas", l: "Análisis detallado", icon: "✓" },
            { k: "matriz",    l: "Matriz ideológica",  icon: "⊞" },
          ].map((o) => (
            <button key={o.k} type="button" onClick={() => setView(o.k as "preguntas" | "temas" | "matriz")} style={{
              fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer",
              padding: "10px 18px", borderRadius: 10, border: 0,
              background: view === o.k ? "var(--brand)" : "transparent",
              color: view === o.k ? "#fff" : "var(--ink-2)", transition: "all 160ms ease",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14, opacity: 0.8 }}>{o.icon}</span>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {view === "matriz" && <IdeologyMatrixView />}

      {view === "temas" && (
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 24, padding: "28px 28px", overflow: "hidden" }}>
          <TemasView />
        </div>
      )}

      {view === "preguntas" && (
        <>
          {/* Leyenda + buscador */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "#fff", border: "1px solid var(--line)", borderRadius: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              {[
                { bg: "#1F8F5C", icon: "✓", label: "A favor" },
                { bg: "#C8453C", icon: "✕", label: "En contra" },
                { bg: "#E8EEF3", icon: "—", label: "Sin posición", fg: "#86868B" },
              ].map((l) => (
                <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: "var(--ink-2)" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: l.bg, color: l.fg || "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{l.icon}</span>
                  {l.label}
                </span>
              ))}
            </div>
            <input type="search" placeholder="Buscar pregunta..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ fontFamily: "inherit", fontSize: 15, padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.12)", outline: "none", background: "#FAFBFC", minWidth: 240 }} />
          </div>

          {/* Chips de categoría */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {categories.map((cat) => (
              <button key={cat} type="button" onClick={() => { setCategory(cat); setExpandedIdx(null); }} style={{
                fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "10px 18px", borderRadius: 999, cursor: "pointer",
                border: `1px solid ${category === cat ? "var(--brand)" : "rgba(0,0,0,0.1)"}`,
                background: category === cat ? "var(--brand)" : "#fff",
                color: category === cat ? "#fff" : "var(--ink)", transition: "all 160ms ease",
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Tabla */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "#FAFBFC", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: `minmax(280px, 1fr) repeat(${candidates.length}, 64px) 48px`, padding: "16px 28px", gap: 8, alignItems: "end" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pregunta</div>
              {candidates.map((c) => (
                <div key={c.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Avatar name={c.name} color={c.color} size={40} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-2)", textAlign: "center", lineHeight: 1.15, maxWidth: 70, letterSpacing: "-0.01em" }}>
                    {c.name.split(" ").slice(-1)[0]}
                  </div>
                </div>
              ))}
              <div />
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: "56px 24px", textAlign: "center", fontSize: 17, color: "var(--ink-2)" }}>No se encontraron preguntas.</div>
            )}
            {filtered.map(({ q, i }) => (
              <QuestionRow key={i} question={q} candidates={candidates} expanded={expandedIdx === i}
                onToggle={() => toggleRow(i)} activeCandidate={activeCandidate} setActiveCandidate={setActiveCandidate} />
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5 }}>
            Las respuestas se basan en declaraciones públicas, planes de gobierno y entrevistas.
          </p>
        </>
      )}
    </main>
  );
}
