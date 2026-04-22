import ThemeToggle from "@/components/ThemeToggle";

type Candidate = {
  name: string;
  viceFormula: string;
  party: string;
  partyColor: string;
  shortInfo: string;
};

const candidates: Candidate[] = [
  {
    name: "Ivan Cepeda",
    viceFormula: "Aida Quilcue",
    party: "Pacto Historico",
    partyColor: "#facc15",
    shortInfo:
      "La fuerza de la vida y el cambio continua.",
  },
  {
    name: "Abelardo de la Espriella",
    viceFormula: "Jose Manuel Restrepo",
    party: "Defensores de la Patria",
    partyColor: "#ff2b2b",
    shortInfo:
      "Firme por la Patria: El Tigre que nada teme.",
  },
  {
    name: "Paloma Valencia",
    viceFormula: "Juan Daniel Oviedo",
    party: "Centro Democratico",
    partyColor: "#38bdf8",
    shortInfo:
      "Si podemos hacerlo juntos por Colombia.",
  },
  {
    name: "Claudia Lopez",
    viceFormula: "Leonardo Huerta",
    party: "Con Claudia Imparables",
    partyColor: "#10b981",
    shortInfo:
      "Con Claudia, imparables.",
  },
  {
    name: "Sergio Fajardo",
    viceFormula: "Edna Bonilla",
    party: "Dignidad & Compromiso",
    partyColor: "#8b5cf6",
    shortInfo:
      "Diferentes sin ser enemigos.",
  },
  {
    name: "Miguel Uribe Londono",
    viceFormula: "Luisa Fernanda Villegas",
    party: "Partido Democrata",
    partyColor: "#4169e1",
    shortInfo:
      "Trabajando por una sola Colombia.",
  },
  {
    name: "Luis Gilberto Murillo",
    viceFormula: "Luz Maria Zapata",
    party: "Luis Gilberto Soy Yo",
    partyColor: "#166534",
    shortInfo:
      "No soy el candidato de ningun politico.",
  },
  {
    name: "Santiago Botero",
    viceFormula: "Carlos Fernando Cuevas",
    party: "Romper el Sistema",
    partyColor: "#4b5563",
    shortInfo:
      "Es hora de romper el sistema.",
  },
  {
    name: "Mauricio Lizcano",
    viceFormula: "Pedro de la Torre",
    party: "Firme con Lizcano",
    partyColor: "#84cc16",
    shortInfo:
      "Firme con Lizcano: Resultados que se ven.",
  },
  {
    name: "Roy Barreras",
    viceFormula: "Martha Lucia Zamora",
    party: "La Fuerza de la Paz",
    partyColor: "#dc143c",
    shortInfo:
      "La fuerza de la paz y el consenso.",
  },
  {
    name: "Carlos Caicedo",
    viceFormula: "Nelson Alarcon",
    party: "Fuerza Ciudadana",
    partyColor: "#f97316",
    shortInfo:
      "El cambio es con la gente.",
  },
  {
    name: "Sondra Macollins",
    viceFormula: "Leonardo Karam",
    party: "La Abogada de Hierro",
    partyColor: "#7d3c98",
    shortInfo:
      "La abogada de hierro: Justicia para todos.",
  },
  {
    name: "Gustavo Matamoros",
    viceFormula: "Mila Maria Paz",
    party: "Partido Ecologista",
    partyColor: "#228b22",
    shortInfo:
      "Por nuestra tierra y nuestro futuro.",
  },
  {
    name: "Clara Lopez",
    viceFormula: "Maria Consuelo del Rio",
    party: "Esperanza Democratica",
    partyColor: "#722f37",
    shortInfo:
      "Esperanza democratica para el pueblo.",
  },
];

function getAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=eceff4&color=1f2937&size=256&bold=true`;
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <article
      className="group relative z-0 rounded-3xl border p-4 shadow-md transition-all duration-200 hover:z-30 hover:-translate-y-0.5 focus-within:z-30"
      style={{
        borderColor: "var(--line-soft)",
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={getAvatarUrl(candidate.name)}
          alt={`Imagen de ${candidate.name}`}
          className="h-16 w-16 rounded-xl border-2 object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ borderColor: candidate.partyColor }}
          loading="lazy"
        />
        <div>
          <h3
            className="text-base leading-tight"
            style={{
              color: "var(--ink-primary)",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 700,
            }}
          >
            {candidate.name}
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Formula vicepresidencial: {candidate.viceFormula}
          </p>
          <p
            className="inline-flex items-center gap-2 text-xs uppercase"
            style={{ color: "var(--text-secondary)", fontWeight: 500, letterSpacing: "0.03em" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: candidate.partyColor }}
            />
            {candidate.party}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-full z-40 mt-3 w-[285px] -translate-x-1/2 rounded-3xl border p-4 opacity-0 transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-100 group-focus-within:translate-y-1 group-focus-within:opacity-100"
        style={{
          borderColor: "var(--line-soft)",
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <img
          src={getAvatarUrl(candidate.name)}
          alt={`Detalle de ${candidate.name}`}
          className="mx-auto h-32 w-32 rounded-2xl border-4 object-cover"
          style={{ borderColor: candidate.partyColor }}
          loading="lazy"
        />
        <h4
          className="mt-3 text-center text-lg"
          style={{
            color: "var(--ink-primary)",
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 700,
          }}
        >
          {candidate.name}
        </h4>
        <p className="mt-1 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          {candidate.shortInfo}
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  const topCandidates = candidates.slice(0, 7);
  const otherCandidates = candidates.slice(7);

  return (
    <main
      className="min-h-screen w-full px-5 py-10 sm:px-8 md:px-14"
      style={{
        background:
          "radial-gradient(circle at top, color-mix(in srgb, var(--blue-institutional) 14%, var(--background)) 0%, var(--background) 58%, color-mix(in srgb, var(--steel-gray) 14%, var(--background)) 100%)",
      }}
    >
      <section
        className="mx-auto max-w-6xl rounded-3xl border p-6 backdrop-blur md:p-10"
        style={{
          borderColor: "var(--line-soft)",
          backgroundColor: "color-mix(in srgb, var(--surface) 90%, transparent)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p
            className="text-sm uppercase"
            style={{ color: "var(--text-secondary)", fontWeight: 500, letterSpacing: "0.2em" }}
          >
            Especial elecciones Colombia
          </p>
          <ThemeToggle />
        </div>
        <h1
          className="heading-slide mt-2 text-center text-3xl leading-tight md:text-5xl"
          style={{
            color: "var(--ink-primary)",
            fontFamily: "var(--font-serif), Georgia, serif",
            fontWeight: 700,
          }}
        >
          !! Sabia usted esto !!
        </h1>
        <p className="mt-4 max-w-3xl" style={{ color: "var(--text-secondary)" }}>
          Estos son 7 candidatos que vienen punteando en encuestas. Al pasar el
          cursor sobre su imagen, aparece una vista ampliada con información
          clave de cada uno.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topCandidates.map((candidate) => (
            <CandidateCard key={candidate.name} candidate={candidate} />
          ))}
        </div>

        <details
          className="mt-12 rounded-3xl border p-5"
          style={{
            borderColor: "var(--line-soft)",
            backgroundColor: "color-mix(in srgb, var(--steel-gray) 10%, var(--surface))",
          }}
        >
          <summary
            className="w-fit cursor-pointer rounded-full px-6 py-3 text-sm text-white transition-all duration-200 hover:-translate-y-px"
            style={{
              fontWeight: 600,
              background: "linear-gradient(135deg, var(--blue-institutional), var(--blue-secondary))",
            }}
          >
            Saber más candidatos
          </summary>
          <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Aquí puedes ver los otros 7 candidatos que no están en el grupo de
            mayor intención de voto.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {otherCandidates.map((candidate) => (
              <CandidateCard key={candidate.name} candidate={candidate} />
            ))}
          </div>
        </details>
      </section>
    </main>
  );
}
