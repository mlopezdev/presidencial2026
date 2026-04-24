// ─────────────────────────────────────────────────────────
// Trayectorias por candidato (fabricadas, consistentes)
// ─────────────────────────────────────────────────────────
window.TIMELINES = {
  "Iván Cepeda": [
    { y: "1994", t: "Cofundador de MOVICE", d: "Movimiento Nacional de Víctimas de Crímenes de Estado." },
    { y: "2010", t: "Elegido Representante a la Cámara", d: "Por Bogotá, bancada del Polo Democrático." },
    { y: "2014", t: "Senador de la República", d: "Inicia su trabajo por memoria histórica y paz." },
    { y: "2016", t: "Acuerdo de Paz de La Habana", d: "Participa activamente en el proceso." },
    { y: "2025", t: "Candidato presidencial", d: "Anuncia su precandidatura por el Pacto Histórico." },
  ],
  "Abelardo de la Espriella": [
    { y: "1990", t: "Abogado penalista", d: "Inicia ejercicio profesional en Córdoba." },
    { y: "2005", t: "Firma de abogados de alto perfil", d: "Reconocimiento mediático nacional." },
    { y: "2020", t: "Figura pública polarizante", d: "Comentarista político frecuente." },
    { y: "2024", t: "Movimiento Defensores de la Patria", d: "Lanza su plataforma política." },
    { y: "2025", t: "Candidato presidencial", d: "Oficializa campaña." },
  ],
  "Paloma Valencia": [
    { y: "2002", t: "Abogada constitucionalista", d: "Ejercicio profesional y academia." },
    { y: "2014", t: "Senadora por Centro Democrático", d: "Primera curul en el Congreso." },
    { y: "2018", t: "Reelegida al Senado", d: "Liderazgo en comisiones clave." },
    { y: "2024", t: "Precandidata presidencial", d: "Anuncia aspiración." },
    { y: "2025", t: "Candidata oficial", d: "Campaña por el Centro Democrático." },
  ],
  "Claudia López": [
    { y: "2006", t: "Columnista y analista política", d: "Reconocida por trabajo anticorrupción." },
    { y: "2014", t: "Senadora por la Alianza Verde", d: "Primera curul en el Senado." },
    { y: "2019", t: "Alcaldesa de Bogotá", d: "Primera mujer electa alcaldesa de la capital." },
    { y: "2023", t: "Finaliza alcaldía", d: "Entrega mandato y anuncia proyecto nacional." },
    { y: "2025", t: "Candidata presidencial", d: "Con Claudia Imparables." },
  ],
  "Roy Barreras": [
    { y: "2002", t: "Representante a la Cámara", d: "Inicia carrera legislativa por el Valle." },
    { y: "2010", t: "Senador de la República", d: "Varios periodos consecutivos." },
    { y: "2016", t: "Negociador del Acuerdo de Paz", d: "Participa en el proceso de La Habana." },
    { y: "2022", t: "Presidente del Congreso", d: "Lidera el Senado en la coalición de gobierno." },
    { y: "2025", t: "Candidato presidencial", d: "Lanza La Fuerza de la Paz." },
  ],
};
window.DEFAULT_TIMELINE = [
  { y: "2005", t: "Carrera profesional", d: "Formación académica y primera actividad pública." },
  { y: "2014", t: "Ingreso a la vida política", d: "Primer cargo electo o de relevancia." },
  { y: "2020", t: "Consolidación", d: "Mayor visibilidad y proyección nacional." },
  { y: "2024", t: "Precandidatura", d: "Anuncio de aspiración presidencial." },
  { y: "2025", t: "Candidatura oficial", d: "Campaña en marcha." },
];

