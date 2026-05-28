import { ALL_CANDIDATES, getCandidatePhoto, IDEOLOGY_MATRIX } from "@/lib/data";
import { absoluteUrl, json, options, toSlug } from "@/lib/api-helpers";

export const dynamic = "force-static";

export function OPTIONS() { return options(); }

export function GET(req: Request) {
  const url = new URL(req.url);
  const spectrum = url.searchParams.get("espectro"); // izquierda | centro | derecha
  const search = (url.searchParams.get("q") || "").toLowerCase().trim();

  let list = ALL_CANDIDATES;
  if (spectrum) list = list.filter((c) => c.spectrum === spectrum);
  if (search) {
    list = list.filter(
      (c) => c.name.toLowerCase().includes(search) || c.party.toLowerCase().includes(search)
    );
  }

  const items = list.map((c) => {
    const photo = getCandidatePhoto(c.name);
    const ideo = IDEOLOGY_MATRIX[c.name];
    return {
      slug: toSlug(c.name),
      nombre: c.name,
      partido: c.party,
      espectro: c.spectrum,
      genero: c.gender,
      formula_vice: c.vice,
      vice_genero: c.viceGender,
      lema: c.lede,
      color: c.color,
      foto_url: photo ? absoluteUrl(req, photo) : null,
      ideologia: ideo ?? null,
      url_perfil: absoluteUrl(req, `/api/v1/candidatos/${toSlug(c.name)}`),
    };
  });

  return json({
    total: items.length,
    filtros: { espectro: spectrum, q: search || null },
    candidatos: items,
  });
}
