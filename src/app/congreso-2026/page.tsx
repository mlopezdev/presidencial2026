import CongresoDashboard from "@/components/CongresoDashboard";

export default function CongresoPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 120px" }}>
      <header style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 36, marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>
          ELECCIONES LEGISLATIVAS · COLOMBIA · 8 DE MARZO DE 2026
        </div>
        <h1 style={{ fontFamily: "var(--font-plex-serif), Georgia, serif", fontSize: "clamp(40px, 6vw, 60px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 18px", color: "var(--ink)" }}>
          Cómo eligió Colombia su Congreso.
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 760, margin: 0 }}>
          Resultados oficiales de la Registraduría para <strong>Senado y Cámara de Representantes</strong>: votos por partido, partido ganador por departamento, top candidatos con voto preferente, drill-down a nivel municipal.{" "}
          <span style={{ color: "var(--ink-3)" }}>Fuente: Registraduría Nacional del Estado Civil — escrutinios.gov.co</span>
        </p>
      </header>

      <CongresoDashboard />

      <footer style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.12)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--ink-2)" }}>Metodología.</strong> Datos procesados a partir de los modelos MMV (Modelo Matemático de Votos) publicados por la Registraduría, agregados por departamento, municipio, partido y candidato. El voto blanco, nulo y no marcado se procesan por separado de los votos válidos.
      </footer>
    </main>
  );
}
