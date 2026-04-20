"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ThemeToggle from "./theme-toggle";

type Candidate = {
  id: string;
  name: string;
  movement: string;
  city: string;
  age: number;
  slogan: string;
  profile: string;
  image: string;
  proposals: string[];
};

const candidates: Candidate[] = [
  {
    id: "serrano",
    name: "Mariana Serrano",
    movement: "Acuerdo Ciudadano",
    city: "Bogota",
    age: 47,
    slogan: "Instituciones fuertes, crecimiento con equidad.",
    profile:
      "Economista y ex ministra de Hacienda. Su plataforma combina disciplina fiscal, inversion social y reforma territorial.",
    image: "/candidates/serrano.svg",
    proposals: [
      "Reforma tributaria progresiva para financiar educacion superior publica.",
      "Pacto nacional para infraestructura de agua potable en municipios intermedios.",
      "Estrategia de empleo juvenil con incentivos para mipymes tecnicas.",
    ],
  },
  {
    id: "rios",
    name: "Tomas Rios",
    movement: "Futuro Productivo",
    city: "Medellin",
    age: 52,
    slogan: "Seguridad juridica para innovar y producir.",
    profile:
      "Ingeniero industrial y ex gobernador. Propone una agenda de competitividad regional y seguridad urbana basada en datos.",
    image: "/candidates/rios.svg",
    proposals: [
      "Red de distritos industriales con energia limpia y logistica multimodal.",
      "Sistema de alertas tempranas para delitos de alto impacto.",
      "Becas duales empresa-universidad para carreras STEM.",
    ],
  },
  {
    id: "cardenas",
    name: "Laura Cardenas",
    movement: "Pacto Verde Social",
    city: "Cali",
    age: 44,
    slogan: "Bienestar territorial y transicion ecologica real.",
    profile:
      "Abogada ambiental y ex alcaldesa. Enfoca su programa en salud preventiva, adaptacion climatica y economia del cuidado.",
    image: "/candidates/cardenas.svg",
    proposals: [
      "Sistema nacional de cuidados con cobertura para hogares vulnerables.",
      "Plan de restauracion de cuencas y reforestacion comunitaria.",
      "Meta de transporte publico electrico en capitales departamentales.",
    ],
  },
  {
    id: "valencia",
    name: "Andres Valencia",
    movement: "Unidad Federal",
    city: "Barranquilla",
    age: 50,
    slogan: "Estado cercano, regiones protagonistas.",
    profile:
      "Administrador publico y ex senador. Defiende un modelo de descentralizacion con autonomia presupuestal y rendicion de cuentas.",
    image: "/candidates/valencia.svg",
    proposals: [
      "Fondo de autonomia regional con control ciudadano trimestral.",
      "Reforma a la justicia local con jueces itinerantes rurales.",
      "Plan nacional de conectividad universitaria en zonas apartadas.",
    ],
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState(candidates[0].id);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId],
  );

  return (
    <main className="presidential-shell">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 lg:py-14">
        <header className="space-y-6">
          <div className="toolbar">
            <div className="pill-nav" aria-label="Secciones principales">
              <span className="pill-item is-active">Candidatos</span>
              <span className="pill-item">Propuestas</span>
              <span className="pill-item">Analisis</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="space-y-3">
          <p className="kicker">Observatorio electoral</p>
          <h1 className="headline">Candidaturas Presidenciales Colombia 2026</h1>
          <p className="lede max-w-3xl">
            Borrador interactivo con una vitrina tipo puerta giratoria 360 grados.
            Cada fotografia funciona como boton de seleccion para explorar el perfil
            academico y las propuestas del candidato.
          </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="door-stage rounded-3xl p-6 md:p-10">
            <div className="door-scene" aria-label="Carrusel giratorio de candidatos">
              <div className="door-rotor">
                {candidates.map((candidate, index) => (
                  <button
                    key={candidate.id}
                    type="button"
                    style={{ transform: `rotateY(${index * 90}deg) translateZ(180px)` }}
                    className={`door-panel ${
                      selectedCandidate.id === candidate.id ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedId(candidate.id)}
                    aria-pressed={selectedCandidate.id === candidate.id}
                    aria-label={`Seleccionar a ${candidate.name}`}
                  >
                    <span className="door-photo-wrap">
                      <Image
                        src={candidate.image}
                        alt={`Retrato de ${candidate.name}`}
                        fill
                        className="door-photo"
                        sizes="(max-width: 768px) 220px, 240px"
                        priority={candidate.id === candidates[0].id}
                      />
                    </span>
                    <span className="door-name">{candidate.name}</span>
                  </button>
                ))}
              </div>
              <div className="door-column" aria-hidden="true" />
            </div>
          </div>

          <article className="candidate-card rounded-3xl p-6 md:p-8">
            <p className="card-tag">Candidato seleccionado</p>
            <h2 className="card-title">{selectedCandidate.name}</h2>
            <p className="card-meta">
              {selectedCandidate.movement} · {selectedCandidate.city} · {selectedCandidate.age} anos
            </p>
            <p className="card-slogan">{selectedCandidate.slogan}</p>
            <p className="card-profile">{selectedCandidate.profile}</p>

            <h3 className="card-subtitle">Propuestas clave</h3>
            <ul className="card-list">
              {selectedCandidate.proposals.map((proposal) => (
                <li key={proposal}>{proposal}</li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
