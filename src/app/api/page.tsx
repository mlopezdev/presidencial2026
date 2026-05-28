import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API pública · Presidencial 2026",
  description:
    "Documentación de la API REST pública del proyecto Presidencial 2026 — UPB Bucaramanga.",
};

interface Endpoint {
  method: "GET";
  path: string;
  desc: string;
  ejemplo?: string;
  params?: { nombre: string; tipo: string; descripcion: string }[];
}

const SECTIONS: { titulo: string; intro?: string; endpoints: Endpoint[] }[] = [
  {
    titulo: "Entrada",
    endpoints: [
      {
        method: "GET", path: "/api/v1",
        desc: "Punto de entrada: lista todos los endpoints disponibles.",
      },
    ],
  },
  {
    titulo: "Candidatos a la Presidencia 2026",
    endpoints: [
      {
        method: "GET", path: "/api/v1/candidatos",
        desc: "Lista los 14 candidatos. Devuelve foto, partido, espectro, ideología y enlace al perfil.",
        params: [
          { nombre: "espectro", tipo: "izquierda | centro | derecha", descripcion: "Filtra por espectro político." },
          { nombre: "q", tipo: "string", descripcion: "Búsqueda parcial por nombre o partido." },
        ],
        ejemplo: "/api/v1/candidatos?espectro=izquierda",
      },
      {
        method: "GET", path: "/api/v1/candidatos/{slug}",
        desc: "Perfil completo: ideología, trayectoria, propuestas por eje, posiciones en 15 temas polémicos y DOFA.",
        ejemplo: "/api/v1/candidatos/ivan-cepeda",
      },
    ],
  },
  {
    titulo: "Temas y posiciones",
    endpoints: [
      {
        method: "GET", path: "/api/v1/temas",
        desc: "Los 15 temas polémicos con la posición declarada (sí/no/sin pronunciarse) de cada candidato.",
      },
      {
        method: "GET", path: "/api/v1/matriz-ideologica",
        desc: "Coordenadas Nolan (econ/social) de cada candidato y cuadrante asignado.",
      },
    ],
  },
  {
    titulo: "Historial presidencial 2010 – 2022",
    endpoints: [
      {
        method: "GET", path: "/api/v1/historial",
        desc: "Resumen de las 4 elecciones (ganador, total votos, participación).",
      },
      {
        method: "GET", path: "/api/v1/historial/{año}",
        desc: "Resultados detallados de 1ra y 2da vuelta para un año específico.",
        ejemplo: "/api/v1/historial/2022",
      },
    ],
  },
  {
    titulo: "Congreso 2026 (Senado y Cámara)",
    intro: "Resultados oficiales de la Registraduría agregados por departamento y municipio, separando voto válido por partido y candidato, voto blanco, nulo y no marcado.",
    endpoints: [
      {
        method: "GET", path: "/api/v1/congreso-2026/{corp}",
        desc: "Ranking nacional de partidos, top candidatos por voto preferente y resultados por departamento. Reemplaza {corp} por senado o camara.",
        ejemplo: "/api/v1/congreso-2026/senado",
      },
      {
        method: "GET", path: "/api/v1/congreso-2026/{corp}/munis/{id_depto}",
        desc: "Drill-down a nivel municipal del departamento. Usa el id_depto que viene en el endpoint anterior.",
        ejemplo: "/api/v1/congreso-2026/senado/munis/01",
      },
    ],
  },
  {
    titulo: "Geografía",
    endpoints: [
      {
        method: "GET", path: "/api/v1/geo/colombia-deptos",
        desc: "GeoJSON con los 33 departamentos de Colombia. Listo para usar con D3, Leaflet, Mapbox u otra librería de mapas.",
      },
    ],
  },
];

const PALETTE = {
  bg: "#FAFBFC",
  card: "#FFFFFF",
  border: "var(--line)",
  ink: "var(--ink)",
  ink2: "var(--ink-2)",
  ink3: "var(--ink-3)",
  brand: "var(--brand)",
};

