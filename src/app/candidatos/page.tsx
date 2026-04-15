"use client";

import { useState } from "react";

const candidates = [
  { id: 1, name: "Candidato 01", handle: "@candidato01", party: "Partido 01" },
  { id: 2, name: "Candidato 02", handle: "@candidato02", party: "Partido 02" },
  { id: 3, name: "Candidato 03", handle: "@candidato03", party: "Partido 03" },
  { id: 4, name: "Candidato 04", handle: "@candidato04", party: "Partido 04" },
  { id: 5, name: "Candidato 05", handle: "@candidato05", party: "Partido 05" },
  { id: 6, name: "Candidato 06", handle: "@candidato06", party: "Partido 06" },
  { id: 7, name: "Candidato 07", handle: "@candidato07", party: "Partido 07" },
  { id: 8, name: "Candidato 08", handle: "@candidato08", party: "Partido 08" },
  { id: 9, name: "Candidato 09", handle: "@candidato09", party: "Partido 09" },
  { id: 10, name: "Candidato 10", handle: "@candidato10", party: "Partido 10" },
  { id: 11, name: "Candidato 11", handle: "@candidato11", party: "Partido 11" },
  { id: 12, name: "Candidato 12", handle: "@candidato12", party: "Partido 12" },
  { id: 13, name: "Candidato 13", handle: "@candidato13", party: "Partido 13" },
  { id: 14, name: "Candidato 14", handle: "@candidato14", party: "Partido 14" },
] as const;

export default function CandidatosPage() {
  const [activeCandidate, setActiveCandidate] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<
    "resumen" | "trayectoria" | "propuestas" | "posiciones" | "plan" | null
  >(null);
  const selectedCandidate =
    activeCandidate === null ? null : candidates[activeCandidate];

  return (
    <section className="candidate-page">
      <section className="candidate-selector" aria-label="Seleccion de candidato">
        <div className="selector-head">
          <p className="selector-label">Elige un candidato</p>
          {selectedCandidate && (
            <button
              type="button"
              className="selector-reset"
              onClick={() => {
                setActiveCandidate(null);
                setActiveSection(null);
              }}
            >
              Cambiar seleccion
            </button>
          )}
        </div>
        <div className="selector-list" role="listbox" aria-label="Lista de candidatos">
          {candidates.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              role="option"
              aria-selected={activeCandidate === index}
              className={activeCandidate === index ? "picker-chip is-picked" : "picker-chip"}
              onClick={() => {
                setActiveCandidate(index);
                setActiveSection(null);
              }}
            >
              <span className="chip-number">{String(candidate.id).padStart(2, "0")}</span>
              <span className="chip-copy">
                <strong>{candidate.name}</strong>
                <small>{candidate.party}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {!selectedCandidate && (
        <section className="candidate-panel panel-placeholder choose-candidate">
          <h3>Selecciona un candidato para ver su perfil</h3>
          <p>
            No se mostrara informacion del candidato hasta que hagas clic en
            una tarjeta de la lista superior.
          </p>
        </section>
      )}

      {selectedCandidate && (
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
      )}
    </section>
  );
}
