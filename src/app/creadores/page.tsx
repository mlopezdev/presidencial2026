"use client";

import { useEffect, useState } from "react";

const CREADORES = [
  { nombre: "Ilych Jhosue Esteban Blanco Mendoza" },
  { nombre: "Miguel Andrés Granados Blanco" },
  { nombre: "Kerent Ximena Trujillo García" },
  { nombre: "Juan Diego Albarracín Melgarejo" },
];

function initials(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CreadoresPage() {
  // Empezamos con el orden estable (para evitar hydration mismatch) y
  // mezclamos una vez en el cliente, así nadie aparece "primero" o "último".
  const [orden, setOrden] = useState(CREADORES);
  useEffect(() => { setOrden(shuffle(CREADORES)); }, []);
  return (
    <main
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "clamp(36px, 6vw, 64px) clamp(16px, 4vw, 32px) 80px",
      }}
    >
      <header style={{ marginBottom: "clamp(28px, 5vw, 48px)" }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--brand)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Quiénes hicieron esto
        </p>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(30px, 7vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-0.035em",
            color: "var(--ink)",
            lineHeight: 1.02,
            fontFamily: "var(--font-plex-serif), Georgia, serif",
          }}
        >
          Los creadores.
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "clamp(16px, 4vw, 19px)",
            color: "var(--ink-2)",
            lineHeight: 1.55,
            maxWidth: 700,
          }}
        >
          Cuatro estudiantes de la <strong style={{ color: "var(--ink)" }}>UPB Bucaramanga</strong>{" "}
          que construyeron este proyecto como ejercicio de la clase de{" "}
          <strong style={{ color: "var(--ink)" }}>Política Internacional y Transformación Digital</strong>.
          Apartidista, sin ánimo de lucro, abierto a quien lo quiera revisar.
        </p>
      </header>

      <section
        aria-label="Lista de creadores"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "clamp(12px, 3vw, 18px)",
          marginBottom: "clamp(32px, 5vw, 56px)",
        }}
      >
        {orden.map((c) => (
          <article
            key={c.nombre}
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 20,
              padding: "clamp(18px, 4vw, 24px)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 4,
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--brand) 100%, white 18%), var(--brand))",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--brand) 100%, white 22%), var(--brand))",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 12px -2px rgba(13,30,45,0.18)",
              }}
            >
              {initials(c.nombre)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "clamp(15px, 3.5vw, 17px)",
                  fontWeight: 600,
                  color: "var(--ink)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  marginBottom: 3,
                }}
              >
                {c.nombre}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  letterSpacing: "0.02em",
                }}
              >
                Estudiante · UPB Bucaramanga
              </div>
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          background:
            "linear-gradient(135deg, var(--brand), color-mix(in oklab, var(--brand) 70%, black 30%))",
          color: "#fff",
          borderRadius: 22,
          padding: "clamp(24px, 5vw, 36px)",
          boxShadow: "0 30px 60px -30px rgba(47,107,138,0.5)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "5px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            marginBottom: 14,
          }}
        >
          Contexto académico
        </div>
        <h2
          style={{
            margin: "0 0 10px",
            fontFamily: "var(--font-plex-serif), Georgia, serif",
            fontSize: "clamp(22px, 5vw, 30px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Política Internacional y Transformación Digital
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "clamp(14px, 3.5vw, 17px)",
            lineHeight: 1.55,
            opacity: 0.94,
            maxWidth: 640,
          }}
        >
          Una clase de la <strong>Universidad Pontificia Bolivariana — Seccional Bucaramanga</strong>{" "}
          que cruza el pulso político con las herramientas digitales para entenderlo.
          Este sitio es el producto final del semestre.
        </p>
      </section>
    </main>
  );
}