// ─────────────────────────────────────────────────────────
// PASO 3 — Perfil estilo red social con pestañas
// ─────────────────────────────────────────────────────────
function ProfileStep({ candidate, onBack, onPickOther }) {
  const [active, setActive] = React.useState("resumen");
  const tabs = [
    { key: "resumen", label: "Resumen" },
    { key: "trayectoria", label: "Trayectoria" },
    { key: "propuestas", label: "Propuestas" },
    { key: "posiciones", label: "Posiciones" },
    { key: "similitudes", label: "Similitudes" },
    { key: "plan", label: "Plan y DOFA" },
  ];

  const stats = [
    { k: "Propuestas", v: computeProposalCount(candidate) },
    { k: "Ejes cubiertos", v: computeAxesCount(candidate) },
    { k: "Espectro", v: capitalize(candidate.spectrum) },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <StepDots current={3} total={3} />
      </div>

      <article style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
        {/* Cover band */}
        <div
          style={{
            height: 140,
            background: `linear-gradient(135deg, ${candidate.color} 0%, ${candidate.color}88 100%)`,
            position: "relative",
          }}
        >
          <button
            onClick={onBack}
            aria-label="Volver"
            style={{
              position: "absolute", top: 16, left: 16,
              width: 40, height: 40, borderRadius: 20, border: 0,
              background: "rgba(255,255,255,0.95)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--ink)", backdropFilter: "blur(10px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
          >
            <Chevron dir="left" />
          </button>
          <div style={{ position: "absolute", right: 20, top: 16, display: "flex", gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)", letterSpacing: "-0.005em",
            }}>
              {candidate.party}
            </span>
          </div>
        </div>

        {/* Header overlap */}
        <div style={{ padding: "0 32px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -52 }}>
          <div style={{ boxShadow: "0 0 0 5px #fff", borderRadius: "50%" }}>
            <Avatar name={candidate.name} color={candidate.color} size={112} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1 }}>
              {candidate.name}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 17, color: "var(--ink-2)" }}>
              Fórmula vicepresidencial: <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{candidate.vice}</strong>
            </p>
          </div>
          <div style={{ paddingBottom: 12, display: "flex", gap: 8 }}>
            <Button variant="secondary" style={{ padding: "10px 18px", fontSize: 15 }}>Guardar</Button>
            <Button variant="primary" style={{ padding: "10px 18px", fontSize: 15 }}>Seguir</Button>
          </div>
        </div>

        {/* Bio + stats */}
        <div style={{ padding: "20px 32px 4px" }}>
          <p style={{ margin: 0, fontSize: 17, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 720 }}>
            {candidate.lede}
          </p>
          <div style={{ display: "flex", gap: 28, marginTop: 18, paddingBottom: 4 }}>
            {stats.map((s) => (
              <div key={s.k} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>{s.v}</span>
                <span style={{ fontSize: 15, color: "var(--ink-3)" }}>{s.k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar estilo Twitter */}
        <nav aria-label="Secciones" style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(0,0,0,0.08)", marginTop: 12, padding: "0 16px", overflowX: "auto" }}>
          {tabs.map((s) => {
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                style={{
                  fontFamily: "inherit", fontSize: 16, fontWeight: isActive ? 600 : 500,
                  padding: "16px 18px", border: 0, cursor: "pointer", background: "transparent",
                  color: isActive ? "var(--ink)" : "var(--ink-2)", whiteSpace: "nowrap",
                  position: "relative", transition: "color 160ms ease",
                }}
              >
                {s.label}
                {isActive && (
                  <span style={{
                    position: "absolute", left: 12, right: 12, bottom: -1, height: 3,
                    background: "var(--brand)", borderRadius: 999,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "32px 36px" }}>
          <ProfileContent section={active} candidate={candidate} onPickOther={onPickOther} />
        </div>
      </article>
    </div>
  );
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ""; }
function computeProposalCount(c) {
  const d = window.COMPARE_DATA[c.name];
  if (!d) return "—";
  return Object.values(d).reduce((a, arr) => a + arr.length, 0);
}
function computeAxesCount(c) {
  const d = window.COMPARE_DATA[c.name];
  if (!d) return "—";
  return Object.values(d).filter((arr) => arr.length > 0).length + "/4";
}

// ─────────────────────────────────────────────────────────
// Contenido por pestaña
// ─────────────────────────────────────────────────────────
function ProfileContent({ section, candidate, onPickOther }) {
  const compare = window.COMPARE_DATA[candidate.name];

  if (section === "resumen") {
    return <SectionResumen candidate={candidate} />;
  }
  if (section === "trayectoria") {
    return <SectionTrayectoria candidate={candidate} />;
  }
  if (section === "propuestas") {
    return <SectionPropuestas candidate={candidate} compare={compare} />;
  }
  if (section === "posiciones") {
    return <SectionPosiciones candidate={candidate} compare={compare} />;
  }
  if (section === "similitudes") {
    return <SectionSimilitudes candidate={candidate} onPickOther={onPickOther} />;
  }
  if (section === "plan") {
    return <SectionPlan candidate={candidate} />;
  }
  return null;
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)" }}>{title}</h3>
      {sub && <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--ink-3)", lineHeight: 1.45 }}>{sub}</p>}
    </div>
  );
}

function SectionResumen({ candidate }) {
  return (
    <div style={{ maxWidth: 760 }}>
      <SectionTitle title="Resumen" sub="Una mirada rápida al candidato y su mensaje." />
      <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: "var(--ink-2)" }}>
        {candidate.lede} Este perfil reúne su trayectoria, propuestas por eje, posiciones frente a temas
        importantes y similitudes con otros candidatos para ayudarte a decidir.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginTop: 28 }}>
        {[
          { k: "Partido", v: candidate.party },
          { k: "Fórmula vice", v: candidate.vice },
          { k: "Espectro", v: capitalize(candidate.spectrum) },
          { k: "Mensaje central", v: candidate.lede },
        ].map((r) => (
          <div key={r.k} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{r.k}</div>
            <div style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.4 }}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTrayectoria({ candidate }) {
  const items = window.TIMELINES[candidate.name] || window.DEFAULT_TIMELINE;
  return (
    <div style={{ maxWidth: 760 }}>
      <SectionTitle title="Trayectoria" sub="Línea de tiempo de la carrera pública del candidato." />
      <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
        {/* línea vertical */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 14,
            top: 10,
            bottom: 10,
            width: 2,
            background: "linear-gradient(to bottom, rgba(47,107,138,0.35), rgba(47,107,138,0.08))",
          }}
        />
        {items.map((h, i) => (
          <li key={h.y + i} style={{ position: "relative", display: "flex", gap: 20, paddingLeft: 44, marginBottom: i === items.length - 1 ? 0 : 28 }}>
            {/* nodo */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 8,
                top: 4,
                width: 14, height: 14, borderRadius: "50%",
                background: "#fff",
                border: `3px solid ${candidate.color}`,
                boxShadow: "0 0 0 3px rgba(255,255,255,1)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: candidate.color, letterSpacing: "-0.01em" }}>
                  {h.y}
                </span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>
                  {h.t}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{h.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SectionPropuestas({ candidate, compare }) {
  if (!compare) {
    return (
      <div>
        <SectionTitle title="Propuestas clave" />
        <p style={{ fontSize: 18, color: "var(--ink-2)" }}>Contenido en construcción.</p>
      </div>
    );
  }
  return (
    <div>
      <SectionTitle title="Propuestas clave" sub="Organizadas por eje temático." />
      <div style={{ display: "grid", gap: 24 }}>
        {window.AXES.map((a) => {
          const items = compare[a.key] || [];
          if (items.length === 0) return null;
          return (
            <div key={a.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 6, height: 22, borderRadius: 3, background: candidate.color }} />
                <h4 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                  {a.key}
                </h4>
                <span style={{ fontSize: 14, color: "var(--ink-3)", marginLeft: 2 }}>{items.length} propuestas</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                {items.map((p) => (
                  <div key={p.title} style={{ background: "#F7F8FA", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                      {p.title}
                    </div>
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

function SectionPosiciones({ candidate, compare }) {
  return (
    <div>
      <SectionTitle title="Posiciones" sub="Postura del candidato frente a los cuatro ejes principales." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {window.AXES.map((a) => {
          const items = compare && compare[a.key];
          const summary = items && items[0] ? items[0].desc : a.desc;
          return (
            <div key={a.key} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22, border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: candidate.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Eje
                </span>
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                {a.key}
              </h4>
              <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5 }}>{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionSimilitudes({ candidate, onPickOther }) {
  const others = window.ALL_CANDIDATES.filter((c) => c.name !== candidate.name && window.COMPARE_DATA[c.name]);
  const scored = others.map((o) => {
    const sameSpectrum = o.spectrum === candidate.spectrum ? 1 : 0;
    const axesShared = window.AXES.filter((a) => {
      const A = (window.COMPARE_DATA[candidate.name] || {})[a.key] || [];
      const B = (window.COMPARE_DATA[o.name] || {})[a.key] || [];
      return A.length > 0 && B.length > 0;
    }).length;
    const score = Math.round((sameSpectrum * 45) + (axesShared / 4) * 55);
    const shared = window.AXES.filter((a) => {
      const A = (window.COMPARE_DATA[candidate.name] || {})[a.key] || [];
      const B = (window.COMPARE_DATA[o.name] || {})[a.key] || [];
      return A.length > 0 && B.length > 0;
    }).map((a) => a.key);
    return { o, score, shared };
  }).sort((a, b) => b.score - a.score).slice(0, 4);

  return (
    <div>
      <SectionTitle title="Similitudes con otros candidatos" sub="Afinidad estimada por espectro y ejes con propuestas desarrolladas." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {scored.map(({ o, score, shared }) => (
          <button
            key={o.name}
            onClick={() => onPickOther && onPickOther(o)}
            style={{
              fontFamily: "inherit", textAlign: "left",
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 16, padding: 18, cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 12,
              transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px -14px rgba(13,30,45,0.16)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={o.name} color={o.color} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{o.name}</div>
                <div style={{ fontSize: 14, color: "var(--ink-3)" }}>{o.party}</div>
              </div>
            </div>
            {/* Barra de afinidad */}
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
                <span key={k} style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-2)", background: "#F2F4F7", padding: "4px 10px", borderRadius: 999 }}>
                  {k}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionPlan({ candidate }) {
  return (
    <div style={{ maxWidth: 760 }}>
      <SectionTitle title="Plan de gobierno y DOFA" sub="Documentos oficiales y análisis estratégico del candidato." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { t: "Plan de gobierno", d: "Documento programático completo del candidato.", cta: "Abrir documento" },
          { t: "Análisis DOFA", d: "Debilidades, oportunidades, fortalezas y amenazas.", cta: "Ver análisis" },
        ].map((c) => (
          <div key={c.t} style={{ background: "#F7F8FA", borderRadius: 16, padding: 22, border: "1px solid rgba(0,0,0,0.04)" }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{c.t}</h4>
            <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.d}</p>
            <Button variant="secondary" style={{ padding: "10px 16px", fontSize: 15 }}>{c.cta}</Button>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Este bloque conectará con los documentos oficiales de {candidate.name} cuando estén disponibles públicamente.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Página contenedora
// ─────────────────────────────────────────────────────────
function CandidatosPage({ preselected, clearPreselected }) {
  const [spectrum, setSpectrum] = React.useState(preselected ? preselected.spectrum : null);
  const [picked, setPicked] = React.useState(preselected || null);

  React.useEffect(() => {
    if (preselected) {
      setSpectrum(preselected.spectrum);
      setPicked(preselected);
      clearPreselected && clearPreselected();
    }
  }, [preselected]);

  const switchTo = (other) => {
    setSpectrum(other.spectrum);
    setPicked(other);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 96px" }}>
      {!spectrum && <SpectrumStep onPick={setSpectrum} />}
      {spectrum && !picked && (
        <CandidateListStep
          spectrum={spectrum}
          onBack={() => setSpectrum(null)}
          onPick={setPicked}
        />
      )}
      {spectrum && picked && (
        <ProfileStep
          candidate={picked}
          onBack={() => setPicked(null)}
          onPickOther={switchTo}
        />
      )}
    </main>
  );
}

Object.assign(window, { ProfileStep, ProfileContent, CandidatosPage });
