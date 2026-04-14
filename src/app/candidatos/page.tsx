"use client";

import { useState } from "react";

export default function CandidatosPage() {
  const [activeSection, setActiveSection] = useState<
    "resumen" | "trayectoria" | "propuestas" | "posiciones" | "plan" | null
  >(null);

  return (
    <section className="candidate-page">
      <article className="profile-shell">
        <div className="party-banner">
          <span className="party-pill">Banner del partido</span>
        </div>

        <div className="candidate-head">
          <div className="candidate-avatar" aria-hidden="true" />
          <div className="candidate-meta">
            <h2>Nombre del Candidato</h2>
            <p>Cuenta tipo X · espacio de perfil</p>
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
                El contenido se mostrara solo cuando hagas clic en una de las 5
                opciones del menu del candidato.
              </p>
            </section>
          )}

          {activeSection === "resumen" && (
            <section className="candidate-panel" id="resumen">
              <h3>Breve resumen del candidato</h3>
              <p>
                Aqui ira una descripcion corta del perfil politico, enfoque
                programatico, fortalezas comunicativas y mensaje central.
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
                    Enfoque en prevencion, justicia y articulacion territorial.
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
                    Prioridades en acceso, atencion primaria y sostenibilidad.
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
                DOFA del candidato para facilitar la comparacion.
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
  );
}
