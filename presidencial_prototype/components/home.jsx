// ─── Hero animado: tarjetas flotantes orbitando ───
function FloatingCardsHero({ onOpen }) {
  const reduce = React.useMemo(() => {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }, []);
  const featured = window.TOP_CANDIDATES.slice(0, 7);

  // Posiciones fijas (porcentajes) alrededor del hero central
  const slots = [
    { x: 6,  y: 12, r: -8,  s: 0.92, d: 0.0, float: 3.2 },
    { x: 74, y: 8,  r: 6,   s: 1.0,  d: 0.3, float: 4.0 },
    { x: 2,  y: 54, r: 4,   s: 0.88, d: 0.6, float: 3.6 },
    { x: 80, y: 52, r: -5,  s: 0.95, d: 0.9, float: 4.2 },
    { x: 18, y: 86, r: -3,  s: 0.86, d: 1.2, float: 3.8 },
    { x: 62, y: 90, r: 7,   s: 0.9,  d: 1.5, float: 3.4 },
    { x: 40, y: 96, r: 0,   s: 0.82, d: 1.8, float: 4.4 },
  ];

  return (
    <section
      aria-label="Destacado"
      style={{
        position: "relative",
        minHeight: 640,
        overflow: "hidden",
        padding: "96px 32px 120px",
        background: "radial-gradient(1200px 600px at 50% -10%, rgba(47,107,138,0.10), transparent 60%), var(--bg)",
      }}
    >
      {/* floating cards behind */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {featured.map((c, i) => {
          const slot = slots[i % slots.length];
          return (
            <div
              key={c.name}
              className={reduce ? "" : "floatcard"}
              style={{
                position: "absolute",
                left: `calc(${slot.x}% - 110px)`,
                top: `calc(${slot.y}% - 60px)`,
                width: 220,
                transform: `rotate(${slot.r}deg) scale(${slot.s})`,
                animationDelay: `${slot.d}s`,
                animationDuration: `${slot.float}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <MiniCard candidate={c} index={i} />
            </div>
          );
        })}
      </div>

      {/* center hero */}
      <div style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <div className="hero-eyebrow">
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand)", display: "inline-block" }} />
          Elecciones Colombia · Mayo 2026
        </div>
        <h1
          className="hero-title"
          style={{
            margin: "20px 0 20px",
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            color: "var(--ink)",
          }}
        >
          Tu voto, <span style={{ color: "var(--brand)" }}>bien informado</span>.
        </h1>
        <p className="hero-sub" style={{ margin: "0 auto 32px", maxWidth: 620, fontSize: 21, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Conoce a los 14 candidatos a la Presidencia. Compara propuestas sobre salud, economía, educación y seguridad, con la misma información, lado a lado.
        </p>
        <div className="hero-cta" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" onClick={() => { const el = document.getElementById("grid-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            Ver candidatos <Chevron dir="down" />
          </Button>
          <Button variant="secondary" onClick={() => { window.__presiSetRoute && window.__presiSetRoute("compara"); }}>
            Comparar propuestas
          </Button>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ candidate, index }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 20px 40px -24px rgba(13,30,45,0.25)",
      }}
    >
      <Avatar name={candidate.name} color={candidate.color} size={40} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {candidate.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {candidate.party}
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta vertical tipo FIFA: foto grande + banner inferior ───
function CandidateCard({ candidate, onOpen, revealIndex = 0 }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const spectrumLabel = { izquierda: "Izquierda", centro: "Centro", derecha: "Derecha" }[candidate.spectrum] || "";
  const inits = candidate.name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen && onOpen(candidate)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 22,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 280ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 260ms ease, border-color 200ms ease, opacity 500ms ease",
        transform: visible
          ? (hover ? "translateY(-6px)" : "translateY(0)")
          : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${revealIndex * 60}ms`,
        boxShadow: hover ? "0 28px 56px -24px rgba(13,30,45,0.28)" : "0 2px 4px rgba(13,30,45,0.04)",
        borderColor: hover ? "rgba(47,107,138,0.28)" : "rgba(0,0,0,0.08)",
        fontFamily: "inherit",
        color: "inherit",
        width: "100%",
      }}
    >
      {/* Photo area — foto grande placeholder con degradado del color del partido */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 4",
          width: "100%",
          background: `
            radial-gradient(120% 80% at 50% 110%, rgba(0,0,0,0.35), transparent 55%),
            radial-gradient(100% 70% at 50% 0%, color-mix(in srgb, ${candidate.color} 30%, #fff) 0%, color-mix(in srgb, ${candidate.color} 55%, #2a2a2a) 100%)
          `,
          overflow: "hidden",
        }}
      >
        {/* Spectrum chip top-left */}
        <span
          style={{
            position: "absolute", top: 14, left: 14,
            fontSize: 12, fontWeight: 600, color: "#fff",
            padding: "6px 10px", borderRadius: 999,
            background: "rgba(0,0,0,0.32)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            letterSpacing: "-0.01em",
          }}
        >
          {spectrumLabel}
        </span>

        {/* Color swatch top-right */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 24, height: 24, borderRadius: 999,
            background: candidate.color,
            border: "2px solid rgba(255,255,255,0.9)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />

        {/* Giant initials as photo placeholder */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.95)",
            fontSize: "clamp(72px, 14vw, 120px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform 400ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          {inits}
        </div>

        {/* Soft reflective sheen */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)",
            pointerEvents: "none",
          }}
        />

        {/* Bottom fade for banner legibility */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: "35%",
            background: "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0))",
            pointerEvents: "none",
          }}
        />

        {/* Name overlay on photo */}
        <div
          style={{
            position: "absolute", left: 20, right: 20, bottom: 18,
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9, letterSpacing: "-0.005em" }}>
            Fórmula: {candidate.vice}
          </div>
        </div>
      </div>

      {/* Banner inferior — estilo FIFA */}
      <div
        style={{
          background: candidate.color,
          color: "#fff",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 6, height: 28, borderRadius: 3, background: "rgba(255,255,255,0.85)", flex: "0 0 auto" }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Partido
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {candidate.party}
            </div>
          </div>
        </div>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 600,
            padding: "8px 12px", borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            transform: hover ? "translateX(2px)" : "translateX(0)",
            transition: "transform 200ms ease, background 160ms ease",
            flex: "0 0 auto",
          }}
        >
          Ver <Chevron dir="right" size={12} />
        </span>
      </div>
    </button>
  );
}

// ─── Marquee de partidos (suave, informativo) ───
function PartyMarquee() {
  const items = [...window.ALL_CANDIDATES, ...window.ALL_CANDIDATES];
  return (
    <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "#fff", padding: "20px 0", overflow: "hidden", position: "relative" }}>
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

function HomePage({ setRoute, openCandidate }) {
  const [filter, setFilter] = React.useState("todos");
  React.useEffect(() => { window.__presiSetRoute = setRoute; }, [setRoute]);

  const filters = [
    { key: "todos", label: "Todos", count: window.ALL_CANDIDATES.length },
    { key: "punteros", label: "Punteros en encuestas", count: window.TOP_CANDIDATES.length },
    { key: "izquierda", label: "Izquierda", count: window.ALL_CANDIDATES.filter(c => c.spectrum === "izquierda").length },
    { key: "centro", label: "Centro", count: window.ALL_CANDIDATES.filter(c => c.spectrum === "centro").length },
    { key: "derecha", label: "Derecha", count: window.ALL_CANDIDATES.filter(c => c.spectrum === "derecha").length },
  ];

  const list = filter === "todos"
    ? window.ALL_CANDIDATES
    : filter === "punteros"
      ? window.TOP_CANDIDATES
      : window.ALL_CANDIDATES.filter(c => c.spectrum === filter);

  return (
    <>
      <FloatingCardsHero onOpen={openCandidate} />
      <PartyMarquee />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 96px" }} id="grid-anchor">
        <div style={{ marginBottom: 24, display: "flex", alignItems: "end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Eyebrow>Los 14 candidatos a la Presidencia</Eyebrow>
            <h2 style={{ margin: "12px 0 8px", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.1 }}>
              Todos los candidatos
            </h2>
            <p style={{ margin: 0, fontSize: 18, color: "var(--ink-2)" }}>Filtra por espectro o encuestas, y toca una tarjeta para ver su perfil.</p>
          </div>
          <span style={{ fontSize: 15, color: "var(--ink-3)" }}>{list.length} mostrando</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {filters.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                style={{
                  fontFamily: "inherit", fontSize: 15, fontWeight: 500,
                  padding: "10px 16px", borderRadius: 999, cursor: "pointer",
                  border: active ? "1px solid var(--brand)" : "1px solid rgba(0,0,0,0.1)",
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
                }}>{f.count}</span>
              </button>
            );
          })}
        </div>

        <section aria-label="Candidatos" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 48 }}>
          {list.map((c, i) => (
            <CandidateCard key={c.name} candidate={c} onOpen={openCandidate} revealIndex={i} />
          ))}
        </section>

        <section style={{
          marginTop: 48, padding: "48px 56px", background: "linear-gradient(135deg, var(--brand), var(--brand-soft))",
          borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap",
          color: "#fff", boxShadow: "0 30px 60px -30px rgba(47,107,138,0.5)",
        }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              ¿Aún no te decides?
            </h2>
            <p style={{ margin: "10px 0 0", fontSize: 19, lineHeight: 1.4, opacity: 0.92 }}>
              Compara propuestas lado a lado por los cuatro ejes que más pesan.
            </p>
          </div>
          <button
            onClick={() => setRoute("compara")}
            style={{
              fontFamily: "inherit", fontSize: 17, fontWeight: 600, padding: "16px 28px", borderRadius: 999,
              border: 0, background: "#fff", color: "var(--brand)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)", letterSpacing: "-0.01em",
            }}
          >
            Comparar propuestas <Chevron dir="right" />
          </button>
        </section>
      </main>
    </>
  );
}

Object.assign(window, { HomePage, CandidateCard, FloatingCardsHero, MiniCard, PartyMarquee });
