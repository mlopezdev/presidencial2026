"use client";

import Link from "next/link";
import { useState } from "react";

type Spectrum = "izquierda" | "centro" | "derecha";

const candidates = [
  {
    id: 1,
    name: "Candidato 01",
    handle: "@candidato01",
    party: "Partido 01",
    spectrum: "izquierda",
  },
  {
    id: 2,
    name: "Candidato 02",
    handle: "@candidato02",
    party: "Partido 02",
    spectrum: "izquierda",
  },
  {
    id: 3,
    name: "Candidato 03",
    handle: "@candidato03",
    party: "Partido 03",
    spectrum: "izquierda",
  },
  {
    id: 4,
    name: "Candidato 04",
    handle: "@candidato04",
    party: "Partido 04",
    spectrum: "izquierda",
  },
  {
    id: 5,
    name: "Candidato 05",
    handle: "@candidato05",
    party: "Partido 05",
    spectrum: "izquierda",
  },
  {
    id: 6,
    name: "Candidato 06",
    handle: "@candidato06",
    party: "Partido 06",
    spectrum: "centro",
  },
  {
    id: 7,
    name: "Candidato 07",
    handle: "@candidato07",
    party: "Partido 07",
    spectrum: "centro",
  },
  {
    id: 8,
    name: "Candidato 08",
    handle: "@candidato08",
    party: "Partido 08",
    spectrum: "centro",
  },
  {
    id: 9,
    name: "Candidato 09",
    handle: "@candidato09",
    party: "Partido 09",
    spectrum: "centro",
  },
  {
    id: 10,
    name: "Candidato 10",
    handle: "@candidato10",
    party: "Partido 10",
    spectrum: "centro",
  },
  {
    id: 11,
    name: "Candidato 11",
    handle: "@candidato11",
    party: "Partido 11",
    spectrum: "derecha",
  },
  {
    id: 12,
    name: "Candidato 12",
    handle: "@candidato12",
    party: "Partido 12",
    spectrum: "derecha",
  },
  {
    id: 13,
    name: "Candidato 13",
    handle: "@candidato13",
    party: "Partido 13",
    spectrum: "derecha",
  },
  {
    id: 14,
    name: "Candidato 14",
    handle: "@candidato14",
    party: "Partido 14",
    spectrum: "derecha",
  },
] as const;

