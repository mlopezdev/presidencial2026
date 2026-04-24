// ─────────────────────────────────────────────────────────
// HISTORIAL — tracking electoral Colombia 2010–2022
// Estilo editorial sobrio tipo NYT/Bloomberg
// ─────────────────────────────────────────────────────────

const EL_YEARS = [2010, 2014, 2018, 2022];
const SPECTRUM_CLR = { izquierda: "#B3261E", centro: "#6B7280", derecha: "#1E40AF" };

// ─── Numeric helpers ───
const fmt = (n) => n.toLocaleString("es-CO");
const pct = (n, d = 1) => `${n.toFixed(d)}%`;

// ═════════════════════════════════════════════════════════
// SECCIÓN A — Hero editorial con selector de año
// ═════════════════════════════════════════════════════════
function ElHero({ year, setYear }) {
  const h = window.EL_HEADLINES[year];
  const n = window.EL_NATIONAL[year];
  return (
    <header style={{
      borderBottom: "1px solid #1D1D1F",
      paddingBottom: 48, marginBottom: 48,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#86868B", marginBottom: 18,
      }}>
        ELECCIONES PRESIDENCIALES · COLOMBIA · 2010 – 2022
      </div>
      <h1 style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 64, fontWeight: 400, letterSpacing: "-0.02em",
        lineHeight: 1.02, margin: "0 0 20px", maxWidth: 900,
        color: "#1D1D1F",
      }}>
        Cómo votó Colombia<br />
        <em style={{ fontStyle: "italic", color: "#515154" }}>en las últimas cuatro elecciones.</em>
      </h1>
      <p style={{
        fontSize: 19, color: "#515154", lineHeight: 1.55, maxWidth: 720, margin: 0,
      }}>
        Un recorrido por los resultados, los mapas que cambiaron, los departamentos
        que se movieron de un lado a otro y la abstención que sigue siendo la otra
        mitad del país. <span style={{ color: "#86868B" }}>Fuente: Registraduría Nacional del Estado Civil.</span>
      </p>

      {/* Year pills */}
      <div style={{ display: "flex", gap: 4, marginTop: 32, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 0 }}>
        {EL_YEARS.map((y) => {
          const active = y === year;
          const wy = window.EL_NATIONAL[y].winner;
          return (
            <button
              key={y}
              onClick={() => setYear(y)}
              style={{
                fontFamily: "inherit", cursor: "pointer",
                padding: "14px 22px", border: 0,
                borderBottom: active ? "3px solid #1D1D1F" : "3px solid transparent",
                marginBottom: -1,
                background: "transparent",
                color: active ? "#1D1D1F" : "#86868B",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                transition: "color 160ms ease",
              }}
            >
              <span style={{ fontSize: 22, fontWeight: active ? 700 : 500, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
                {y}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: active ? "#515154" : "#A0A0A0" }}>
                {wy}
              </span>
            </button>
          );
        })}
      </div>

      {/* Headline + stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, marginTop: 36, alignItems: "start" }}>
        <div>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#B3261E", marginBottom: 10,
          }}>
            {year} · La historia
          </div>
          <h2 style={{
            fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 400,
            lineHeight: 1.15, letterSpacing: "-0.015em", margin: "0 0 14px", color: "#1D1D1F",
          }}>
            {h.title}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#515154", margin: 0 }}>
            {h.blurb}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0,0,0,0.08)" }}>
          {[
            { label: "Ganador", value: n.winner, big: true },
            { label: "Total de votos", value: fmt(n.totalVotes) },
            { label: "Participación", value: pct(n.turnout) },
            { label: "Abstención", value: pct(n.abstencion), warn: true },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#fff", padding: "18px 20px",
              gridColumn: s.big ? "span 2" : "auto",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#86868B", marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: s.big ? 28 : 22, fontWeight: 400,
                color: s.warn ? "#B3261E" : "#1D1D1F", lineHeight: 1.1, letterSpacing: "-0.015em",
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN B — Barras resultados 1ra y 2da vuelta
// ═════════════════════════════════════════════════════════
function ElRoundBars({ year }) {
  const [round, setRound] = React.useState("r1");
  const n = window.EL_NATIONAL[year];
  const data = round === "r1" ? n.r1 : n.r2;
  const max = Math.max(...data.map((d) => d.pct));

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Resultados nacionales"
        title="La foto de cada vuelta"
        dek={`Porcentaje sobre votos válidos. ${round === "r1" ? "Primera" : "Segunda"} vuelta.`}
      />

      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "#F2F4F7", borderRadius: 10, width: "fit-content" }}>
        {[
          { k: "r1", l: "1ra vuelta" },
          { k: "r2", l: "2da vuelta" },
        ].map((o) => (
          <button
            key={o.k}
            onClick={() => setRound(o.k)}
            style={{
              fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 18px", border: 0, borderRadius: 7,
              background: round === o.k ? "#fff" : "transparent",
              color: round === o.k ? "#1D1D1F" : "#515154",
              boxShadow: round === o.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {data.map((d, i) => {
          const w = (d.pct / max) * 100;
          const isWinner = i === 0;
          const color = window.EL_COLOR[d.name] || "#6B7280";
          return (
            <div key={d.name} style={{ display: "grid", gridTemplateColumns: "220px 1fr 120px", gap: 16, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1D1D1F", letterSpacing: "-0.01em" }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: "#86868B", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
                  {window.EL_SPECTRUM[d.name] || ""}
                  {isWinner && <span style={{ color: "#1F8F5C", marginLeft: 8, fontWeight: 700 }}>· GANADOR</span>}
                </div>
              </div>
              <div style={{ position: "relative", height: 38, background: "#F7F8FA", borderRadius: 3 }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${w}%`, background: color,
                  borderRadius: 3,
                  transition: "width 700ms cubic-bezier(0.2,0.8,0.2,1)",
                }} />
                <div style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, fontWeight: 600,
                  color: w > 28 ? "#fff" : "#1D1D1F",
                }}>
                  {pct(d.pct)}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#515154", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {fmt(d.votes)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN C — Tile map de Colombia
// ═════════════════════════════════════════════════════════
function ElTileMap({ year, highlightCandidate, onDeptHover, onDeptClick, hoveredDept, selectedDept }) {
  const cell = 64;
  const gap = 4;
  const maxCol = Math.max(...window.CO_TILES.map((t) => t.col));
  const maxRow = Math.max(...window.CO_TILES.map((t) => t.row));
  const W = (maxCol + 1) * (cell + gap);
  const H = (maxRow + 1) * (cell + gap);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {window.CO_TILES.map((t) => {
        const winner = window.EL_DEPT_WINNER[t.dept]?.[year];
        const baseColor = window.EL_COLOR[winner] || "#E5E7EB";
        const pcts = window.EL_DEPT_PCT[year]?.[t.dept];
        const winnerPct = pcts ? pcts[winner] : null;

        const isHovered = hoveredDept === t.dept;
        const isSelected = selectedDept === t.dept;
        let fill = baseColor;
        let opacity = 1;

        if (highlightCandidate) {
          if (winner === highlightCandidate) {
            fill = baseColor;
            opacity = 1;
          } else if (pcts && pcts[highlightCandidate]) {
            // gradient darker based on % of that candidate
            const p = pcts[highlightCandidate];
            const alpha = 0.2 + (p / 100) * 0.6;
            fill = window.EL_COLOR[highlightCandidate] + Math.round(alpha * 255).toString(16).padStart(2, "0");
            opacity = 1;
          } else {
            fill = "#F2F4F7";
            opacity = 1;
          }
        }

        const x = t.col * (cell + gap);
        const y = t.row * (cell + gap);

        return (
          <g
            key={t.dept}
            onMouseEnter={() => onDeptHover(t.dept)}
            onMouseLeave={() => onDeptHover(null)}
            onClick={() => onDeptClick(t.dept)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x} y={y} width={cell} height={cell}
              fill={fill} opacity={opacity}
              rx={4}
              stroke={isSelected ? "#1D1D1F" : isHovered ? "#1D1D1F" : "rgba(0,0,0,0.08)"}
              strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
              style={{ transition: "all 200ms ease" }}
            />
            <text
              x={x + cell / 2} y={y + cell / 2 - 2}
              textAnchor="middle" fontSize="12" fontWeight="700"
              fill={contrastColor(fill)} style={{ pointerEvents: "none", letterSpacing: "0.04em" }}
            >
              {t.abbr}
            </text>
            {winnerPct && (
              <text
                x={x + cell / 2} y={y + cell / 2 + 13}
                textAnchor="middle" fontSize="10" fontWeight="600"
                fill={contrastColor(fill)} style={{ pointerEvents: "none", opacity: 0.85 }}
              >
                {Math.round(winnerPct)}%
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function contrastColor(hex) {
  if (!hex || !hex.startsWith("#")) return "#1D1D1F";
  const c = hex.replace("#", "");
  if (c.length < 6) return "#1D1D1F";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.58 ? "#1D1D1F" : "#FFFFFF";
}

// ═════════════════════════════════════════════════════════
// SECCIÓN D — Mapa interactivo + panel de detalle
// ═════════════════════════════════════════════════════════
function ElMapSection({ year, compareMode }) {
  const [hoveredDept, setHoveredDept] = React.useState(null);
  const [selectedDept, setSelectedDept] = React.useState(null);
  const [filter, setFilter] = React.useState(null); // candidate name
  const [compareYear, setCompareYear] = React.useState(2018);

  // candidatos visibles (top 3 de r1 del año)
  const candidates = React.useMemo(() => {
    return window.EL_NATIONAL[year].r1.slice(0, 4).map((c) => c.name);
  }, [year]);

  const activeDept = hoveredDept || selectedDept;

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Geografía del voto"
        title="Dónde ganó cada quién"
        dek="Ganador por departamento en segunda vuelta. Pasa el cursor para ver detalles. Filtra por candidato para medir su fuerza territorial."
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Resaltar:
        </span>
        <button
          onClick={() => setFilter(null)}
          style={pillStyle(filter === null)}
        >
          Todos
        </button>
        {candidates.map((n) => (
          <button
            key={n}
            onClick={() => setFilter(filter === n ? null : n)}
            style={{
              ...pillStyle(filter === n),
              borderColor: filter === n ? window.EL_COLOR[n] : "rgba(0,0,0,0.12)",
              background: filter === n ? window.EL_COLOR[n] : "#fff",
              color: filter === n ? "#fff" : "#1D1D1F",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: window.EL_COLOR[n],
              display: "inline-block", marginRight: 8, verticalAlign: "middle",
              border: filter === n ? "1.5px solid #fff" : "none",
            }} />
            {n}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: compareMode ? "1fr 1fr" : "minmax(0, 1.4fr) minmax(300px, 0.8fr)", gap: 32, alignItems: "start" }}>
        {/* MAPA */}
        <div>
          {compareMode && (
            <div style={{
              display: "flex", gap: 4, marginBottom: 12, padding: 3,
              background: "#F2F4F7", borderRadius: 8, width: "fit-content",
            }}>
              {EL_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setCompareYear(y)}
                  style={{
                    fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    padding: "5px 12px", border: 0, borderRadius: 5,
                    background: compareYear === y ? "#fff" : "transparent",
                    color: compareYear === y ? "#1D1D1F" : "#515154",
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            {compareMode ? `A · ${compareYear}` : `Elección ${year}`}
          </div>
          <ElTileMap
            year={compareMode ? compareYear : year}
            highlightCandidate={filter}
            onDeptHover={setHoveredDept}
            onDeptClick={(d) => setSelectedDept(selectedDept === d ? null : d)}
            hoveredDept={hoveredDept}
            selectedDept={selectedDept}
          />
        </div>

        {compareMode ? (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, marginTop: compareMode ? 32 : 0 }}>
              B · {year}
            </div>
            <ElTileMap
              year={year}
              highlightCandidate={filter}
              onDeptHover={setHoveredDept}
              onDeptClick={(d) => setSelectedDept(selectedDept === d ? null : d)}
              hoveredDept={hoveredDept}
              selectedDept={selectedDept}
            />
          </div>
        ) : (
          <div style={{ position: "sticky", top: 84 }}>
            <ElDeptDetail dept={activeDept} year={year} />
          </div>
        )}
      </div>
    </section>
  );
}

