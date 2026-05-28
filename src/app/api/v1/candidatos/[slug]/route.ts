import {
  ALL_CANDIDATES, AXES, COMPARE_DATA, DOFA_DATA,
  IDEOLOGY_MATRIX, TIMELINES, getCandidatePhoto,
} from "@/lib/data";
import { TEMAS, getPosicion } from "@/lib/posiciones-data";
import { COMPARE_QUESTIONS } from "@/lib/compare-questions";
import { absoluteUrl, error, json, options, toSlug } from "@/lib/api-helpers";

export const dynamic = "force-static";

export function OPTIONS() { return options(); }

interface Ctx { params: Promise<{ slug: string }> }

export async function GET(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const cand = ALL_CANDIDATES.find((c) => toSlug(c.name) === slug);
  if (!cand) return error(404, `Candidato '${slug}' no encontrado`);

  const photo = getCandidatePhoto(cand.name);
  const compare = COMPARE_DATA[cand.name];
  const propuestas = AXES.map((a) => ({
    eje: a.key,
    descripcion: a.desc,
    items: compare?.[a.key] ?? [],
  })).filter((x) => x.items.length > 0);

  const posiciones = TEMAS.map((tema) => ({
    id: tema.id,
    numero: tema.numero,
    pregunta: tema.pregunta,
    posicion: getPosicion(cand.name, tema.id), // "si" | "no" | "no_pronunciado"
  }));

  const dofa = DOFA_DATA[cand.name];
  const trayectoria = TIMELINES[cand.name] ?? null;
  const ideologia = IDEOLOGY_MATRIX[cand.name] ?? null;

  // Comparativa detallada: sólo las preguntas donde este candidato tiene postura registrada
  const comparativa = COMPARE_QUESTIONS
    .map((q) => {
      const posicion: "si" | "no" | null = q.yes.includes(cand.name)
        ? "si"
        : q.no.includes(cand.name)
          ? "no"
          : null;
      if (!posicion) return null;
      return {
        pregunta: q.q,
        categoria: q.cat,
        posicion,
        cita: q.quotes[cand.name] ?? null,
      };
    })
    .filter(Boolean);

  return json({
    slug,
    nombre: cand.name,
    partido: cand.party,
    espectro: cand.spectrum,
    genero: cand.gender,
    formula_vice: cand.vice,
    vice_genero: cand.viceGender,
    lema: cand.lede,
    color: cand.color,
    foto_url: photo ? absoluteUrl(req, photo) : null,
    ideologia,
    trayectoria,
    propuestas_por_eje: propuestas,
    posiciones_15_temas: posiciones,
    comparativa_detallada: comparativa,
    dofa: dofa ?? null,
  });
}

// Pre-genera todos los slugs en build-time
export function generateStaticParams() {
  return ALL_CANDIDATES.map((c) => ({ slug: toSlug(c.name) }));
}