export default function CandidatosPage() {
  const [activeSpectrum, setActiveSpectrum] = useState<Spectrum | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<number | null>(null);
  const [stepDirection, setStepDirection] = useState<"forward" | "backward">("forward");
  const [activeSection, setActiveSection] = useState<
    "resumen" | "trayectoria" | "propuestas" | "posiciones" | "plan" | null
  >(null);

  const filteredCandidates = activeSpectrum
    ? candidates.filter((candidate) => candidate.spectrum === activeSpectrum)
    : [];

  const selectedCandidate =
    activeCandidate === null ? null : candidates[activeCandidate];

  const currentStep = !activeSpectrum ? 1 : !selectedCandidate ? 2 : 3;

  return (
    <section className="candidate-page">
      {currentStep === 1 && (
        <section
          className={`candidate-selector candidate-step spectrum-step step-transition step-${stepDirection}`}
          aria-label="Paso 1: espectro politico"
        >
          <div className="step-topbar">
            <Link href="/" className="step-back" aria-label="Volver al inicio">
              <span aria-hidden="true">←</span>
            </Link>
            <p className="step-kicker">Paso 1 de 3</p>
          </div>

          <div className="selector-head selector-head-centered">
            <p className="selector-label">Elige un espectro politico</p>
          </div>

          <div className="spectrum-picker spectrum-picker-showcase" role="radiogroup" aria-label="Espectro politico">
            {(["izquierda", "centro", "derecha"] as const).map((spectrum) => (
              (() => {
                const preview = candidates
                  .filter((candidate) => candidate.spectrum === spectrum)
                  .slice(0, 3);

                return (
                  <button
                    key={spectrum}
                    type="button"
                    role="radio"
                    aria-checked={activeSpectrum === spectrum}
                    className={activeSpectrum === spectrum ? "spectrum-pill is-picked" : "spectrum-pill"}
                    onClick={() => {
                      setStepDirection("forward");
                      setActiveSpectrum(spectrum);
                      setActiveCandidate(null);
                      setActiveSection(null);
                    }}
                  >
                    <span className="spectrum-title">{spectrum}</span>
                    <span className="spectrum-hover-preview" aria-hidden="true">
                      {preview.map((candidate) => (
                        <span key={candidate.id}>{candidate.name}</span>
                      ))}
                    </span>
                  </button>
                );
              })()
            ))}
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section
          className={`candidate-selector candidate-step step-transition step-${stepDirection}`}
          aria-label="Paso 2: lista de candidatos"
        >
          <div className="step-topbar">
            <button
              type="button"
              className="step-back"
              aria-label="Volver a espectro"
              onClick={() => {
                setStepDirection("backward");
                setActiveSpectrum(null);
                setActiveCandidate(null);
                setActiveSection(null);
              }}
            >
              <span aria-hidden="true">←</span>
            </button>
            <p className="step-kicker">Paso 2 de 3</p>
          </div>

          <div className="selector-head selector-head-centered">
            <p className="selector-label">Candidatos del espectro {activeSpectrum}</p>
          </div>

          <div className="candidate-card-grid" role="listbox" aria-label="Lista de candidatos">
            {filteredCandidates.map((candidate) => {
              const isSelected = selectedCandidate?.id === candidate.id;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={isSelected ? "candidate-card is-picked" : "candidate-card"}
                  onClick={() => {
                    setStepDirection("forward");
                    const indexInAll = candidates.findIndex((item) => item.id === candidate.id);
                    setActiveCandidate(indexInAll);
                    setActiveSection(null);
                  }}
                >
                  <span className="card-topline">
                    <span className="chip-number">{String(candidate.id).padStart(2, "0")}</span>
                    <small>{candidate.spectrum}</small>
                  </span>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.party}</span>
                  <small>{candidate.handle}</small>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {selectedCandidate && currentStep === 3 && (
        <section className={`candidate-step step-transition step-${stepDirection}`} aria-label="Paso 3: perfil del candidato">
          <div className="step-topbar">
            <button
              type="button"
              className="step-back"
              aria-label="Volver a lista de candidatos"
              onClick={() => {
                setStepDirection("backward");
                setActiveCandidate(null);
                setActiveSection(null);
              }}
            >
              <span aria-hidden="true">←</span>
            </button>
            <p className="step-kicker">Paso 3 de 3</p>
        </div>

          <article className="profile-shell">
            <div className="party-banner">
              <span className="party-pill">{selectedCandidate.party}</span>
            </div>
            <div className="candidate-head">
              <div className="candidate-avatar" aria-hidden="true" />
              <div className="candidate-meta">
                <h2>{selectedCandidate.name}</h2>
                <p>{selectedCandidate.handle} · cuenta tipo X</p>
              </div>
            </div>

            <nav className="candidate-nav" aria-label="Secciones del candidato">
              <button
                type="button"
                className={activeSection === "resumen" ? "is-active" : ""}
                onClick={() => setActiveSection("resumen")}
              >
                Resumen
              </button>
              <button
                type="button"
                className={activeSection === "trayectoria" ? "is-active" : ""}
                onClick={() => setActiveSection("trayectoria")}
              >
                Trayectoria
              </button>
              <button
                type="button"
                className={activeSection === "propuestas" ? "is-active" : ""}
                onClick={() => setActiveSection("propuestas")}
              >
                Propuestas clave
              </button>
              <button
                type="button"
                className={activeSection === "posiciones" ? "is-active" : ""}
                onClick={() => setActiveSection("posiciones")}
              >
                Posiciones
              </button>
              <button
                type="button"
                className={activeSection === "plan" ? "is-active" : ""}
                onClick={() => setActiveSection("plan")}
              >
                Plan y DOFA
              </button>
            </nav>

            <div className="candidate-content">
              {!activeSection && (
                <section className="candidate-panel panel-placeholder">
                  <h3>Selecciona una opcion</h3>
                  <p>
                    El contenido se mostrara solo cuando hagas clic en una de las
                    5 opciones del menu del candidato.
                  </p>
                </section>
              )}

              {activeSection === "resumen" && (
                <section className="candidate-panel" id="resumen">
                  <h3>Breve resumen del candidato</h3>
                  <p>
                    Aqui ira una descripcion corta de {selectedCandidate.name},
                    su enfoque programatico, fortalezas comunicativas y mensaje
                    central.
                  </p>
                </section>
              )}

              {activeSection === "trayectoria" && (
                <section className="candidate-panel" id="trayectoria">
                  <h3>Trayectoria en linea de tiempo</h3>
                  <ol className="timeline">
                    <li>AAAA · Primer hito de carrera publica o profesional.</li>
                    <li>AAAA · Segundo hito con mayor impacto ciudadano.</li>
                    <li>AAAA · Tercer hito previo a la candidatura actual.</li>
                  </ol>
                </section>
              )}

              {activeSection === "propuestas" && (
                <section className="candidate-panel" id="propuestas">
                  <h3>Propuestas clave</h3>
                  <ul>
                    <li>Propuesta 1: enunciado breve de la medida.</li>
                    <li>Propuesta 2: objetivo y poblacion beneficiada.</li>
                    <li>Propuesta 3: impacto esperado y plazo estimado.</li>
                    <li>Propuesta 4: mecanismo de financiacion preliminar.</li>
                  </ul>
                </section>
              )}

              {activeSection === "posiciones" && (
                <section className="candidate-panel" id="posiciones">
                  <h3>Posicion frente a temas importantes</h3>
                  <div className="position-grid">
                    <article className="position-item">
                      <h4>Economia</h4>
                      <p>
                        Postura resumida sobre empleo, impuestos y crecimiento.
                      </p>
                    </article>
                    <article className="position-item">
                      <h4>Seguridad</h4>
                      <p>
                        Enfoque en prevencion, justicia y articulacion
                        territorial.
                      </p>
                    </article>
                    <article className="position-item">
                      <h4>Educacion</h4>
                      <p>
                        Linea de accion sobre calidad, cobertura y permanencia.
                      </p>
                    </article>
                    <article className="position-item">
                      <h4>Salud</h4>
                      <p>
                        Prioridades en acceso, atencion primaria y
                        sostenibilidad.
                      </p>
                    </article>
                  </div>
                </section>
              )}

              {activeSection === "plan" && (
                <section className="candidate-panel" id="plan">
                  <h3>Plan de gobierno y DOFA</h3>
                  <p>
                    Este bloque conectara con el documento oficial y un analisis
                    DOFA de {selectedCandidate.name} para facilitar la
                    comparacion.
                  </p>
                  <a className="plan-link" href="#" aria-disabled="true">
                    Ver plan de gobierno (pendiente)
                  </a>
                  <a className="plan-link" href="#" aria-disabled="true">
                    Ver DOFA del candidato (pendiente)
                  </a>
                </section>
              )}
            </div>
          </article>
        </section>
      )}
    </section>
  );
}