function pillStyle(active) {
  return {
    fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer",
    padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.12)",
    background: active ? "#1D1D1F" : "#fff",
    color: active ? "#fff" : "#1D1D1F",
    transition: "all 140ms ease",
  };
}

// Panel de detalle cuando se selecciona un depto (con tracking 2010–2022)
function ElDeptDetail({ dept, year }) {
  if (!dept) {
    return (
      <div style={{
        background: "#FAFBFC", border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16, padding: 28, textAlign: "center",
      }}>
        <div style={{ fontSize: 56, marginBottom: 12, fontFamily: "Georgia, serif", color: "#D0D0D0" }}>◎</div>
        <div style={{ fontSize: 15, color: "#515154", lineHeight: 1.5, maxWidth: 260, margin: "0 auto" }}>
          Pasa el cursor sobre un departamento o haz clic para fijarlo.
        </div>
      </div>
    );
  }

  const history = window.EL_DEPT_WINNER[dept];
  const curPcts = window.EL_DEPT_PCT[year]?.[dept];
  const winner = history?.[year];
  const tile = window.CO_TILES.find((t) => t.dept === dept);

  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 16, padding: 24,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {tile?.region || "Departamento"}
      </div>
      <h3 style={{
        fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400,
        margin: "0 0 4px", color: "#1D1D1F", letterSpacing: "-0.015em", lineHeight: 1.1,
      }}>
        {dept}
      </h3>

      {curPcts && (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Resultado {year} · 2da vuelta
          </div>
          {Object.entries(curPcts).sort((a, b) => b[1] - a[1]).map(([name, p]) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "#1D1D1F" }}>{name}</span>
                <span style={{ color: "#515154", fontVariantNumeric: "tabular-nums" }}>{pct(p)}</span>
              </div>
              <div style={{ height: 6, background: "#F2F4F7", borderRadius: 3 }}>
                <div style={{
                  height: "100%", width: `${p}%`,
                  background: window.EL_COLOR[name] || "#6B7280",
                  borderRadius: 3,
                  transition: "width 500ms ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking histórico */}
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Ganador, elección por elección
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {EL_YEARS.map((y) => {
            const w = history?.[y];
            const color = window.EL_COLOR[w] || "#E5E7EB";
            return (
              <div key={y} style={{
                padding: "10px 8px", borderRadius: 6,
                background: color + "1F",
                border: `1px solid ${color}40`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B" }}>{y}</div>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: color,
                  marginTop: 3, lineHeight: 1.2,
                }}>
                  {w?.split(" ").slice(-1)[0] || "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN E — Swing departamentos (que cambiaron de bando)
// ═════════════════════════════════════════════════════════
function ElSwingSection({ year }) {
  const prevYear = {2014: 2010, 2018: 2014, 2022: 2018}[year] || 2018;

  const swings = window.CO_TILES.map((t) => {
    const from = window.EL_DEPT_WINNER[t.dept]?.[prevYear];
    const to = window.EL_DEPT_WINNER[t.dept]?.[year];
    const fromSp = window.EL_SPECTRUM[from];
    const toSp = window.EL_SPECTRUM[to];
    return { dept: t.dept, from, to, fromSp, toSp, changed: from !== to, spectrumChanged: fromSp !== toSp };
  });

  const spectrumChanged = swings.filter((s) => s.spectrumChanged);
  const sameWinner = swings.filter((s) => !s.changed);

  if (year === 2010) {
    return (
      <section style={{ marginBottom: 80, padding: "32px 28px", background: "#FAFBFC", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 14, color: "#515154", fontStyle: "italic" }}>
          2010 es el punto de partida del tracking. Selecciona otro año para ver qué departamentos cambiaron.
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Movimientos territoriales"
        title={`De ${prevYear} a ${year}`}
        dek={`${spectrumChanged.length} departamentos cambiaron de espectro político entre ${prevYear} y ${year}. ${sameWinner.length} votaron por el mismo candidato o coalición.`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#B3261E", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
            ◆ Cambiaron de bando ({spectrumChanged.length})
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {spectrumChanged.map((s) => (
              <div key={s.dept} style={{
                display: "grid", gridTemplateColumns: "1fr 20px 1fr 120px",
                alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8,
              }}>
                <div style={{
                  padding: "4px 8px",
                  background: SPECTRUM_CLR[s.fromSp] + "1F",
                  color: SPECTRUM_CLR[s.fromSp],
                  borderRadius: 4, fontSize: 11, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.04em",
                  textAlign: "center",
                }}>
                  {s.fromSp}
                </div>
                <div style={{ textAlign: "center", color: "#86868B", fontSize: 16 }}>→</div>
                <div style={{
                  padding: "4px 8px",
                  background: SPECTRUM_CLR[s.toSp] + "1F",
                  color: SPECTRUM_CLR[s.toSp],
                  borderRadius: 4, fontSize: 11, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.04em",
                  textAlign: "center",
                }}>
                  {s.toSp}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F", textAlign: "right" }}>
                  {s.dept}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
            ○ Se mantuvieron ({sameWinner.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {sameWinner.map((s) => (
              <span key={s.dept} style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 999,
                background: "#F2F4F7", color: "#515154", fontWeight: 500,
              }}>
                {s.dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN F — Tendencia por espectro
// ═════════════════════════════════════════════════════════
function ElTrendChart() {
  const [metric, setMetric] = React.useState("r1"); // r1 | r2 | abst
  // compute por espectro
  const series = {
    izquierda: [],
    centro: [],
    derecha: [],
  };
  const abstSeries = [];
  EL_YEARS.forEach((y) => {
    const n = window.EL_NATIONAL[y];
    const round = metric === "r2" ? n.r2 : n.r1;
    const totals = { izquierda: 0, centro: 0, derecha: 0 };
    round.forEach((c) => {
      const sp = window.EL_SPECTRUM[c.name];
      if (sp) totals[sp] += c.pct;
    });
    series.izquierda.push({ year: y, val: totals.izquierda });
    series.centro.push({ year: y, val: totals.centro });
    series.derecha.push({ year: y, val: totals.derecha });
    abstSeries.push({ year: y, val: n.abstencion });
  });

  const W = 800, H = 340, pad = 50;
  const points = metric === "abst" ? { abst: abstSeries } : series;
  const maxVal = metric === "abst" ? 70 : 80;
  const xOf = (y) => pad + ((y - 2010) / 12) * (W - 2 * pad);
  const yOf = (v) => H - pad - (v / maxVal) * (H - 2 * pad);

  const colors = metric === "abst"
    ? { abst: "#1D1D1F" }
    : { izquierda: SPECTRUM_CLR.izquierda, centro: SPECTRUM_CLR.centro, derecha: SPECTRUM_CLR.derecha };

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Tendencia"
        title="El péndulo ideológico"
        dek="Suma de porcentajes de los candidatos por espectro en cada elección."
      />

      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "#F2F4F7", borderRadius: 10, width: "fit-content" }}>
        {[
          { k: "r1", l: "Por espectro · 1ra vuelta" },
          { k: "r2", l: "Por espectro · 2da vuelta" },
          { k: "abst", l: "Abstención" },
        ].map((o) => (
          <button
            key={o.k}
            onClick={() => setMetric(o.k)}
            style={{
              fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              padding: "7px 14px", border: 0, borderRadius: 7,
              background: metric === o.k ? "#fff" : "transparent",
              color: metric === o.k ? "#1D1D1F" : "#515154",
              boxShadow: metric === o.k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
          {/* Grid Y */}
          {[0, 20, 40, 60, 80].filter((v) => v <= maxVal).map((v) => (
            <g key={v}>
              <line x1={pad} y1={yOf(v)} x2={W - pad} y2={yOf(v)} stroke="rgba(0,0,0,0.06)" />
              <text x={pad - 10} y={yOf(v) + 4} fontSize="11" fill="#86868B" textAnchor="end">{v}%</text>
            </g>
          ))}
          {/* X labels */}
          {EL_YEARS.map((y) => (
            <g key={y}>
              <text x={xOf(y)} y={H - pad + 22} fontSize="12" fill="#515154" textAnchor="middle" fontWeight="600">{y}</text>
              <line x1={xOf(y)} y1={H - pad} x2={xOf(y)} y2={H - pad + 5} stroke="rgba(0,0,0,0.2)" />
            </g>
          ))}

          {/* Lines */}
          {Object.entries(points).map(([k, pts]) => {
            const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.year)} ${yOf(p.val)}`).join(" ");
            return (
              <g key={k}>
                <path d={d} fill="none" stroke={colors[k]} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p) => (
                  <g key={p.year}>
                    <circle cx={xOf(p.year)} cy={yOf(p.val)} r="5" fill="#fff" stroke={colors[k]} strokeWidth="2.5" />
                    <text x={xOf(p.year)} y={yOf(p.val) - 12} fontSize="11" fontWeight="700" fill={colors[k]} textAnchor="middle">
                      {Math.round(p.val)}%
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {Object.entries(colors).map(([k, c]) => (
            <div key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#515154" }}>
              <span style={{ width: 14, height: 3, background: c, borderRadius: 2 }} />
              <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{k === "abst" ? "Abstención" : k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN G — Top municipios por candidato
// ═════════════════════════════════════════════════════════
function ElTopMunicipios({ year }) {
  const data = window.EL_TOP_MUNIS[year];
  if (!data) return null;
  const names = Object.keys(data);
  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Bastiones"
        title="Dónde arrasaron"
        dek="Los municipios con mayor porcentaje a favor de cada candidato en segunda vuelta."
      />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${names.length}, 1fr)`, gap: 24 }}>
        {names.map((name) => {
          const color = window.EL_COLOR[name];
          return (
            <div key={name} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: `3px solid ${color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Top 5 municipios
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: color, letterSpacing: "-0.015em" }}>
                  {name}
                </div>
              </div>
              <div>
                {data[name].map((m, i) => (
                  <div key={m.muni} style={{
                    display: "grid", gridTemplateColumns: "24px 1fr auto",
                    padding: "12px 22px", borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    alignItems: "center", gap: 10,
                  }}>
                    <div style={{ fontSize: 12, color: "#86868B", fontWeight: 700 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1D1D1F" }}>{m.muni}</div>
                      <div style={{ fontSize: 12, color: "#86868B" }}>{m.dept}</div>
                    </div>
                    <div style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 20, fontWeight: 400, color: color,
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {pct(m.pct)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN H — Abstención por elección
// ═════════════════════════════════════════════════════════
function ElAbstention() {
  const data = EL_YEARS.map((y) => ({
    year: y,
    abst: window.EL_NATIONAL[y].abstencion,
    turn: window.EL_NATIONAL[y].turnout,
  }));
  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="La otra mitad"
        title="La abstención, constante"
        dek="Casi la mitad del censo electoral no vota en ninguna elección presidencial."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {data.map((d) => (
          <div key={d.year} style={{
            background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: `${d.abst}%`,
              background: "repeating-linear-gradient(45deg, rgba(179,38,30,0.05) 0 8px, rgba(179,38,30,0.1) 8px 16px)",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#86868B", letterSpacing: "0.04em" }}>{d.year}</div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 400,
                color: "#B3261E", letterSpacing: "-0.03em", lineHeight: 1, marginTop: 8,
              }}>
                {pct(d.abst, 1)}
              </div>
              <div style={{ fontSize: 13, color: "#515154", marginTop: 6 }}>
                no votó
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: "#86868B" }}>
                Participación: <span style={{ color: "#1D1D1F", fontWeight: 600 }}>{pct(d.turn, 1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN I — Urbano vs rural
// ═════════════════════════════════════════════════════════
function ElUrbanRural({ year }) {
  const d = window.EL_URBAN_RURAL[year];
  if (!d) return null;
  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Dos Colombias"
        title={`Ciudad y campo en ${year}`}
        dek="Porcentaje del ganador en la 2da vuelta, separando municipios urbanos (capitales y principales) de municipios rurales."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { k: "urbano", label: "Urbano", icon: "▲" },
          { k: "rural", label: "Rural", icon: "●" },
        ].map((cat) => {
          const info = d[cat.k];
          const color = window.EL_COLOR[info.winner];
          return (
            <div key={cat.k} style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 28,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "#515154",
                }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Municipios
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.02em" }}>{cat.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#86868B", marginBottom: 6 }}>Ganador</div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, color: color,
                letterSpacing: "-0.02em", marginBottom: 16,
              }}>
                {info.winner}
              </div>
              <div style={{ height: 12, background: "#F2F4F7", borderRadius: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${info.pct}%`,
                  background: color, transition: "width 600ms ease",
                }} />
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#515154" }}>
                Con <strong style={{ color: "#1D1D1F" }}>{pct(info.pct)}</strong> del voto en zona {cat.label.toLowerCase()}.
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// SECCIÓN J — Demografía (edad + género)
// ═════════════════════════════════════════════════════════
function ElDemographics({ year }) {
  const age = window.EL_DEMO_AGE[year];
  const gen = window.EL_DEMO_GENDER[year];
  if (!age || !gen) return null;
  const candNames = Object.keys(Object.values(age)[0]);

  return (
    <section style={{ marginBottom: 80 }}>
      <ElSectionHeader
        kicker="Quién votó por quién"
        title="Perfil demográfico"
        dek="Voto en segunda vuelta por rango de edad y género. Datos aproximados de encuestas de salida."
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Por edad */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>
            Por edad
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {Object.entries(age).map(([bucket, vals]) => {
              const total = Object.values(vals).reduce((a, b) => a + b, 0);
              return (
                <div key={bucket} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", fontVariantNumeric: "tabular-nums" }}>{bucket}</div>
                  <div>
                    <div style={{ display: "flex", height: 26, borderRadius: 4, overflow: "hidden", background: "#F2F4F7" }}>
                      {candNames.map((n) => {
                        const w = (vals[n] / total) * 100;
                        return (
                          <div key={n} style={{
                            width: `${w}%`, background: window.EL_COLOR[n],
                            color: "#fff", fontSize: 12, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "width 500ms ease",
                          }}>
                            {w > 14 ? `${vals[n]}%` : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            {candNames.map((n) => (
              <div key={n} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: window.EL_COLOR[n] }} />
                <span style={{ color: "#515154" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por género */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>
            Por género
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            {Object.entries(gen).map(([g, vals]) => (
              <div key={g}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>{g}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {candNames.map((n) => (
                    <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 40px", gap: 8, alignItems: "center" }}>
                      <div style={{ height: 8, background: "#F2F4F7", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${vals[n]}%`,
                          background: window.EL_COLOR[n],
                          transition: "width 500ms ease",
                        }} />
                      </div>
                      <div style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: "#515154", textAlign: "right" }}>
                        {vals[n]}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════
// Helper: section header editorial
// ═════════════════════════════════════════════════════════
function ElSectionHeader({ kicker, title, dek }) {
  return (
    <div style={{ marginBottom: 28, maxWidth: 820 }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#B3261E",
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
      }}>
        {kicker}
      </div>
      <h2 style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em",
        color: "#1D1D1F", margin: "0 0 10px", lineHeight: 1.1,
      }}>
        {title}
      </h2>
      {dek && (
        <p style={{ margin: 0, fontSize: 17, color: "#515154", lineHeight: 1.5, maxWidth: 720 }}>
          {dek}
        </p>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═════════════════════════════════════════════════════════
function HistorialPage() {
  const [year, setYear] = React.useState(2022);
  const [compareMode, setCompareMode] = React.useState(false);

  return (
    <main style={{
      maxWidth: 1200, margin: "0 auto", padding: "56px 32px 120px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
    }}>
      <ElHero year={year} setYear={setYear} />

      <ElRoundBars year={year} />

      {/* Mapa con toggle comparar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -8 }}>
        <button
          onClick={() => setCompareMode(!compareMode)}
          style={{
            fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
            padding: "8px 16px", borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.15)",
            background: compareMode ? "#1D1D1F" : "#fff",
            color: compareMode ? "#fff" : "#1D1D1F",
          }}
        >
          {compareMode ? "↤ Vista única" : "⇄ Comparar dos años"}
        </button>
      </div>

      <ElMapSection year={year} compareMode={compareMode} />

      <ElSwingSection year={year} />

      <ElTopMunicipios year={year} />

      <ElTrendChart />

      <ElAbstention />

      <ElUrbanRural year={year} />

      <ElDemographics year={year} />

      <footer style={{
        marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.12)",
        fontSize: 13, color: "#86868B", lineHeight: 1.6,
      }}>
        <strong style={{ color: "#515154" }}>Metodología.</strong> Los resultados nacionales y departamentales
        provienen de consolidados oficiales de la Registraduría Nacional del Estado Civil para 2010, 2014,
        2018 y 2022. Los porcentajes son aproximados con fines editoriales. Las encuestas de salida por edad
        y género son aproximaciones de los reportes de Invamer y Datexco. Los datos municipales listados se
        restringen a las cinco localidades con mayor porcentaje relativo para cada candidato.
      </footer>
    </main>
  );
}

Object.assign(window, { HistorialPage });
