"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_CANDIDATES, TOP_CANDIDATES, getCandidatePhoto, type Candidate } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chevron } from "@/components/ui/Chevron";

// ─── Celda individual del tarjetón ───
function BallotCell({ candidate, index }: { candidate: Candidate; index: number }) {
  const [hovered, setHovered] = useState(false);
  const SPECTRUM_CLR: Record<string, string> = { izquierda: "#B3261E", centro: "#2F6B8A", derecha: "#1E40AF" };
  const color = SPECTRUM_CLR[candidate.spectrum] ?? candidate.color;
  const inits = candidate.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "10px 10px 10px 12px",
        background: hovered ? `${color}0C` : "transparent",
        cursor: "default",
        transition: "background 180ms ease",
      }}
    >
      {/* Número de candidato */}
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(0,0,0,0.25)", letterSpacing: "0.04em",
        marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 4,
          background: "rgba(0,0,0,0.06)", lineHeight: "16px", textAlign: "center" }}>
          {index + 1}
        </span>
      </div>

      {/* Avatar + info */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em",
          boxShadow: hovered ? `0 0 0 2px #fff, 0 0 0 3.5px ${color}` : "none",
          transition: "box-shadow 180ms ease",
          position: "relative",
        }}>
          {getCandidatePhoto(candidate.name) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getCandidatePhoto(candidate.name)} alt={candidate.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", position: "absolute", inset: 0 }} />
          ) : inits}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, letterSpacing: "-0.01em",
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 9, color: "rgba(0,0,0,0.38)", marginTop: 1, lineHeight: 1.2,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
            {candidate.party}
          </div>
        </div>
      </div>

      {/* Línea de marca (donde el votante escribe la X) */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.12)", borderRadius: 999 }} />
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          border: `1.5px solid ${hovered ? color : "rgba(0,0,0,0.18)"}`,
          flexShrink: 0, position: "relative", overflow: "hidden",
          background: hovered ? `${color}0D` : "transparent",
          transition: "border-color 180ms ease, background 180ms ease",
        }}>
          {/* X animada con framer-motion */}
          <svg viewBox="0 0 24 24" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} fill="none">
            <motion.path d="M 5,5 L 19,19" stroke={color} strokeWidth="2.2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            <motion.path d="M 19,5 L 5,19" stroke={color} strokeWidth="2.2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.18, delay: hovered ? 0.13 : 0, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tarjetón electoral completo ───
function BallotCard() {
  const COLS = 3;
  const rows = Math.ceil(ALL_CANDIDATES.length / COLS);
  // COLS=3 → 14 candidatos → 5 filas (15 celdas, 1 vacía)
  const cells = [...ALL_CANDIDATES, ...Array(COLS * rows - ALL_CANDIDATES.length).fill(null)];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 3 }}
      animate={{ opacity: 1, x: 0, rotate: 2 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0.5, scale: 1.01, transition: { duration: 0.4 } }}
      style={{
        background: "#FFFEFB",
        borderRadius: 16,
        boxShadow: "0 4px 0 1px rgba(0,0,0,0.04), 0 24px 60px -20px rgba(13,30,45,0.28), 0 4px 20px -4px rgba(13,30,45,0.12)",
        border: "1px solid rgba(0,0,0,0.10)",
        overflow: "hidden",
        maxWidth: 420,
        width: "100%",
        userSelect: "none",
      }}
    >
      {/* Header del tarjetón */}
      <div style={{
        padding: "14px 20px 12px",
        borderBottom: "2px solid rgba(0,0,0,0.09)",
        background: "rgba(0,0,0,0.025)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.4)",
            textTransform: "uppercase", marginBottom: 2 }}>
            Registraduría Nacional del Estado Civil
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            TARJETA ELECTORAL — PRESIDENCIA 2026
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.3)", textAlign: "right", lineHeight: 1.4 }}>
          REPÚBLICA<br />DE COLOMBIA
        </div>
      </div>

      {/* Instrucción */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)",
        fontSize: 9.5, color: "rgba(0,0,0,0.45)", fontStyle: "italic", letterSpacing: "0.01em" }}>
        Marque con una X en el recuadro del candidato de su preferencia
      </div>

      {/* Grid de candidatos */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells.map((c, i) =>
          c ? (
            <BallotCell key={c.name} candidate={c} index={i} />
          ) : (
            <div key={`empty-${i}`} style={{ borderRight: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "repeating-linear-gradient(-45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 8px)" }} />
          )
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, color: "rgba(0,0,0,0.3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Voto en blanco
        </div>
        <div style={{ height: 1, flex: 1, margin: "0 10px", background: "rgba(0,0,0,0.1)", borderRadius: 999 }} />
        <div style={{ width: 18, height: 18, border: "1.5px solid rgba(0,0,0,0.2)", borderRadius: 4, flexShrink: 0 }} />
      </div>
    </motion.div>
  );
}

