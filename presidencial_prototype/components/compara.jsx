// Candidatos que participan en la comparativa (los que tenemos data completa)
function getCompareCandidates() {
  const names = ["Iván Cepeda", "Abelardo de la Espriella", "Paloma Valencia", "Claudia López", "Roy Barreras", "Sergio Fajardo", "Miguel Uribe Londoño", "Luis Gilberto Murillo"];
  return names.map((n) => window.ALL_CANDIDATES.find((c) => c.name === n)).filter(Boolean);
}

// ─────────────────────────────────────────────────────────
// VISTA MATRIZ IDEOLÓGICA — ejes Económico × Social (rediseño v2)
// ─────────────────────────────────────────────────────────
function IdeologyMatrixView({ candidates }) {
  const [hovered, setHovered] = React.useState(null);
  const [pinned, setPinned] = React.useState(null);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 });
  const wrapRef = React.useRef(null);

  const plotted = React.useMemo(() => {
    return window.ALL_CANDIDATES
      .map((c) => {
        const coords = window.IDEOLOGY_MATRIX[c.name];
        if (!coords) return null;
        return { ...c, ...coords };
      })
      .filter(Boolean);
  }, []);

  // Viewbox grande
  const W = 1200;
  const H = 900;
  const pad = 90;
  const toX = (econ) => pad + ((econ + 1) / 2) * (W - 2 * pad);
  const toY = (social) => pad + ((social + 1) / 2) * (H - 2 * pad);

  const quadrants = [
    { x: toX(-0.55), y: toY(-0.82), label: ["PROGRESISTA", "ESTATISTA"], color: "#B3261E", bg: "#B3261E" },
    { x: toX(0.55),  y: toY(-0.82), label: ["PROGRESISTA", "LIBERAL"],   color: "#2F6B8A", bg: "#2F6B8A" },
    { x: toX(-0.55), y: toY(0.82),  label: ["CONSERVADOR", "ESTATISTA"], color: "#8B5A3C", bg: "#8B5A3C" },
    { x: toX(0.55),  y: toY(0.82),  label: ["CONSERVADOR", "LIBERAL"],   color: "#1E40AF", bg: "#1E40AF" },
  ];

  const active = pinned || hovered;
  const activeCand = plotted.find((c) => c.name === active);

  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const quadrantName = (c) => {
    const isLeft = c.econ < 0;
    const isProg = c.social < 0;
    if (isLeft && isProg) return { label: "Progresista estatista", color: "#B3261E" };
    if (!isLeft && isProg) return { label: "Progresista liberal", color: "#2F6B8A" };
    if (isLeft && !isProg) return { label: "Conservador estatista", color: "#8B5A3C" };
    return { label: "Conservador liberal", color: "#1E40AF" };
  };

  return (
    <div>
      {/* Intro header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "var(--brand)",
            background: "rgba(47,107,138,0.1)", padding: "5px 11px", borderRadius: 999,
            letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12,
          }}>
            ⊞ Matriz ideológica
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1 }}>
            ¿Hacia dónde apunta cada candidato?
          </h3>
          <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.45 }}>
            Pasa el cursor sobre cualquier punto para ver detalles. Toca para fijar la selección.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--ink-2)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#B3261E" }} /> Izquierda
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2F6B8A" }} /> Centro
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1E40AF" }} /> Derecha
          </span>
        </div>
      </div>

      {/* Matriz grande */}
      <div
        ref={wrapRef}
        onMouseMove={handleMove}
        style={{
          background: "linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 28,
          padding: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Quadrant backgrounds */}
          <rect x={pad} y={pad} width={(W - 2*pad)/2} height={(H - 2*pad)/2} fill="#B3261E" opacity="0.045" />
          <rect x={pad + (W - 2*pad)/2} y={pad} width={(W - 2*pad)/2} height={(H - 2*pad)/2} fill="#2F6B8A" opacity="0.045" />
          <rect x={pad} y={pad + (H - 2*pad)/2} width={(W - 2*pad)/2} height={(H - 2*pad)/2} fill="#8B5A3C" opacity="0.045" />
          <rect x={pad + (W - 2*pad)/2} y={pad + (H - 2*pad)/2} width={(W - 2*pad)/2} height={(H - 2*pad)/2} fill="#1E40AF" opacity="0.045" />

          {/* Grid */}
          {[-0.75, -0.5, -0.25, 0.25, 0.5, 0.75].map((v) => (
            <line key={"gx" + v} x1={toX(v)} y1={pad} x2={toX(v)} y2={H - pad} stroke="rgba(0,0,0,0.06)" strokeDasharray="2 6" />
          ))}
          {[-0.75, -0.5, -0.25, 0.25, 0.5, 0.75].map((v) => (
            <line key={"gy" + v} x1={pad} y1={toY(v)} x2={W - pad} y2={toY(v)} stroke="rgba(0,0,0,0.06)" strokeDasharray="2 6" />
          ))}

          {/* Frame */}
          <rect x={pad} y={pad} width={W - 2*pad} height={H - 2*pad} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" rx="12" />

          {/* Main axes */}
          <line x1={pad} y1={toY(0)} x2={W - pad} y2={toY(0)} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
          <line x1={toX(0)} y1={pad} x2={toX(0)} y2={H - pad} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />

          {/* Axis labels (larger) */}
          <text x={pad + 6} y={toY(0) - 14} fontSize="16" fill="#515154" textAnchor="start" fontWeight="700" letterSpacing="0.08em">← ESTADO</text>
          <text x={W - pad - 6} y={toY(0) - 14} fontSize="16" fill="#515154" textAnchor="end" fontWeight="700" letterSpacing="0.08em">MERCADO →</text>
          <text x={toX(0) + 14} y={pad + 22} fontSize="16" fill="#515154" fontWeight="700" letterSpacing="0.08em">↑ PROGRESISTA</text>
          <text x={toX(0) + 14} y={H - pad - 10} fontSize="16" fill="#515154" fontWeight="700" letterSpacing="0.08em">↓ CONSERVADOR</text>

          {/* Quadrant labels */}
          {quadrants.map((q, i) => (
            <g key={i} opacity={active ? 0.18 : 0.4} style={{ transition: "opacity 200ms ease" }}>
              {q.label.map((ln, li) => (
                <text
                  key={li}
                  x={q.x} y={q.y + li * 18}
                  fontSize="15" fill={q.color} fontWeight="800"
                  textAnchor="middle" letterSpacing="0.1em"
                >
                  {ln}
                </text>
              ))}
            </g>
          ))}

          {/* Halo for active */}
          {activeCand && (
            <g>
              <circle
                cx={toX(activeCand.econ)} cy={toY(activeCand.social)}
                r={34} fill={activeCand.color} opacity="0.12"
              />
              <circle
                cx={toX(activeCand.econ)} cy={toY(activeCand.social)}
                r={24} fill="none" stroke={activeCand.color} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5"
              />
            </g>
          )}

          {/* Dots — hit area mucho más grande */}
          {plotted.map((c) => {
            const cx = toX(c.econ);
            const cy = toY(c.social);
            const isActive = active === c.name;
            const dimmed = active && !isActive;
            const r = isActive ? 18 : 14;
            return (
              <g
                key={c.name}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned(pinned === c.name ? null : c.name)}
                style={{ cursor: "pointer" }}
                opacity={dimmed ? 0.35 : 1}
              >
                {/* invisible large hit */}
                <circle cx={cx} cy={cy} r={30} fill="transparent" />
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={c.color}
                  stroke="#fff" strokeWidth={isActive ? 4 : 3}
                  style={{ transition: "all 200ms cubic-bezier(0.2,0.8,0.2,1)" }}
                />
                {isActive && pinned === c.name && (
                  <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={c.color} strokeWidth="2" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {activeCand && (() => {
          const q = quadrantName(activeCand);
          const econLabel = activeCand.econ >= 0 ? "Mercado" : "Estado";
          const socialLabel = activeCand.social >= 0 ? "Conservador" : "Progresista";
          const tooltipW = 300;
          const tooltipH = 180;
          // Smart position — flip if near edges
          const wrapRect = wrapRef.current?.getBoundingClientRect();
          const maxX = wrapRect ? wrapRect.width : 1200;
          const maxY = wrapRect ? wrapRect.height : 900;
          let left = cursor.x + 18;
          let top = cursor.y + 18;
          if (left + tooltipW > maxX - 12) left = cursor.x - tooltipW - 18;
          if (top + tooltipH > maxY - 12) top = cursor.y - tooltipH - 18;
          if (left < 12) left = 12;
          if (top < 12) top = 12;
          return (
            <div
              style={{
                position: "absolute", left, top,
                width: tooltipW,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 24px 60px -20px rgba(13,30,45,0.3), 0 0 0 1px rgba(0,0,0,0.06)",
                padding: 18,
                pointerEvents: "none",
                transition: "left 80ms linear, top 80ms linear",
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <Avatar name={activeCand.name} color={activeCand.color} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {activeCand.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {activeCand.party}
                  </div>
                </div>
              </div>
              <div style={{
                display: "inline-block",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                color: q.color, background: q.color + "18",
                padding: "4px 10px", borderRadius: 6, marginBottom: 12,
                textTransform: "uppercase",
              }}>
                {q.label}
              </div>
              <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}>
                  <span>Economía</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{econLabel} · {activeCand.econ >= 0 ? "+" : ""}{activeCand.econ.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}>
                  <span>Social</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{socialLabel} · {activeCand.social >= 0 ? "+" : ""}{activeCand.social.toFixed(2)}</span>
                </div>
              </div>
              {pinned === activeCand.name && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: 11, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  ● FIJADO · Toca el punto para soltar
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Lista debajo — chips clicables, full width */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
          {plotted.length} candidatos en la matriz
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {plotted.map((c) => {
            const isActive = active === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setPinned(pinned === c.name ? null : c.name)}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                  padding: "8px 14px 8px 8px", borderRadius: 999,
                  border: isActive ? `1.5px solid ${c.color}` : "1px solid rgba(0,0,0,0.1)",
                  background: isActive ? `${c.color}12` : "#fff",
                  color: "var(--ink)", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "all 140ms ease",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5 }}>
        <strong>Horizontal:</strong> intervención del Estado ←→ libre mercado  ·  <strong>Vertical:</strong> valores progresistas ↑↓ conservadores.
        <br />
        La ubicación es una aproximación basada en declaraciones públicas y propuestas. No es una medición formal.
      </p>
    </div>
  );
}

function AnswerDot({ answer, active, onClick, disabled }) {
  const isYes = answer === "yes";
  const isNo = answer === "no";
  const base = {
    width: 44, height: 44, borderRadius: "50%", border: "0", cursor: disabled ? "default" : "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 600, transition: "transform 160ms ease, box-shadow 160ms ease",
    fontFamily: "inherit",
  };
  let bg = "#E8EEF3", fg = "#86868B", icon = "—";
  if (isYes) { bg = "#1F8F5C"; fg = "#fff"; icon = "✓"; }
  else if (isNo) { bg = "#C8453C"; fg = "#fff"; icon = "✕"; }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || answer === "na"}
      aria-label={isYes ? "Sí — ver declaración" : isNo ? "No — ver declaración" : "Sin posición declarada"}
      style={{
        ...base, background: bg, color: fg,
        boxShadow: active ? "0 0 0 3px rgba(47,107,138,0.35)" : "none",
        transform: active ? "scale(1.08)" : "scale(1)",
      }}
      onMouseEnter={(e) => { if (!disabled && answer !== "na") e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.transform = "scale(1)"; }}
    >
      {icon}
    </button>
  );
}

function QuestionRow({ question, candidates, expanded, onToggle, activeCandidate, setActiveCandidate }) {
  const answerFor = (name) => {
    if (question.yes.includes(name)) return "yes";
    if (question.no.includes(name)) return "no";
    return "na";
  };
  const yesCount = question.yes.length;
  const noCount = question.no.length;
  const total = candidates.length;

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      {/* Row header (question + candidate dots) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(320px, 1fr) repeat(${candidates.length}, 72px) 48px`,
          alignItems: "center",
          padding: "20px 28px",
          gap: 8,
          cursor: "pointer",
          transition: "background 160ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFBFC"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        onClick={onToggle}
      >
        <div style={{ paddingRight: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, color: "var(--ink-3)",
              background: "#F2F4F7", padding: "3px 10px", borderRadius: 999, letterSpacing: "0.02em",
            }}>
              {question.cat}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              <span style={{ color: "#1F8F5C", fontWeight: 600 }}>{yesCount} Sí</span>
              {" · "}
              <span style={{ color: "#C8453C", fontWeight: 600 }}>{noCount} No</span>
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1.35 }}>
            {question.q}
          </div>
        </div>
        {candidates.map((c) => {
          const ans = answerFor(c.name);
          return (
            <div key={c.name} style={{ display: "flex", justifyContent: "center" }}>
              <AnswerDot
                answer={ans}
                active={expanded && activeCandidate === c.name}
                disabled={ans === "na"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (ans === "na") return;
                  if (expanded && activeCandidate === c.name) {
                    onToggle();
                  } else {
                    if (!expanded) onToggle();
                    setActiveCandidate(c.name);
                  }
                }}
              />
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", color: "var(--ink-3)" }}>
          <div style={{ transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 220ms ease" }}>
            <Chevron dir="right" />
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#FAFBFC", borderRadius: 18, padding: 22, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
              {candidates.map((c) => {
                const ans = answerFor(c.name);
                if (ans === "na") return null;
                const isActive = activeCandidate === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActiveCandidate(c.name)}
                    style={{
                      fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                      padding: "8px 14px 8px 8px", borderRadius: 999,
                      border: isActive ? `1.5px solid ${c.color}` : "1px solid rgba(0,0,0,0.1)",
                      background: isActive ? "#fff" : "#fff",
                      color: "var(--ink)", cursor: "pointer",
                      display: "inline-flex", alignItems: "center", gap: 8,
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                      transition: "all 140ms ease",
                    }}
                  >
                    <Avatar name={c.name} color={c.color} size={26} />
                    <span>{c.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: ans === "yes" ? "#1F8F5C" : "#C8453C",
                      marginLeft: 2,
                    }}>
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
                <div style={{
                  background: "#fff", borderRadius: 14, padding: "18px 20px",
                  borderLeft: `4px solid ${ans === "yes" ? "#1F8F5C" : "#C8453C"}`,
                  display: "flex", gap: 16, alignItems: "flex-start",
                }}>
                  <Avatar name={c.name} color={c.color} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 999,
                        background: ans === "yes" ? "rgba(31,143,92,0.12)" : "rgba(200,69,60,0.12)",
                        color: ans === "yes" ? "#1F8F5C" : "#C8453C",
                      }}>
                        {ans === "yes" ? "Responde SÍ" : "Responde NO"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>
                      {quote || "Posición declarada en su plan de gobierno."}
                    </p>
                    <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-3)" }}>
                      {c.party}
                    </div>
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

function ComparaPage() {
  const [view, setView] = React.useState("preguntas"); // "preguntas" | "matriz"
  const [category, setCategory] = React.useState("Todas");
  const [expandedIdx, setExpandedIdx] = React.useState(null);
  const [activeCandidate, setActiveCandidate] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const candidates = getCompareCandidates();
  const categories = ["Todas", ...window.COMPARE_CATEGORIES];

  const filtered = window.COMPARE_QUESTIONS
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => category === "Todas" || q.cat === category)
    .filter(({ q }) => !search.trim() || q.q.toLowerCase().includes(search.toLowerCase()));

  const toggleRow = (i) => {
    if (expandedIdx === i) {
      setExpandedIdx(null);
      setActiveCandidate(null);
    } else {
      setExpandedIdx(i);
      setActiveCandidate(null);
    }
  };

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 96px" }}>
      {/* Hero tipo Apple Compare */}
      <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 36px" }}>
        <Eyebrow>Comparar candidatos</Eyebrow>
        <h1 style={{ margin: "12px 0 16px", fontSize: 56, fontWeight: 600, letterSpacing: "-0.035em", color: "var(--ink)", lineHeight: 1.02 }}>
          ¿Qué opina cada uno?
        </h1>
        <p style={{ margin: 0, fontSize: 21, color: "var(--ink-2)", lineHeight: 1.45 }}>
          15 preguntas clave sobre los temas que más importan, o una vista en matriz ideológica para entender a todos de un vistazo.
        </p>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", gap: 4, padding: 4,
          background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}>
          {[
            { k: "preguntas", l: "Por preguntas", icon: "✓" },
            { k: "matriz", l: "Matriz ideológica", icon: "⊞" },
          ].map((o) => (
            <button
              key={o.k}
              onClick={() => setView(o.k)}
              style={{
                fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer",
                padding: "10px 18px", borderRadius: 10, border: 0,
                background: view === o.k ? "var(--brand)" : "transparent",
                color: view === o.k ? "#fff" : "var(--ink-2)",
                transition: "all 160ms ease",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ fontSize: 14, opacity: 0.8 }}>{o.icon}</span>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {view === "matriz" && <IdeologyMatrixView candidates={candidates} />}

      {view === "preguntas" && (<>
      {/* Leyenda + buscador */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between",
        padding: "16px 22px", background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16, marginBottom: 20,
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: "var(--ink-2)" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1F8F5C", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✓</span>
            A favor
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: "var(--ink-2)" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#C8453C", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✕</span>
            En contra
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: "var(--ink-2)" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#E8EEF3", color: "#86868B", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>—</span>
            Sin posición
          </span>
        </div>
        <input
          type="search"
          placeholder="Buscar pregunta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            fontFamily: "inherit", fontSize: 15,
            padding: "10px 16px", borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)", outline: "none",
            background: "#FAFBFC", minWidth: 260,
          }}
        />
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setExpandedIdx(null); setActiveCandidate(null); }}
              style={{
                fontFamily: "inherit", fontSize: 15, fontWeight: 500,
                padding: "10px 18px", borderRadius: 999, cursor: "pointer",
                border: active ? "1px solid var(--brand)" : "1px solid rgba(0,0,0,0.1)",
                background: active ? "var(--brand)" : "#fff",
                color: active ? "#fff" : "var(--ink)",
                transition: "all 160ms ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 24, overflow: "hidden" }}>
        {/* Header with candidate avatars (non-sticky to avoid overlap with nav) */}
        <div style={{
          background: "#FAFBFC",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "grid",
          gridTemplateColumns: `minmax(320px, 1fr) repeat(${candidates.length}, 72px) 48px`,
          padding: "16px 28px",
          gap: 8, alignItems: "end",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Pregunta
          </div>
          {candidates.map((c) => (
            <div key={c.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Avatar name={c.name} color={c.color} size={40} />
              <div style={{
                fontSize: 11, fontWeight: 600, color: "var(--ink-2)",
                textAlign: "center", lineHeight: 1.15, maxWidth: 70,
                letterSpacing: "-0.01em",
              }}>
                {c.name.split(" ").slice(-1)[0]}
              </div>
            </div>
          ))}
          <div />
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "56px 24px", textAlign: "center", fontSize: 17, color: "var(--ink-2)" }}>
            No se encontraron preguntas.
          </div>
        )}

        {filtered.map(({ q, i }) => (
          <QuestionRow
            key={i}
            question={q}
            candidates={candidates}
            expanded={expandedIdx === i}
            onToggle={() => toggleRow(i)}
            activeCandidate={activeCandidate}
            setActiveCandidate={setActiveCandidate}
          />
        ))}
      </div>

      {/* Footnote */}
      <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5 }}>
        Las respuestas se basan en declaraciones públicas, planes de gobierno y entrevistas.
        Si no hay posición registrada, aparece como guión (—).
      </p>
      </>)}
    </main>
  );
}

function ContactoPage() {
  const [sent, setSent] = React.useState(false);
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 96px" }}>
      <Eyebrow>Contáctanos</Eyebrow>
      <h1 style={{ margin: "12px 0 16px", fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05 }}>
        ¿Tienes dudas o sugerencias?
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 20, color: "var(--ink-2)", lineHeight: 1.45 }}>
        Escríbenos y te responderemos en menos de 48 horas. Este proyecto es abierto y apartidista.
      </p>

      {sent ? (
        <div style={{ background: "#F1F7F3", borderRadius: 20, padding: 32, border: "1px solid #CFE3D6" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#1F6E4A", marginBottom: 8 }}>Mensaje enviado.</div>
          <div style={{ fontSize: 17, color: "var(--ink-2)" }}>Gracias por escribirnos. Te contactaremos pronto.</div>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", padding: 32, display: "grid", gap: 20 }}
        >
          {[
            { id: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
            { id: "email", label: "Correo electrónico", type: "email", placeholder: "tu@correo.com" },
          ].map((f) => (
            <label key={f.id} style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>{f.label}</span>
              <input
                type={f.type} required placeholder={f.placeholder}
                style={{
                  fontFamily: "inherit", fontSize: 17, padding: "14px 16px", borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.14)", outline: "none", background: "#FAFBFC",
                  transition: "border-color 160ms ease, background 160ms ease",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.14)"; e.target.style.background = "#FAFBFC"; }}
              />
            </label>
          ))}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>Mensaje</span>
            <textarea
              required rows={5} placeholder="Escribe aquí tu mensaje..."
              style={{
                fontFamily: "inherit", fontSize: 17, padding: "14px 16px", borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.14)", outline: "none", background: "#FAFBFC", resize: "vertical",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.14)"; e.target.style.background = "#FAFBFC"; }}
            />
          </label>
          <div>
            <Button variant="primary" type="submit">Enviar mensaje</Button>
          </div>
        </form>
      )}
    </main>
  );
}

Object.assign(window, { ComparaPage, ContactoPage });
