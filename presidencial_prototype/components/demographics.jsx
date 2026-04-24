// ─────────────────────────────────────────────────────────
// Demografía — gráficos de género y espectro en la elección 2026
// con comparación contra las últimas 4 elecciones colombianas.
// ─────────────────────────────────────────────────────────

function countGenders(list, key = "gender") {
  return list.reduce(
    (acc, c) => {
      if (c[key] === "F") acc.F += 1;
      else if (c[key] === "M") acc.M += 1;
      return acc;
    },
    { F: 0, M: 0 }
  );
}

function countSpectrum(list) {
  return list.reduce(
    (acc, c) => {
      acc[c.spectrum] = (acc[c.spectrum] || 0) + 1;
      return acc;
    },
    { izquierda: 0, centro: 0, derecha: 0 }
  );
}

// Conteo cruzado: género x espectro
function crossGenderSpectrum(list, key = "gender") {
  const res = {
    izquierda: { F: 0, M: 0 },
    centro: { F: 0, M: 0 },
    derecha: { F: 0, M: 0 },
  };
  list.forEach((c) => {
    if (!res[c.spectrum]) return;
    if (c[key] === "F") res[c.spectrum].F += 1;
    else if (c[key] === "M") res[c.spectrum].M += 1;
  });
  return res;
}

const SPECTRUM_COLOR = {
  izquierda: "#B3261E",
  centro: "#2F6B8A",
  derecha: "#1E40AF",
};

const GENDER_COLOR = {
  F: "#B5649C", // magenta suave
  M: "#2F6B8A", // azul
};

