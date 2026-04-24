// ─────────────────────────────────────────────────────────
// PASO 1 — Selección de espectro
// ─────────────────────────────────────────────────────────
function SpectrumStep({ onPick }) {
  const spectrums = [
    {
      key: "izquierda",
      label: "Izquierda",
      tagline: "Reformas sociales y paz",
      desc: "Fortalecer el Estado social, redistribución, diálogo y derechos.",
      accent: "#B3261E",
      position: 0.12,
    },
    {
      key: "centro",
      label: "Centro",
      tagline: "Equilibrio y moderación",
      desc: "Pragmatismo, instituciones fuertes y consensos amplios.",
      accent: "#2F6B8A",
      position: 0.5,
    },
    {
      key: "derecha",
      label: "Derecha",
      tagline: "Mercado y seguridad firme",
      desc: "Libertad económica, mano dura, reducción del aparato estatal.",
      accent: "#1E40AF",
      position: 0.88,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 40, maxWidth: 720 }}>
        <StepDots current={1} total={3} />
        <h2 style={{ margin: "24px 0 10px", fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05 }}>
          ¿Dónde te identificas?
        </h2>
        <p style={{ margin: 0, fontSize: 20, color: "var(--ink-2)", lineHeight: 1.45 }}>
          Empieza escogiendo el espectro político que mejor te representa. Es solo un punto de partida — podrás explorar todo.
        </p>
      </div>

      {/* Barra visual del espectro */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, #B3261E 0%, #2F6B8A 50%, #1E40AF 100%)",
          opacity: 0.18,
          margin: "0 12px 44px",
        }}
      >
        {spectrums.map((s) => (
          <span
            key={s.key}
            style={{
              position: "absolute",
              left: `${s.position * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: s.accent,
              boxShadow: "0 0 0 4px #FBFBFD",
            }}
          />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {spectrums.map((s) => {
          const candidatesOfSpectrum = window.ALL_CANDIDATES.filter((c) => c.spectrum === s.key);
          const preview = candidatesOfSpectrum.slice(0, 4);
          return (
            <button
              key={s.key}
              onClick={() => onPick(s.key)}
              style={{
                fontFamily: "inherit",
                textAlign: "left",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 24,
                padding: 0,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 20px 48px -24px rgba(13,30,45,0.22)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
              }}
            >
              {/* Cover */}
              <div
                style={{
                  height: 88,
                  background: `linear-gradient(135deg, ${s.accent}26 0%, ${s.accent}08 100%)`,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 24px",
                }}
              >
                <span
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: s.accent, boxShadow: `0 0 0 4px ${s.accent}14`,
                  }}
                />
                <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: s.accent, letterSpacing: "-0.01em" }}>
                  {s.tagline}
                </span>
              </div>

              <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.label}
                </h3>
                <p style={{ margin: 0, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5, flex: 1 }}>
                  {s.desc}
                </p>

                {/* Preview de avatares */}
                <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                  <div style={{ display: "flex" }}>
                    {preview.map((c, i) => (
                      <div
                        key={c.name}
                        style={{
                          marginLeft: i === 0 ? 0 : -10,
                          boxShadow: "0 0 0 3px #fff",
                          borderRadius: "50%",
                          zIndex: preview.length - i,
                        }}
                      >
                        <Avatar name={c.name} color={c.color} size={34} />
                      </div>
                    ))}
                  </div>
                  {candidatesOfSpectrum.length > preview.length && (
                    <span style={{ marginLeft: 10, fontSize: 14, fontWeight: 500, color: "var(--ink-3)" }}>
                      +{candidatesOfSpectrum.length - preview.length}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-3)" }}>
                    {candidatesOfSpectrum.length} candidatos
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: s.accent, display: "flex", alignItems: "center", gap: 6 }}>
                    Explorar <Chevron dir="right" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ marginTop: 32, marginBottom: 48, fontSize: 15, color: "var(--ink-3)", textAlign: "center" }}>
        ¿No estás seguro? Puedes revisar los tres y comparar.
      </p>

      {/* Radiografía demográfica de la contienda */}
      <DemographicsPanel />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PASO 2 — Lista de candidatos del espectro
// ─────────────────────────────────────────────────────────
function CandidateListStep({ spectrum, onBack, onPick }) {
  const list = window.ALL_CANDIDATES.filter((c) => c.spectrum === spectrum);
  const label = { izquierda: "Izquierda", centro: "Centro", derecha: "Derecha" }[spectrum];
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <StepDots current={2} total={3} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, marginBottom: 10 }}>
          <button
            onClick={onBack}
            aria-label="Volver"
            style={{
              width: 44, height: 44, borderRadius: 22, border: "1px solid rgba(0,0,0,0.1)",
              background: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--ink)",
            }}
          >
            <Chevron dir="left" />
          </button>
          <h2 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            Candidatos de {label}
          </h2>
        </div>
        <p style={{ margin: "0 0 0 58px", fontSize: 19, color: "var(--ink-2)", lineHeight: 1.4 }}>
          Selecciona un candidato para ver su perfil completo con trayectoria, propuestas y similitudes.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {list.map((c) => (
          <button
            key={c.name}
            onClick={() => onPick(c)}
            style={{
              fontFamily: "inherit", textAlign: "left", background: "#fff",
              border: "1px solid rgba(0,0,0,0.08)", borderRadius: 18, padding: 20,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
              transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 28px -16px rgba(13,30,45,0.18)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
            }}
          >
            <Avatar name={c.name} color={c.color} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{c.name}</div>
              <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 2 }}>{c.party}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Fórmula: {c.vice}</div>
            </div>
            <Chevron dir="right" />
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SpectrumStep, CandidateListStep });
