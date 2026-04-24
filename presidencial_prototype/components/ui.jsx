// ─── Initials + deterministic avatar ───
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Avatar({ name, color, size = 56 }) {
  const s = `${size}px`;
  return (
    <div
      aria-hidden="true"
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: color || "#E8EEF3",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: Math.round(size * 0.38) + "px",
        letterSpacing: "0.01em",
        flex: "0 0 auto",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
      }}
    >
      {initials(name)}
    </div>
  );
}

// ─── Spectrum dot ───
function SpectrumDot({ color }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flex: "0 0 auto",
      }}
    />
  );
}

// ─── Simple SF-style button ───
function Button({ children, variant = "primary", onClick, type = "button", ariaLabel, style = {} }) {
  const base = {
    fontFamily: "inherit",
    fontSize: 17,
    fontWeight: 500,
    padding: "14px 24px",
    borderRadius: 980,
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "transform 120ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
  const variants = {
    primary: { background: "var(--brand)", color: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
    secondary: { background: "#F2F4F7", color: "var(--ink)", border: "1px solid #E5E8EC" },
    ghost: { background: "transparent", color: "var(--brand)" },
  };
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

// ─── Chevron ───
function Chevron({ dir = "right", size = 16 }) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Step indicator (1 de 3) ───
function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: i === current - 1 ? 24 : 8,
            height: 8,
            borderRadius: 999,
            background: i + 1 <= current ? "var(--brand)" : "#D8DEE5",
            transition: "width 220ms ease, background 220ms ease",
          }}
        />
      ))}
      <span style={{ marginLeft: 6, fontSize: 15, color: "var(--ink-2)", fontWeight: 500 }}>
        Paso {current} de {total}
      </span>
    </div>
  );
}

// ─── Section label (small caps style but not aggressive) ───
function Eyebrow({ children }) {
  return (
    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--brand)", letterSpacing: "-0.01em" }}>
      {children}
    </p>
  );
}

Object.assign(window, { initials, Avatar, SpectrumDot, Button, Chevron, StepDots, Eyebrow });
