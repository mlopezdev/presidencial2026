import { ALL_CANDIDATES } from "@/lib/data";
import { TEMAS, getPosicion } from "@/lib/posiciones-data";
import { json, options, toSlug } from "@/lib/api-helpers";

export const dynamic = "force-static";

export function OPTIONS() { return options(); }

export function GET() {
  const temas = TEMAS.map((tema) => ({
    id: tema.id,
    numero: tema.numero,
    pregunta: tema.pregunta,
    respuestas: ALL_CANDIDATES.map((c) => ({
      candidato: c.name,
      slug: toSlug(c.name),
      partido: c.party,
      posicion: getPosicion(c.name, tema.id),
    })),
  }));
  return json({ total: temas.length, temas });
}