export default function ApiDocsPage() {
  return (
    <main style={{
      maxWidth: 980, margin: "0 auto",
      padding: "clamp(36px, 6vw, 64px) clamp(16px, 4vw, 32px) 80px",
    }}>
      {/* Hero */}
      <header style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
        <p style={{
          margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: PALETTE.brand,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>API pública · v1</p>
        <h1 style={{
          margin: "0 0 14px", fontSize: "clamp(30px, 7vw, 56px)", fontWeight: 600,
          letterSpacing: "-0.035em", color: PALETTE.ink, lineHeight: 1.02,
          fontFamily: "var(--font-plex-serif), Georgia, serif",
        }}>
          Conecta tu sistema a estos datos.
        </h1>
        <p style={{
          margin: 0, fontSize: "clamp(16px, 4vw, 19px)",
          color: PALETTE.ink2, lineHeight: 1.55, maxWidth: 740,
        }}>
          API REST abierta, sin autenticación, con CORS habilitado para cualquier origen. Sirve los mismos
          datos que muestra este sitio: candidatos, posiciones, propuestas, resultados históricos y del
          Congreso 2026, y la geografía electoral de Colombia.
        </p>

        <div style={{
          marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8,
        }}>
          {[
            { l: "Formato", v: "JSON" },
            { l: "Auth", v: "Ninguna" },
            { l: "CORS", v: "*" },
            { l: "Cache", v: "s-maxage 3600" },
          ].map((b) => (
            <span key={b.l} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, color: PALETTE.ink2,
              background: PALETTE.card, border: `1px solid ${PALETTE.border}`,
              padding: "5px 10px", borderRadius: 999,
            }}>
              <strong style={{ color: PALETTE.ink3, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10 }}>{b.l}</strong>
              {b.v}
            </span>
          ))}
        </div>
      </header>

      {/* Quick start */}
      <section style={{
        background: PALETTE.card, border: `1px solid ${PALETTE.border}`,
        borderRadius: 18, padding: "clamp(18px, 4vw, 24px)", marginBottom: 32,
      }}>
        <h2 style={{
          margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: PALETTE.ink,
          letterSpacing: "-0.01em",
        }}>Empieza ya</h2>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: PALETTE.ink2, lineHeight: 1.5 }}>
          Haz una petición a cualquier endpoint con <code>fetch</code> o <code>curl</code>:
        </p>
        <pre style={{
          margin: 0, padding: "14px 16px", background: "#0F172A", color: "#E2E8F0",
          borderRadius: 12, fontSize: 13, lineHeight: 1.55, overflowX: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}>{`# Lista de candidatos
curl https://[tu-dominio]/api/v1/candidatos | jq

# Perfil completo
curl https://[tu-dominio]/api/v1/candidatos/ivan-cepeda

# Resultados Senado 2026
curl https://[tu-dominio]/api/v1/congreso-2026/senado`}</pre>
      </section>

      {/* Secciones de endpoints */}
      {SECTIONS.map((s) => (
        <section key={s.titulo} style={{ marginBottom: 36 }}>
          <h2 style={{
            margin: "0 0 4px",
            fontFamily: "var(--font-plex-serif), Georgia, serif",
            fontSize: "clamp(20px, 4.5vw, 26px)", fontWeight: 600,
            color: PALETTE.ink, letterSpacing: "-0.02em",
          }}>{s.titulo}</h2>
          {s.intro && (
            <p style={{ margin: "0 0 16px", fontSize: 14, color: PALETTE.ink3, lineHeight: 1.55, maxWidth: 720 }}>{s.intro}</p>
          )}
          <div style={{ display: "grid", gap: 12 }}>
            {s.endpoints.map((e) => (
              <article key={e.path + (e.ejemplo ?? "")} style={{
                background: PALETTE.card, border: `1px solid ${PALETTE.border}`,
                borderRadius: 16, padding: "clamp(16px, 4vw, 22px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    background: "rgba(31,143,92,0.12)", color: "#1F8F5C",
                    letterSpacing: "0.05em",
                  }}>{e.method}</span>
                  <code style={{
                    fontSize: 14, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    color: PALETTE.ink, fontWeight: 600,
                    wordBreak: "break-all",
                  }}>{e.path}</code>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 14, color: PALETTE.ink2, lineHeight: 1.5 }}>{e.desc}</p>

                {e.params && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.ink3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Parámetros (query)</div>
                    <ul style={{ margin: 0, padding: "0 0 0 18px", display: "grid", gap: 4 }}>
                      {e.params.map((p) => (
                        <li key={p.nombre} style={{ fontSize: 13, color: PALETTE.ink2, lineHeight: 1.5 }}>
                          <code style={{ background: "#F2F4F7", padding: "1px 6px", borderRadius: 4, color: PALETTE.ink, fontWeight: 600 }}>{p.nombre}</code>
                          {" "}<span style={{ color: PALETTE.ink3 }}>· {p.tipo}</span> — {p.descripcion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {e.ejemplo && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: PALETTE.ink3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ejemplo</span>
                    <a href={e.ejemplo} target="_blank" rel="noopener noreferrer"
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: 13, color: PALETTE.brand, textDecoration: "underline",
                        wordBreak: "break-all",
                      }}>{e.ejemplo}</a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Footer notes */}
      <section style={{
        marginTop: 24, paddingTop: 24, borderTop: `1px solid ${PALETTE.border}`,
        fontSize: 13, color: PALETTE.ink3, lineHeight: 1.6,
      }}>
        <p style={{ margin: "0 0 6px" }}>
          <strong style={{ color: PALETTE.ink2 }}>Términos de uso.</strong> Datos abiertos y atribuibles
          al proyecto Presidencial 2026 · UPB Bucaramanga. Las fuentes primarias (Registraduría
          Nacional del Estado Civil) mantienen sus respectivos derechos.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: PALETTE.ink2 }}>Caché.</strong> Todas las respuestas se sirven con
          <code> Cache-Control: public, s-maxage=3600</code> (1 hora). El GeoJSON con 1 día.
        </p>
      </section>
    </main>
  );
}