// ─── Hero split: título izquierda + tarjetón derecha ───
function FloatingCardsHero() {
  return (
    <section style={{
      position: "relative", overflowX: "clip",
      padding: "80px 48px 96px",
      background: "radial-gradient(900px 500px at 20% 50%, rgba(47,107,138,0.08), transparent 65%), radial-gradient(700px 400px at 85% 20%, rgba(30,64,175,0.05), transparent 60%), var(--bg)",
    }}>
      {/* Grid de fondo sutil */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      <div style={{
        position: "relative",
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr auto",
        gap: 64, alignItems: "flex-start",
      }}>
        {/* ── IZQUIERDA: texto ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 600, color: "var(--brand)",
              background: "rgba(47,107,138,0.08)", border: "1px solid rgba(47,107,138,0.18)",
              padding: "6px 14px", borderRadius: 999, marginBottom: 28 }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 7, height: 7, borderRadius: 999, background: "var(--brand)", display: "inline-block" }}
            />
            Elecciones Colombia · Mayo 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              margin: "0 0 22px",
              fontSize: "clamp(44px, 5.5vw, 72px)",
              fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.98,
              color: "var(--ink)",
              fontFamily: "var(--font-plex-serif), Georgia, serif",
            }}
          >
            Tu voto,{" "}
            <span style={{
              color: "transparent",
              backgroundClip: "text", WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, var(--brand) 30%, #1E40AF 100%)",
            }}>
              bien<br />informado.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            style={{ margin: "0 0 36px", maxWidth: 480, fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)" }}
          >
            Conoce los {ALL_CANDIDATES.length} candidatos, compara propuestas y decide con la misma información para todos, lado a lado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <Link href="/candidatos">
              <Button variant="primary" style={{ fontSize: 16, padding: "13px 24px" }}>
                Explorar candidatos
              </Button>
            </Link>
            <Link href="/compara">
              <Button variant="secondary" style={{ fontSize: 16, padding: "13px 24px" }}>
                Comparar propuestas
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}
          >
            {[
              { n: ALL_CANDIDATES.length, label: "candidatos" },
              { n: "4", label: "ejes temáticos" },
              { n: "3", label: "espectros" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 34, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.04em", lineHeight: 1,
                  fontFamily: "var(--font-plex-serif), Georgia, serif" }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── DERECHA: tarjetón ── */}
        <div style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <BallotCard />
        </div>
      </div>
    </section>
  );
}

// ─── Marquee de partidos ───
function PartyMarquee() {
  const items = [...ALL_CANDIDATES, ...ALL_CANDIDATES];
  return (
    <div style={{
      borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
      background: "#fff", padding: "20px 0", overflow: "hidden", position: "relative",
    }}>
      <div className="marquee-track" style={{ display: "flex", gap: 40, whiteSpace: "nowrap", alignItems: "center" }}>
        {items.map((c, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--ink-2)", fontWeight: 500 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: c.color, display: "inline-block" }} />
            {c.party}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Tarjeta tipo FIFA ───
function CandidateCard({ candidate, revealIndex = 0, onOpen }: { candidate: Candidate; revealIndex?: number; onOpen?: (c: Candidate) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const inits = candidate.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const spectrumLabel = { izquierda: "Izquierda", centro: "Centro", derecha: "Derecha" }[candidate.spectrum];

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen?.(candidate)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left", background: "#fff",
        border: `1px solid ${hover ? "rgba(47,107,138,0.28)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 22, padding: 0,
        display: "flex", flexDirection: "column", overflow: "hidden",
        cursor: "pointer",
        transition: "transform 280ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 260ms ease, border-color 200ms ease, opacity 500ms ease",
        transform: visible ? (hover ? "translateY(-6px)" : "translateY(0)") : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${revealIndex * 60}ms`,
        boxShadow: hover ? "0 28px 56px -24px rgba(13,30,45,0.28)" : "0 2px 4px rgba(13,30,45,0.04)",
        fontFamily: "inherit", color: "inherit", width: "100%",
      }}
    >
      {/* Photo area */}
      <div style={{
        position: "relative", aspectRatio: "3 / 4", width: "100%",
        background: `
          radial-gradient(120% 80% at 50% 110%, rgba(0,0,0,0.35), transparent 55%),
          radial-gradient(100% 70% at 50% 0%, color-mix(in srgb, ${candidate.color} 30%, #fff) 0%, color-mix(in srgb, ${candidate.color} 55%, #2a2a2a) 100%)
        `,
        overflow: "hidden",
      }}>
        <span style={{
          position: "absolute", top: 14, left: 14,
          fontSize: 12, fontWeight: 600, color: "#fff",
          padding: "6px 10px", borderRadius: 999,
          background: "rgba(0,0,0,0.32)", backdropFilter: "blur(8px)",
          letterSpacing: "-0.01em",
        }}>
          {spectrumLabel}
        </span>
        <span aria-hidden="true" style={{
          position: "absolute", top: 14, right: 14,
          width: 24, height: 24, borderRadius: 999,
          background: candidate.color,
          border: "2px solid rgba(255,255,255,0.9)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }} />
        {CANDIDATE_PHOTOS[candidate.name] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={CANDIDATE_PHOTOS[candidate.name]}
            alt={candidate.name}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              transform: hover ? "scale(1.04)" : "scale(1)",
              transition: "transform 400ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        ) : (
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.95)",
            fontSize: "clamp(72px, 14vw, 120px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1,
            textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform 400ms cubic-bezier(0.2,0.8,0.2,1)",
          }}>
            {inits}
          </div>
        )}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)",
          pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: "35%",
          background: "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0))",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, color: "#fff" }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9, letterSpacing: "-0.005em" }}>
            Fórmula: {candidate.vice}
          </div>
        </div>
      </div>

      {/* Banner inferior estilo FIFA */}
      <div style={{
        background: candidate.color, color: "#fff",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 6, height: 28, borderRadius: 3, background: "rgba(255,255,255,0.85)", flex: "0 0 auto" }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.08em" }}>Partido</div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {candidate.party}
            </div>
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 13, fontWeight: 600, padding: "8px 12px", borderRadius: 999,
          background: "rgba(255,255,255,0.18)",
          transform: hover ? "translateX(2px)" : "translateX(0)",
          transition: "transform 200ms ease",
          flex: "0 0 auto",
        }}>
          Ver <Chevron dir="right" size={12} />
        </span>
      </div>
    </button>
  );
}