// ── Barra apilada horizontal (F vs M) ─────────────────
function GenderBar({ F, M, showLabels = true, height = 14 }) {
  const total = F + M || 1;
  const fPct = (F / total) * 100;
  const mPct = (M / total) * 100;
  return (
    <div>
      <div style={{ display: "flex", height, borderRadius: 999, overflow: "hidden", background: "#F2F4F7" }}>
        <div style={{ width: `${fPct}%`, background: GENDER_COLOR.F, transition: "width 500ms ease" }} />
        <div style={{ width: `${mPct}%`, background: GENDER_COLOR.M, transition: "width 500ms ease" }} />
      </div>
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 13, color: "var(--ink-2)" }}>
          <span>
            <span style={{ color: GENDER_COLOR.F, fontWeight: 600 }}>{F} mujeres</span>
            {" · "}
            {Math.round(fPct)}%
          </span>
          <span>
            <span style={{ color: GENDER_COLOR.M, fontWeight: 600 }}>{M} hombres</span>
            {" · "}
            {Math.round(mPct)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ── Card con números grandes ─────────────────────────
function StatCard({ label, big, sub, color }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16,
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{ fontSize: 38, fontWeight: 600, color: color || "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {big}
      </div>
      {sub && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Matriz género x espectro (3 cols x 2 filas) ─────
function GenderSpectrumMatrix({ data, total }) {
  const rows = [
    { key: "F", label: "Mujeres", color: GENDER_COLOR.F },
    { key: "M", label: "Hombres", color: GENDER_COLOR.M },
  ];
  const cols = [
    { key: "izquierda", label: "Izquierda" },
    { key: "centro", label: "Centro" },
    { key: "derecha", label: "Derecha" },
  ];
  // max para dimensionar círculos
  let max = 0;
  rows.forEach((r) => cols.forEach((c) => { max = Math.max(max, data[c.key][r.key]); }));
  max = max || 1;

  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: 22,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(90px, auto) 1fr 1fr 1fr", gap: 12 }}>
        {/* cabecera */}
        <div />
        {cols.map((c) => (
          <div key={c.key} style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: SPECTRUM_COLOR[c.key], letterSpacing: "-0.01em" }}>
            {c.label}
          </div>
        ))}
        {/* filas */}
        {rows.map((r) => (
          <React.Fragment key={r.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
              {r.label}
            </div>
            {cols.map((c) => {
              const n = data[c.key][r.key];
              const size = 28 + (n / max) * 38; // 28–66px
              return (
                <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 70 }}>
                  <div
                    title={`${n} ${r.label.toLowerCase()} en ${c.label}`}
                    style={{
                      width: size, height: size, borderRadius: "50%",
                      background: n === 0 ? "transparent" : `${r.color}26`,
                      border: n === 0 ? "1px dashed rgba(0,0,0,0.15)" : `1.5px solid ${r.color}`,
                      color: n === 0 ? "var(--ink-3)" : r.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 16,
                      transition: "all 500ms cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    {n}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: 13, color: "var(--ink-3)" }}>
        El tamaño de cada círculo es proporcional al número de candidatos en esa casilla. Total: {total}.
      </div>
    </div>
  );
}

// ── Tabla comparativa con elecciones pasadas ─────────
function HistoricComparison({ focus = "candidato" }) {
  const elections = [...window.HISTORIC_ELECTIONS];
  const currentList = window.CURRENT_ELECTION.candidates;
  const all = [
    ...elections.map((e) => ({ year: e.year, list: e.candidates })),
    { year: 2026, list: currentList, current: true },
  ];

  const key = focus === "vice" ? "viceGender" : "gender";
  const rows = all.map((e) => {
    const g = countGenders(e.list, key);
    const s = countSpectrum(e.list);
    const total = g.F + g.M;
    return { ...e, g, s, total };
  });

  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, overflow: "hidden",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "80px minmax(280px, 1.4fr) minmax(200px, 1fr) 90px",
        padding: "14px 22px", background: "#FAFBFC", borderBottom: "1px solid rgba(0,0,0,0.06)",
        fontSize: 12, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em",
      }}>
        <div>Año</div>
        <div>Género {focus === "vice" ? "(fórmula vice)" : "(candidato/a)"}</div>
        <div>Espectro</div>
        <div style={{ textAlign: "right" }}>Total</div>
      </div>

      {rows.map((r) => {
        const spectrumTotal = r.s.izquierda + r.s.centro + r.s.derecha || 1;
        return (
          <div key={r.year} style={{
            display: "grid",
            gridTemplateColumns: "80px minmax(280px, 1.4fr) minmax(200px, 1fr) 90px",
            padding: "18px 22px", borderBottom: "1px solid rgba(0,0,0,0.06)",
            alignItems: "center", gap: 18,
            background: r.current ? "rgba(47,107,138,0.04)" : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{r.year}</span>
              {r.current && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--brand)", background: "rgba(47,107,138,0.12)", padding: "2px 6px", borderRadius: 6, letterSpacing: "0.04em" }}>HOY</span>
              )}
            </div>

            <div>
              <GenderBar F={r.g.F} M={r.g.M} height={12} showLabels={false} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "var(--ink-2)" }}>
                <span>
                  <span style={{ color: GENDER_COLOR.F, fontWeight: 600 }}>{r.g.F}F</span>
                  {" "}·{" "}
                  <span style={{ color: GENDER_COLOR.M, fontWeight: 600 }}>{r.g.M}M</span>
                </span>
                <span>{Math.round((r.g.F / (r.total || 1)) * 100)}% mujeres</span>
              </div>
            </div>

            {/* Espectro: barra horizontal apilada de 3 colores */}
            <div>
              <div style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden", background: "#F2F4F7" }}>
                {["izquierda", "centro", "derecha"].map((k) => (
                  <div key={k} style={{
                    width: `${(r.s[k] / spectrumTotal) * 100}%`,
                    background: SPECTRUM_COLOR[k], transition: "width 500ms ease",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 12, color: "var(--ink-2)" }}>
                <span><span style={{ color: SPECTRUM_COLOR.izquierda, fontWeight: 600 }}>{r.s.izquierda}</span> izq</span>
                <span><span style={{ color: SPECTRUM_COLOR.centro, fontWeight: 600 }}>{r.s.centro}</span> centro</span>
                <span><span style={{ color: SPECTRUM_COLOR.derecha, fontWeight: 600 }}>{r.s.derecha}</span> der</span>
              </div>
            </div>

            <div style={{ textAlign: "right", fontSize: 22, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              {r.total}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Panel principal ───────────────────────────────────
function DemographicsPanel() {
  const [tab, setTab] = React.useState("hoy"); // "hoy" | "historico"
  const [focus, setFocus] = React.useState("candidato"); // "candidato" | "vice"

  const list = window.ALL_CANDIDATES;
  const key = focus === "vice" ? "viceGender" : "gender";
  const genders = countGenders(list, key);
  const spectrum = countSpectrum(list);
  const matrix = crossGenderSpectrum(list, key);

  const total = genders.F + genders.M;
  const femalePct = Math.round((genders.F / total) * 100);

  // Serie histórica de % mujeres para el spark-like
  const historicSeries = [
    ...window.HISTORIC_ELECTIONS.map((e) => {
      const g = countGenders(e.candidates, key);
      const t = g.F + g.M;
      return { year: e.year, pct: t ? (g.F / t) * 100 : 0 };
    }),
    { year: 2026, pct: femalePct, current: true },
  ];
  const maxPct = Math.max(...historicSeries.map((p) => p.pct), 30);

  return (
    <section
      aria-label="Demografía de la elección 2026"
      style={{
        background: "linear-gradient(180deg, #F5F7FA 0%, #FBFBFD 100%)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 28,
        padding: 28,
        marginBottom: 48,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "var(--brand)",
            background: "rgba(47,107,138,0.1)", padding: "5px 11px", borderRadius: 999,
            letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10,
          }}>
            ◆ Radiografía 2026
          </div>
          <h3 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            ¿Quiénes están en la contienda?
          </h3>
          <p style={{ margin: "8px 0 0", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.45 }}>
            Composición de género y espectro político entre los {total} candidatos y sus fórmulas vicepresidenciales.
          </p>
        </div>

        {/* Tabs: Hoy / Comparación histórica */}
        <div style={{
          display: "inline-flex", gap: 4, padding: 4,
          background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)",
        }}>
          {[
            { k: "hoy", l: "Esta elección" },
            { k: "historico", l: "vs. últimas 4" },
          ].map((o) => (
            <button
              key={o.k}
              onClick={() => setTab(o.k)}
              style={{
                fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer",
                padding: "8px 14px", borderRadius: 8, border: 0,
                background: tab === o.k ? "var(--brand)" : "transparent",
                color: tab === o.k ? "#fff" : "var(--ink-2)",
                transition: "all 160ms ease",
              }}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Selector candidato/vice */}
      <div style={{
        display: "inline-flex", gap: 4, padding: 3,
        background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)",
        marginBottom: 22, fontSize: 13,
      }}>
        {[
          { k: "candidato", l: "Candidato/a" },
          { k: "vice", l: "Vicepresidente/a" },
        ].map((o) => (
          <button
            key={o.k}
            onClick={() => setFocus(o.k)}
            style={{
              fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer",
              padding: "6px 12px", borderRadius: 7, border: 0,
              background: focus === o.k ? "#F2F4F7" : "transparent",
              color: focus === o.k ? "var(--ink)" : "var(--ink-3)",
              transition: "all 140ms ease",
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      {tab === "hoy" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
          <StatCard label="Total en contienda" big={total} sub={`${list.length} fórmulas inscritas`} />
          <StatCard label={`Mujeres ${focus === "vice" ? "como vice" : ""}`} big={`${genders.F}`} sub={`${femalePct}% del total`} color={GENDER_COLOR.F} />
          <StatCard label={`Hombres ${focus === "vice" ? "como vice" : ""}`} big={`${genders.M}`} sub={`${100 - femalePct}% del total`} color={GENDER_COLOR.M} />
          <StatCard label="Espectro con más candidatas" big={
            ["izquierda","centro","derecha"].reduce((best, k) => matrix[k].F > matrix[best].F ? k : best, "izquierda")
              .replace(/^./, (s) => s.toUpperCase())
          } sub={
            (() => {
              const best = ["izquierda","centro","derecha"].reduce((b, k) => matrix[k].F > matrix[b].F ? k : b, "izquierda");
              return `${matrix[best].F} mujeres en ${best}`;
            })()
          } color={SPECTRUM_COLOR[
            ["izquierda","centro","derecha"].reduce((b, k) => matrix[k].F > matrix[b].F ? k : b, "izquierda")
          ]} />
        </div>
      )}

      {tab === "hoy" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, alignItems: "stretch" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
              Género general
            </div>
            <GenderBar F={genders.F} M={genders.M} height={18} />

            <div style={{ marginTop: 22, fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
              Distribución por espectro
            </div>
            {["izquierda", "centro", "derecha"].map((k) => {
              const n = spectrum[k];
              const pct = (n / (total || 1)) * 100;
              return (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: SPECTRUM_COLOR[k], textTransform: "capitalize" }}>{k}</span>
                    <span style={{ color: "var(--ink-2)" }}>{n} · {Math.round(pct)}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "#F2F4F7", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: SPECTRUM_COLOR[k], transition: "width 500ms ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <GenderSpectrumMatrix data={matrix} total={total} />
        </div>
      )}

      {tab === "historico" && (
        <div style={{ display: "grid", gap: 18 }}>
          {/* Spark */}
          <div style={{
            background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: 22,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  % de mujeres {focus === "vice" ? "como vicepresidente/a" : "candidatas"}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
                  Elecciones presidenciales, primera vuelta · Colombia
                </div>
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-2)" }}>
                2010 → 2026
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 180, borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 8 }}>
              {historicSeries.map((p) => {
                const h = (p.pct / maxPct) * 150;
                return (
                  <div key={p.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: p.current ? "var(--brand)" : "var(--ink)" }}>
                      {Math.round(p.pct)}%
                    </div>
                    <div style={{
                      width: 44, height: h,
                      background: p.current ? "var(--brand)" : GENDER_COLOR.F,
                      borderRadius: "10px 10px 0 0",
                      transition: "height 600ms cubic-bezier(0.2,0.8,0.2,1)",
                      boxShadow: p.current ? "0 0 0 3px rgba(47,107,138,0.2)" : "none",
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
              {historicSeries.map((p) => (
                <div key={p.year} style={{ flex: 1, textAlign: "center", fontSize: 13, color: p.current ? "var(--brand)" : "var(--ink-2)", fontWeight: p.current ? 600 : 500 }}>
                  {p.year}
                </div>
              ))}
            </div>
          </div>

          <HistoricComparison focus={focus} />

          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
            Fuentes: Registraduría Nacional del Estado Civil (2010, 2014, 2018, 2022). La muestra incluye los candidatos inscritos en primera vuelta presidencial.
          </p>
        </div>
      )}
    </section>
  );
}

Object.assign(window, { DemographicsPanel });
