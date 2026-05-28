import { ALL_CANDIDATES } from "@/lib/data";
import { COMPARE_CATEGORIES, COMPARE_QUESTIONS } from "@/lib/compare-questions";
import { json, options, toSlug } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

export function GET(req: Request) {
  const url = new URL(req.url);
  const catFilter = url.searchParams.get("categoria");
  const candFilter = (url.searchParams.get("candidato") || "").toLowerCase().trim();

  const candByName = new Map(ALL_CANDIDATES.map((c) => [c.name, c]));

  let qs = COMPARE_QUESTIONS;
  if (catFilter) qs = qs.filter((q) => q.cat === catFilter);

  const preguntas = qs.map((q, i) => {
    // Construir respuesta por candidato (sólo los que tienen postura)
    const respuestas: { slug: string; candidato: string; partido: string; posicion: "si" | "no"; cita: string | null }[] = [];
    for (const name of q.yes) {
      const c = candByName.get(name);
      if (!c) continue;
      respuestas.push({
        slug: toSlug(c.name), candidato: c.name, partido: c.party,
        posicion: "si", cita: q.quotes[name] ?? null,
      });
    }
    for (const name of q.no) {
      const c = candByName.get(name);
      if (!c) continue;
      respuestas.push({
        slug: toSlug(c.name), candidato: c.name, partido: c.party,
        posicion: "no", cita: q.quotes[name] ?? null,
      });
    }

    return {
      id: i + 1,
      pregunta: q.q,
      categoria: q.cat,
      conteo: { si: q.yes.length, no: q.no.length },
      respuestas: candFilter
        ? respuestas.filter((r) => r.slug === candFilter || r.candidato.toLowerCase().includes(candFilter))
        : respuestas,
    };
  });

  return json({
    fuente: "Curaduría del proyecto Presidencial 2026 · UPB Bucaramanga",
    nota: "Las citas resumen declaraciones públicas, planes de gobierno o votaciones del candidato.",
    categorias: COMPARE_CATEGORIES,
    filtros: { categoria: catFilter, candidato: candFilter || null },
    total: preguntas.length,
    preguntas,
  });
}