// ─── Demographics panel simplificado ───
function DemographicsPanel() {
  const spectrumCount = ALL_CANDIDATES.reduce((acc, c) => {
    acc[c.spectrum] = (acc[c.spectrum] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const femaleCount = ALL_CANDIDATES.filter((c) => c.gender === "F").length;
  const total = ALL_CANDIDATES.length;

  const spectrumColors: Record<string, string> = { izquierda: "#B3261E", centro: "#2F6B8A", derecha: "#1E40AF" };
  const specs = ["izquierda", "centro", "derecha"] as const;

  return (
    <section style={{
      background: "linear-gradient(180deg, #F5F7FA 0%, #FBFBFD 100%)",
      border: "1px solid var(--line)", borderRadius: 28, padding: 28, marginBottom: 48,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "var(--brand)",
          background: "rgba(47,107,138,0.1)", padding: "5px 11px", borderRadius: 999,
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>◆ Radiografía 2026</span>
      </div>
      <h3 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.025em", lineHeight: 1.1,
        fontFamily: "var(--font-plex-serif), Georgia, serif",
      }}>
        ¿Quiénes están en la contienda?
      </h3>
      <p style={{ margin: "0 0 24px", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.45 }}>
        {total} candidatos inscritos. Composición por género y espectro político.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total candidatos", value: total, sub: "fórmulas inscritas", color: "var(--ink)" },
          { label: "Mujeres candidatas", value: femaleCount, sub: `${Math.round((femaleCount / total) * 100)}% del total`, color: "#B5649C" },
          { label: "Hombres candidatos", value: total - femaleCount, sub: `${Math.round(((total - femaleCount) / total) * 100)}% del total`, color: "var(--brand)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 38, fontWeight: 600, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
          Distribución por espectro político
        </div>
        {specs.map((k) => {
          const n = spectrumCount[k] || 0;
          const pct = (n / total) * 100;
          return (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: spectrumColors[k], textTransform: "capitalize" }}>{k}</span>
                <span style={{ color: "var(--ink-2)" }}>{n} candidatos · {Math.round(pct)}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "#F2F4F7", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: spectrumColors[k], borderRadius: 999, transition: "width 500ms ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Página principal ───
type Filter = "todos" | "punteros" | "izquierda" | "centro" | "derecha";

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>("todos");

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: ALL_CANDIDATES.length },
    { key: "punteros", label: "Punteros en encuestas", count: TOP_CANDIDATES.length },
    { key: "izquierda", label: "Izquierda", count: ALL_CANDIDATES.filter((c) => c.spectrum === "izquierda").length },
    { key: "centro", label: "Centro", count: ALL_CANDIDATES.filter((c) => c.spectrum === "centro").length },
    { key: "derecha", label: "Derecha", count: ALL_CANDIDATES.filter((c) => c.spectrum === "derecha").length },
  ];

  const list = filter === "todos" ? ALL_CANDIDATES
    : filter === "punteros" ? TOP_CANDIDATES
    : ALL_CANDIDATES.filter((c) => c.spectrum === filter);

  return (
    <>
      <FloatingCardsHero />
      <PartyMarquee />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 96px" }} id="grid-anchor">
        <DemographicsPanel />

        <div style={{ marginBottom: 24, display: "flex", alignItems: "end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--brand)", letterSpacing: "-0.01em" }}>
              Los 14 candidatos a la Presidencia
            </p>
            <h2 style={{
              margin: "0 0 8px", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em",
              color: "var(--ink)", lineHeight: 1.1,
              fontFamily: "var(--font-plex-serif), Georgia, serif",
            }}>
              Todos los candidatos
            </h2>
            <p style={{ margin: 0, fontSize: 18, color: "var(--ink-2)" }}>
              Filtra por espectro o encuestas, y toca una tarjeta para ver el perfil.
            </p>
          </div>
          <span style={{ fontSize: 15, color: "var(--ink-3)" }}>{list.length} mostrando</span>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                style={{
                  fontFamily: "inherit", fontSize: 15, fontWeight: 500,
                  padding: "10px 16px", borderRadius: 999, cursor: "pointer",
                  border: `1px solid ${active ? "var(--brand)" : "rgba(0,0,0,0.1)"}`,
                  background: active ? "var(--brand)" : "#fff",
                  color: active ? "#fff" : "var(--ink)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "all 160ms ease",
                }}
              >
                {f.label}
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                  background: active ? "rgba(255,255,255,0.22)" : "#F2F4F7",
                  color: active ? "#fff" : "var(--ink-2)",
                }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid de candidatos */}
        <section aria-label="Candidatos" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20, marginBottom: 48,
        }}>
          {list.map((c, i) => (
            <Link key={c.name} href={`/candidatos?name=${encodeURIComponent(c.name)}`} style={{ display: "contents" }}>
              <CandidateCard candidate={c} revealIndex={i} />
            </Link>
          ))}
        </section>

        {/* CTA banner */}
        <section style={{
          marginTop: 48, padding: "48px 56px",
          background: "linear-gradient(135deg, var(--brand), var(--brand-soft))",
          borderRadius: 28, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 32, flexWrap: "wrap",
          color: "#fff", boxShadow: "0 30px 60px -30px rgba(47,107,138,0.5)",
        }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{
              margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15,
              fontFamily: "var(--font-plex-serif), Georgia, serif",
            }}>
              ¿Aún no te decides?
            </h2>
            <p style={{ margin: "10px 0 0", fontSize: 19, lineHeight: 1.4, opacity: 0.92 }}>
              Compara propuestas lado a lado y conoce sus posiciones frente a 15 preguntas clave.
            </p>
          </div>
          <Link href="/compara">
            <button style={{
              fontFamily: "inherit", fontSize: 17, fontWeight: 600, padding: "16px 28px", borderRadius: 999,
              border: 0, background: "#fff", color: "var(--brand)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)", letterSpacing: "-0.01em",
            }}>
              Comparar propuestas <Chevron dir="right" />
            </button>
          </Link>
        </section>
      </main>
    </>
  );
}
