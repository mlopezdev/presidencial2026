"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ALL_CANDIDATES, TOP_CANDIDATES, AXES, COMPARE_DATA,
  TIMELINES, DEFAULT_TIMELINE, IDEOLOGY_MATRIX,
  type Candidate, type Spectrum,
} from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chevron } from "@/components/ui/Chevron";

// ─── helpers ───
const SPECTRUM_CLR: Record<Spectrum, string> = { izquierda: "#B3261E", centro: "#2F6B8A", derecha: "#1E40AF" };
const SPECTRUM_BG:  Record<Spectrum, string> = { izquierda: "rgba(179,38,30,0.07)", centro: "rgba(47,107,138,0.07)", derecha: "rgba(30,64,175,0.07)" };
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Breadcrumb de filtro activo ───
function FilterCrumb({ spectrum, onClear }: { spectrum: Spectrum | null; onClear: () => void }) {
  if (!spectrum) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500,
      padding: "6px 10px 6px 12px", borderRadius: 999,
      background: SPECTRUM_BG[spectrum], border: `1px solid ${SPECTRUM_CLR[spectrum]}40`,
      color: SPECTRUM_CLR[spectrum],
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: SPECTRUM_CLR[spectrum] }} />
      {capitalize(spectrum)}
      <button type="button" onClick={onClear}
        style={{ border: 0, background: "rgba(0,0,0,0.12)", borderRadius: "50%", width: 20, height: 20,
          cursor: "pointer", fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: SPECTRUM_CLR[spectrum], lineHeight: 1, fontWeight: 700 }}>
        ×
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PASO 1 — Explorador visual de espectro
// ═══════════════════════════════════════════════════════
function SpectrumExplorer({ onPick, onPickAll }: {
  onPick: (s: Spectrum) => void;
  onPickAll: () => void;
}) {
  const [hovered, setHovered] = useState<Spectrum | null>(null);

  // Posicionar candidatos en el eje económico (-1 a +1)
  const plotted = useMemo(() => ALL_CANDIDATES.map((c) => {
    const m = IDEOLOGY_MATRIX[c.name];
    return { ...c, econ: m?.econ ?? 0 };
  }).sort((a, b) => a.econ - b.econ), []);

  // Convertir -1..+1 a porcentaje 5%..95%
  const toX = (econ: number) => `${5 + ((econ + 1) / 2) * 90}%`;

  const spectrumCards = [
    { key: "izquierda" as Spectrum, label: "Izquierda", desc: "Transformación social, Estado fuerte, paz negociada" },
    { key: "centro" as Spectrum, label: "Centro", desc: "Reformismo moderado, coaliciones, pragmatismo" },
    { key: "derecha" as Spectrum, label: "Derecha", desc: "Libre mercado, seguridad, inversión privada" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "var(--brand)" }}>
          Candidatos · Presidencia 2026
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(32px,4vw,48px)", fontWeight: 600,
          letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05,
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
          ¿Por dónde empezamos?
        </h1>
        <p style={{ margin: 0, fontSize: 18, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 600 }}>
          Elige un espectro para filtrar candidatos, o explora los {ALL_CANDIDATES.length} directamente.
        </p>
      </div>

      {/* Barra visual del espectro con candidatos */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "var(--ink-3)", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <span>← Intervención del Estado</span>
          <span>Libre mercado →</span>
        </div>

        {/* Track degradado */}
        <div style={{
          position: "relative", height: 6, borderRadius: 999,
          background: "linear-gradient(90deg, #B3261E 0%, #2F6B8A 50%, #1E40AF 100%)",
          marginBottom: 48, opacity: 0.35,
        }} />

        {/* Avatar bubbles posicionadas */}
        <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 72 }}>
          {plotted.map((c) => (
            <div key={c.name} title={c.name} style={{
              position: "absolute", left: toX(c.econ), transform: "translateX(-50%)",
              cursor: "pointer", transition: "transform 200ms ease",
              zIndex: 1,
            }}
              onClick={() => onPick(c.spectrum)}
            >
              <Avatar name={c.name} color={c.color} size={36} />
            </div>
          ))}
        </div>
      </div>

      {/* Tres tarjetas de espectro */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {spectrumCards.map((s) => {
          const group = ALL_CANDIDATES.filter((c) => c.spectrum === s.key);
          const isHov = hovered === s.key;
          return (
            <button key={s.key} type="button"
              onClick={() => onPick(s.key)}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                fontFamily: "inherit", textAlign: "left", cursor: "pointer",
                border: `1.5px solid ${isHov ? SPECTRUM_CLR[s.key] : SPECTRUM_CLR[s.key] + "30"}`,
                borderRadius: 22, background: isHov ? SPECTRUM_BG[s.key] : "#fff",
                padding: "24px 22px", transition: "all 180ms ease", color: "var(--ink)",
                boxShadow: isHov ? `0 16px 40px -16px ${SPECTRUM_CLR[s.key]}35` : "var(--shadow-sm)",
                transform: isHov ? "translateY(-3px)" : "translateY(0)",
              }}
            >
              {/* Conteo grande */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: SPECTRUM_CLR[s.key], lineHeight: 1,
                  letterSpacing: "-0.04em", fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
                  {group.length}
                </div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: SPECTRUM_CLR[s.key], marginTop: 8 }} />
              </div>

              <div style={{ fontSize: 20, fontWeight: 700, color: SPECTRUM_CLR[s.key], marginBottom: 6, letterSpacing: "-0.015em" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.4, marginBottom: 18 }}>
                {s.desc}
              </div>

              {/* Mini avatars */}
              <div style={{ display: "flex", gap: -6, marginBottom: 14 }}>
                {group.slice(0, 5).map((c, i) => (
                  <div key={c.name} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i, position: "relative",
                    boxShadow: "0 0 0 2px #fff", borderRadius: "50%" }}>
                    <Avatar name={c.name} color={c.color} size={32} />
                  </div>
                ))}
                {group.length > 5 && (
                  <div style={{ marginLeft: -10, width: 32, height: 32, borderRadius: "50%",
                    background: "#F2F4F7", border: "2px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "var(--ink-3)" }}>
                    +{group.length - 5}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14,
                fontWeight: 600, color: SPECTRUM_CLR[s.key] }}>
                Ver candidatos <Chevron dir="right" size={14} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Ver todos */}
      <button type="button" onClick={onPickAll}
        style={{
          fontFamily: "inherit", width: "100%", cursor: "pointer",
          border: "1px solid var(--line)", borderRadius: 16, background: "#fff",
          padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          color: "var(--ink)", transition: "all 160ms ease", boxShadow: "var(--shadow-sm)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "rgba(47,107,138,0.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex" }}>
            {ALL_CANDIDATES.slice(0, 7).map((c, i) => (
              <div key={c.name} style={{ marginLeft: i > 0 ? -10 : 0, boxShadow: "0 0 0 2px #fff", borderRadius: "50%", position: "relative", zIndex: 7 - i }}>
                <Avatar name={c.name} color={c.color} size={32} />
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Ver los {ALL_CANDIDATES.length} candidatos</div>
            <div style={{ fontSize: 14, color: "var(--ink-3)" }}>Sin filtro de espectro</div>
          </div>
        </div>
        <Chevron dir="right" size={18} />
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// PASO 2 — Grid/Lista de candidatos con búsqueda
// ═══════════════════════════════════════════════════════
type ViewMode = "grid" | "list";
type SortMode = "default" | "alpha" | "punteros";

function CandidateBrowser({ spectrum, onBack, onPick }: {
  spectrum: Spectrum | null; onBack: () => void; onPick: (c: Candidate) => void;
}) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("default");
  const [activeFilter, setActiveFilter] = useState<Spectrum | null>(spectrum);

  useEffect(() => { setActiveFilter(spectrum); }, [spectrum]);

  const filtered = useMemo(() => {
    let list = ALL_CANDIDATES;
    if (activeFilter) list = list.filter((c) => c.spectrum === activeFilter);
    if (search.trim()) list = list.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "alpha") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "punteros") list = [...list].sort((a) => TOP_CANDIDATES.includes(a) ? -1 : 1);
    return list;
  }, [activeFilter, search, sort]);

  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button type="button" onClick={onBack}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--line)", background: "#fff",
            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--ink)", flexShrink: 0 }}>
          <Chevron dir="left" />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
            fontFamily: "var(--font-plex-serif), Georgia, serif", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            Candidatos
            {activeFilter && (
              <FilterCrumb spectrum={activeFilter} onClear={() => setActiveFilter(null)} />
            )}
          </h2>
        </div>

        {/* Conteo */}
        <span style={{ fontSize: 14, color: "var(--ink-3)", fontWeight: 500, flexShrink: 0 }}>
          {filtered.length} de {ALL_CANDIDATES.length}
        </span>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {/* Búsqueda */}
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--ink-3)", pointerEvents: "none" }}>
            🔍
          </span>
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o partido…"
            style={{
              fontFamily: "inherit", fontSize: 15, width: "100%",
              padding: "11px 16px 11px 40px", borderRadius: 999,
              border: "1px solid var(--line)", outline: "none", background: "#fff",
              color: "var(--ink)", transition: "border-color 160ms ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--ink-3)" }}>
              ×
            </button>
          )}
        </div>

        {/* Chips de espectro */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["izquierda","centro","derecha"] as Spectrum[]).map((s) => {
            const active = activeFilter === s;
            return (
              <button key={s} type="button"
                onClick={() => setActiveFilter(active ? null : s)}
                style={{
                  fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  padding: "8px 14px", borderRadius: 999,
                  border: `1px solid ${active ? SPECTRUM_CLR[s] : "rgba(0,0,0,0.1)"}`,
                  background: active ? SPECTRUM_CLR[s] : "#fff",
                  color: active ? "#fff" : "var(--ink)",
                  transition: "all 140ms ease",
                }}>
                {capitalize(s)}
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, opacity: 0.75 }}>
                  {ALL_CANDIDATES.filter((c) => c.spectrum === s).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}
          style={{ fontFamily: "inherit", fontSize: 14, padding: "9px 14px", borderRadius: 999,
            border: "1px solid var(--line)", background: "#fff", color: "var(--ink)", cursor: "pointer",
            outline: "none" }}>
          <option value="default">Por espectro</option>
          <option value="punteros">Punteros primero</option>
          <option value="alpha">Alfabético</option>
        </select>

        {/* View toggle */}
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
          {(["grid","list"] as ViewMode[]).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)}
              style={{ border: 0, cursor: "pointer", padding: "8px 14px", fontSize: 16,
                background: view === v ? "var(--brand)" : "transparent",
                color: view === v ? "#fff" : "var(--ink-3)",
                transition: "all 140ms ease" }}>
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados vacíos */}
      {filtered.length === 0 && (
        <div style={{ padding: "56px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 18, color: "var(--ink-2)", marginBottom: 8 }}>Sin resultados para "{search}"</div>
          <button type="button" onClick={() => setSearch("")}
            style={{ fontFamily: "inherit", fontSize: 15, color: "var(--brand)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Grid */}
      {view === "grid" && filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {filtered.map((c, i) => (
            <CandidateGridCard key={c.name} candidate={c} index={i} onPick={onPick} />
          ))}
        </div>
      )}

      {/* Lista */}
      {view === "list" && filtered.length > 0 && (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((c, i) => (
            <CandidateListRow key={c.name} candidate={c} index={i} onPick={onPick} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Tarjeta en modo grid
function CandidateGridCard({ candidate: c, index, onPick }: { candidate: Candidate; index: number; onPick: (c: Candidate) => void }) {
  const [hover, setHover] = useState(false);
  const inits = c.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const isPuntero = TOP_CANDIDATES.some((t) => t.name === c.name);

  return (
    <motion.button
      type="button"
      onClick={() => onPick(c)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      style={{
        fontFamily: "inherit", textAlign: "left", cursor: "pointer",
        border: `1.5px solid ${hover ? c.color + "60" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 18, background: "#fff", padding: 0,
        display: "flex", flexDirection: "column", overflow: "hidden",
        color: "var(--ink)",
        boxShadow: hover ? `0 20px 40px -20px ${c.color}40` : "var(--shadow-sm)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all 220ms cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      {/* Photo area */}
      <div style={{
        aspectRatio: "4/3", width: "100%", position: "relative",
        background: `radial-gradient(100% 70% at 50% 0%, color-mix(in srgb, ${c.color} 30%, #fff) 0%, color-mix(in srgb, ${c.color} 60%, #1a1a1a) 100%)`,
        overflow: "hidden",
      }}>
        {/* puntero badge */}
        {isPuntero && (
          <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700,
            padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)", color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Puntero
          </span>
        )}
        {/* spectrum badge */}
        <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700,
          padding: "3px 8px", borderRadius: 999, background: "rgba(0,0,0,0.28)",
          backdropFilter: "blur(8px)", color: "#fff", letterSpacing: "0.04em" }}>
          {capitalize(c.spectrum)}
        </span>
        {/* Giant initials */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(48px, 8vw, 72px)", fontWeight: 700, color: "rgba(255,255,255,0.9)",
          letterSpacing: "-0.05em", textShadow: "0 4px 16px rgba(0,0,0,0.2)",
          transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform 360ms ease",
        }}>
          {inits}
        </div>
        {/* bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)", pointerEvents: "none" }} />
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1.25, marginBottom: 4 }}>
          {c.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 10, lineHeight: 1.3 }}>
          {c.party}
        </div>
        {/* Color bar spectrum */}
        <div style={{ height: 3, borderRadius: 999, background: c.color, opacity: 0.7, width: `${60 + Math.random() * 20}%` }} />
      </div>
    </motion.button>
  );
}

// Fila en modo lista
function CandidateListRow({ candidate: c, index, onPick }: { candidate: Candidate; index: number; onPick: (c: Candidate) => void }) {
  const isPuntero = TOP_CANDIDATES.some((t) => t.name === c.name);
  return (
    <motion.button
      type="button"
      onClick={() => onPick(c)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.24, delay: index * 0.03 }}
      style={{
        fontFamily: "inherit", textAlign: "left", cursor: "pointer",
        border: "1px solid var(--line)", borderRadius: 16,
        background: "#fff", padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 16, color: "var(--ink)",
        transition: "all 160ms ease",
      }}
      onHoverStart={(e, info) => {
        const el = (e.target as HTMLElement).closest("button");
        if (el) { el.style.borderColor = c.color; el.style.transform = "translateX(2px)"; el.style.boxShadow = "0 4px 16px -8px rgba(0,0,0,0.1)"; }
      }}
      onHoverEnd={(e) => {
        const el = (e.target as HTMLElement).closest("button");
        if (el) { el.style.borderColor = "var(--line)"; el.style.transform = "translateX(0)"; el.style.boxShadow = "none"; }
      }}
    >
      {/* Left spectrum stripe */}
      <div style={{ width: 4, alignSelf: "stretch", borderRadius: 2, background: SPECTRUM_CLR[c.spectrum], flexShrink: 0 }} />

      <Avatar name={c.name} color={c.color} size={44} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{c.name}</span>
          {isPuntero && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              background: "rgba(47,107,138,0.1)", color: "var(--brand)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Puntero
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>{c.party}</div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", fontStyle: "italic", lineHeight: 1.3,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
          "{c.lede}"
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
          background: SPECTRUM_BG[c.spectrum], color: SPECTRUM_CLR[c.spectrum] }}>
          {capitalize(c.spectrum)}
        </span>
        <Chevron dir="right" size={16} />
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════
// PASO 3 — Perfil completo con navegación prev/next
// ═══════════════════════════════════════════════════════
function ProfileStep({ candidate, allVisible, onBack, onPickOther }: {
  candidate: Candidate;
  allVisible: Candidate[];
  onBack: () => void;
  onPickOther: (c: Candidate) => void;
}) {
  const [activeTab, setActiveTab] = useState("resumen");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [tabSticky, setTabSticky] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Posición del candidato en la lista visible
  const currentIdx = allVisible.findIndex((c) => c.name === candidate.name);
  const prevCandidate = currentIdx > 0 ? allVisible[currentIdx - 1] : null;
  const nextCandidate = currentIdx < allVisible.length - 1 ? allVisible[currentIdx + 1] : null;

  // Sticky tab bar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!tabBarRef.current) return;
      const rect = tabBarRef.current.getBoundingClientRect();
      setTabSticky(rect.top <= 72);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset tab when candidate changes
  useEffect(() => { setActiveTab("resumen"); }, [candidate.name]);

  const compare = COMPARE_DATA[candidate.name];
  const proposalCount = compare ? Object.values(compare).reduce((a, arr) => a + arr.length, 0) : "—";
  const axesCount = compare ? `${Object.values(compare).filter((a) => a.length > 0).length}/4` : "—";
  const tabs = [
    { key: "resumen", label: "Resumen" },
    { key: "trayectoria", label: "Trayectoria" },
    { key: "propuestas", label: "Propuestas" },
    { key: "posiciones", label: "Posiciones" },
    { key: "similitudes", label: "Similitudes" },
    { key: "plan", label: "Plan y DOFA" },
  ];

  return (
    <motion.div
      key={candidate.name}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      {/* Nav bar superior: atrás + prev/next */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
        <button type="button" onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer",
          border: "1px solid var(--line)", background: "#fff", borderRadius: 999,
          padding: "8px 16px 8px 12px", color: "var(--ink)", transition: "all 160ms ease",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
        >
          <Chevron dir="left" size={16} /> Candidatos
        </button>

        {/* Contador + prev/next */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {prevCandidate && (
            <button type="button" onClick={() => { onPickOther(prevCandidate); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              title={prevCandidate.name}
              style={{
                border: "1px solid var(--line)", background: "#fff", borderRadius: 999,
                padding: "7px 12px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink)",
                transition: "all 140ms ease", fontFamily: "inherit", fontSize: 14, fontWeight: 500,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = prevCandidate.color; (e.currentTarget as HTMLElement).style.background = `${prevCandidate.color}0A`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            >
              <Chevron dir="left" size={14} />
              <div style={{ boxShadow: `0 0 0 2px ${prevCandidate.color}`, borderRadius: "50%" }}>
                <Avatar name={prevCandidate.name} color={prevCandidate.color} size={22} />
              </div>
              <span style={{ display: "none" }}>prev</span>
            </button>
          )}

          <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500, whiteSpace: "nowrap",
            background: "#F2F4F7", padding: "6px 12px", borderRadius: 999 }}>
            {currentIdx + 1} / {allVisible.length}
          </span>

          {nextCandidate && (
            <button type="button" onClick={() => { onPickOther(nextCandidate); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              title={nextCandidate.name}
              style={{
                border: "1px solid var(--line)", background: "#fff", borderRadius: 999,
                padding: "7px 12px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink)",
                transition: "all 140ms ease", fontFamily: "inherit", fontSize: 14, fontWeight: 500,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = nextCandidate.color; (e.currentTarget as HTMLElement).style.background = `${nextCandidate.color}0A`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            >
              <div style={{ boxShadow: `0 0 0 2px ${nextCandidate.color}`, borderRadius: "50%" }}>
                <Avatar name={nextCandidate.name} color={nextCandidate.color} size={22} />
              </div>
              <Chevron dir="right" size={14} />
            </button>
          )}
        </div>
      </div>

      <article style={{ background: "#fff", borderRadius: 24, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {/* Cover band */}
        <div style={{ height: 160, background: `linear-gradient(135deg, ${candidate.color} 0%, ${candidate.color}88 100%)`, position: "relative" }}>
          {/* Party badge */}
          <span style={{
            position: "absolute", right: 20, top: 16,
            fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999,
            background: "rgba(255,255,255,0.18)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)",
          }}>
            {candidate.party}
          </span>
          {/* Spectrum badge */}
          <span style={{
            position: "absolute", left: 20, bottom: 16,
            fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
            background: "rgba(0,0,0,0.25)", color: "#fff",
            backdropFilter: "blur(8px)", letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {capitalize(candidate.spectrum)}
          </span>
        </div>

        {/* Header overlap */}
        <div style={{ padding: "0 32px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -60 }}>
          <div style={{ boxShadow: "0 0 0 5px #fff, 0 0 0 6px rgba(0,0,0,0.06)", borderRadius: "50%", flexShrink: 0 }}>
            <Avatar name={candidate.name} color={candidate.color} size={120} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(24px,3vw,34px)", fontWeight: 600, letterSpacing: "-0.025em",
              color: "var(--ink)", lineHeight: 1.1, fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
              {candidate.name}
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--ink-2)" }}>
              Fórmula: <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{candidate.vice}</strong>
            </p>
          </div>
          {/* CTA Comparar */}
          <div style={{ paddingBottom: 16, flexShrink: 0 }}>
            <Link href="/compara">
              <button type="button" style={{
                fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
                padding: "10px 18px", borderRadius: 999, border: `1px solid ${candidate.color}40`,
                background: `${candidate.color}0D`, color: candidate.color,
                display: "inline-flex", alignItems: "center", gap: 6, transition: "all 160ms ease",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${candidate.color}20`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${candidate.color}0D`; }}
              >
                Comparar <Chevron dir="right" size={13} />
              </button>
            </Link>
          </div>
        </div>

        {/* Bio + stats */}
        <div style={{ padding: "16px 32px 0" }}>
          <p style={{ margin: "0 0 16px", fontSize: 17, color: "var(--ink-2)", lineHeight: 1.55,
            maxWidth: 720, fontStyle: "italic" }}>
            "{candidate.lede}"
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingBottom: 4 }}>
            {[
              { k: "Propuestas", v: proposalCount },
              { k: "Ejes cubiertos", v: axesCount },
              { k: "Espectro", v: capitalize(candidate.spectrum) },
            ].map((s) => (
              <div key={s.k} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>{s.v}</span>
                <span style={{ fontSize: 14, color: "var(--ink-3)" }}>{s.k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar — sticky */}
        <div ref={tabBarRef}>
          {tabSticky && (
            <div style={{ height: 56 }} aria-hidden="true" /> // spacer
          )}
          <nav style={{
            display: "flex", borderBottom: "1px solid var(--line)",
            marginTop: 16, padding: "0 16px", overflowX: "auto",
            ...(tabSticky ? {
              position: "fixed", top: 72, left: 0, right: 0,
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
              boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
              zIndex: 40, paddingLeft: 32,
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            } : {}),
          }}>
            {tabs.map((t) => (
              <button key={t.key} type="button" onClick={() => {
                setActiveTab(t.key);
                if (tabSticky) contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
                style={{
                  fontFamily: "inherit", fontSize: 15, fontWeight: activeTab === t.key ? 600 : 500,
                  padding: "16px 18px", border: 0, cursor: "pointer", background: "transparent",
                  color: activeTab === t.key ? "var(--ink)" : "var(--ink-2)", whiteSpace: "nowrap",
                  position: "relative", transition: "color 160ms ease",
                }}>
                {t.label}
                {activeTab === t.key && (
                  <span style={{ position: "absolute", left: 12, right: 12, bottom: -1, height: 3,
                    background: candidate.color, borderRadius: 999 }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div ref={contentRef} style={{ padding: "32px 36px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ProfileTabContent tab={activeTab} candidate={candidate} compare={compare} onPickOther={onPickOther} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav entre candidatos */}
        <div style={{ borderTop: "1px solid var(--line)", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            {prevCandidate && (
              <button type="button" onClick={() => { onPickOther(prevCandidate); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{
                  fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--line)",
                  background: "#fff", borderRadius: 14, padding: "12px 16px",
                  display: "inline-flex", alignItems: "center", gap: 12,
                  color: "var(--ink)", transition: "all 160ms ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = prevCandidate.color; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
              >
                <Chevron dir="left" size={16} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Anterior</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{prevCandidate.name}</div>
                </div>
              </button>
            )}
          </div>

          <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>
            {currentIdx + 1} / {allVisible.length}
          </span>

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {nextCandidate && (
              <button type="button" onClick={() => { onPickOther(nextCandidate); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{
                  fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--line)",
                  background: "#fff", borderRadius: 14, padding: "12px 16px",
                  display: "inline-flex", alignItems: "center", gap: 12,
                  color: "var(--ink)", transition: "all 160ms ease",
                  textAlign: "right",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = nextCandidate.color; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Siguiente</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{nextCandidate.name}</div>
                </div>
                <Chevron dir="right" size={16} />
              </button>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// Contenido por tab (sin cambios estructurales)
// ═══════════════════════════════════════════════════════
function ProfileTabContent({ tab, candidate, compare, onPickOther }: {
  tab: string; candidate: Candidate;
  compare: (typeof COMPARE_DATA)[string] | undefined;
  onPickOther: (c: Candidate) => void;
}) {
  if (tab === "resumen") return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Resumen</h3>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Una mirada rápida al candidato y su mensaje.</p>
      <p style={{ margin: "0 0 24px", fontSize: 19, lineHeight: 1.6, color: "var(--ink-2)" }}>
        {candidate.lede} Este perfil reúne su trayectoria, propuestas por eje, posiciones frente a temas importantes y similitudes con otros candidatos para ayudarte a decidir.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {[
          { k: "Partido", v: candidate.party },
          { k: "Fórmula vice", v: candidate.vice },
          { k: "Espectro", v: capitalize(candidate.spectrum) },
          { k: "Mensaje central", v: candidate.lede },
        ].map((r) => (
          <div key={r.k} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{r.k}</div>
            <div style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.4 }}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tab === "trayectoria") {
    const items = TIMELINES[candidate.name] || DEFAULT_TIMELINE;
    return (
      <div style={{ maxWidth: 760 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Trayectoria</h3>
        <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Línea de tiempo de la carrera pública.</p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
          <span aria-hidden style={{ position: "absolute", left: 14, top: 10, bottom: 10, width: 2,
            background: `linear-gradient(to bottom, ${candidate.color}60, ${candidate.color}10)` }} />
          {items.map((h, i) => (
            <li key={h.y + i} style={{ position: "relative", display: "flex", gap: 20, paddingLeft: 44, marginBottom: i < items.length - 1 ? 28 : 0 }}>
              <span aria-hidden style={{ position: "absolute", left: 8, top: 4, width: 14, height: 14,
                borderRadius: "50%", background: "#fff", border: `3px solid ${candidate.color}`, boxShadow: "0 0 0 3px #fff" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: candidate.color }}>{h.y}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{h.t}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{h.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (tab === "propuestas") {
    if (!compare) return <p style={{ color: "var(--ink-2)", fontSize: 18 }}>Contenido en construcción.</p>;
    return (
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Propuestas clave</h3>
        <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Organizadas por eje temático.</p>
        <div style={{ display: "grid", gap: 24 }}>
          {AXES.map((a) => {
            const items = compare[a.key] || [];
            if (!items.length) return null;
            return (
              <div key={a.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 6, height: 22, borderRadius: 3, background: candidate.color }} />
                  <h4 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{a.key}</h4>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{items.length} propuestas</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  {items.map((p) => (
                    <div key={p.title} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 18px",
                      borderLeft: `3px solid ${candidate.color}50` }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{p.title}</div>
                      <div style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (tab === "posiciones") return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Posiciones</h3>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Postura frente a los cuatro ejes principales.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {AXES.map((a) => {
          const items = compare?.[a.key];
          const summary = items?.[0] ? items[0].desc : a.desc;
          return (
            <div key={a.key} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22, border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: candidate.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Eje</span>
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{a.key}</h4>
              <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (tab === "similitudes") {
    const others = ALL_CANDIDATES.filter((c) => c.name !== candidate.name && COMPARE_DATA[c.name]);
    const scored = others.map((o) => {
      const sameSpectrum = o.spectrum === candidate.spectrum ? 1 : 0;
      const axesShared = AXES.filter((a) => {
        const A = (COMPARE_DATA[candidate.name] || {} as Record<string, unknown[]>)[a.key] || [];
        const B = (COMPARE_DATA[o.name] || {} as Record<string, unknown[]>)[a.key] || [];
        return A.length > 0 && B.length > 0;
      });
      const score = Math.round(sameSpectrum * 45 + (axesShared.length / 4) * 55);
      return { o, score, shared: axesShared.map((a) => a.key) };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    return (
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
          fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Similitudes</h3>
        <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Afinidad estimada por espectro y ejes con propuestas desarrolladas.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {scored.map(({ o, score, shared }) => (
            <button key={o.name} type="button" onClick={() => onPickOther(o)} style={{
              fontFamily: "inherit", textAlign: "left", background: "#fff",
              border: "1px solid var(--line)", borderRadius: 16, padding: 18, cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 12,
              transition: "transform 200ms ease, box-shadow 200ms ease",
              color: "var(--ink)",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px -14px rgba(13,30,45,0.16)"; (e.currentTarget as HTMLElement).style.borderColor = o.color; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={o.name} color={o.color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{o.name}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{o.party}</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Afinidad</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)" }}>{score}%</span>
                </div>
                <div style={{ height: 6, background: "#EEF1F4", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: score + "%", height: "100%", background: `linear-gradient(90deg, ${candidate.color}, ${o.color})`, borderRadius: 999, transition: "width 400ms ease" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {shared.slice(0, 4).map((k) => (
                  <span key={k} style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-2)", background: "#F2F4F7", padding: "4px 10px", borderRadius: 999 }}>{k}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Plan y DOFA
  return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)",
        fontFamily: "var(--font-plex-serif), Georgia, serif" }}>Plan de gobierno y DOFA</h3>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: "var(--ink-3)" }}>Documentos oficiales y análisis estratégico.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { t: "Plan de gobierno", d: "Documento programático completo del candidato.", cta: "Abrir documento" },
          { t: "Análisis DOFA", d: "Debilidades, oportunidades, fortalezas y amenazas.", cta: "Ver análisis" },
        ].map((c) => (
          <div key={c.t} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22 }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{c.t}</h4>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.d}</p>
            <Button variant="secondary" style={{ padding: "10px 16px", fontSize: 15 }}>{c.cta}</Button>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Este bloque conectará con los documentos oficiales cuando estén disponibles públicamente.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONTENEDOR PRINCIPAL
// ═══════════════════════════════════════════════════════
type Step = "explorer" | "browser" | "profile";

function CandidatosContent() {
  const searchParams = useSearchParams();
  const preselectedName = searchParams.get("name");
  const preselected = preselectedName ? ALL_CANDIDATES.find((c) => c.name === preselectedName) ?? null : null;

  const [step, setStep] = useState<Step>(preselected ? "profile" : "explorer");
  const [filterSpectrum, setFilterSpectrum] = useState<Spectrum | null>(preselected?.spectrum ?? null);
  const [picked, setPicked] = useState<Candidate | null>(preselected);

  // Candidatos visibles en el browser actual (para prev/next en perfil)
  const visibleCandidates = useMemo(() => {
    if (!filterSpectrum) return ALL_CANDIDATES;
    return ALL_CANDIDATES.filter((c) => c.spectrum === filterSpectrum);
  }, [filterSpectrum]);

  const handlePickSpectrum = (s: Spectrum) => {
    setFilterSpectrum(s);
    setStep("browser");
  };
  const handlePickAll = () => {
    setFilterSpectrum(null);
    setStep("browser");
  };
  const handlePickCandidate = (c: Candidate) => {
    setPicked(c);
    setStep("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBackFromBrowser = () => {
    setFilterSpectrum(null);
    setStep("explorer");
  };
  const handleBackFromProfile = () => {
    setStep("browser");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePickOther = (c: Candidate) => {
    setPicked(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 96px" }}>
      <AnimatePresence mode="wait">
        {step === "explorer" && (
          <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <SpectrumExplorer onPick={handlePickSpectrum} onPickAll={handlePickAll} />
          </motion.div>
        )}

        {step === "browser" && (
          <motion.div key="browser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <CandidateBrowser spectrum={filterSpectrum} onBack={handleBackFromBrowser} onPick={handlePickCandidate} />
          </motion.div>
        )}

        {step === "profile" && picked && (
          <motion.div key={`profile-${picked.name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ProfileStep
              candidate={picked}
              allVisible={visibleCandidates}
              onBack={handleBackFromProfile}
              onPickOther={handlePickOther}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function CandidatosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 32px", textAlign: "center", color: "var(--ink-3)" }}>Cargando…</div>}>
      <CandidatosContent />
    </Suspense>
  );
}
