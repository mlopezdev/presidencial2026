import { ALL_CANDIDATES, IDEOLOGY_MATRIX } from "@/lib/data";
import { json, options, toSlug } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

function cuadrante(econ: number, social: number) {
  if (econ < 0 && social < 0)  return "izquierda_socialdemocracia";
  if (econ >= 0 && social < 0) return "libertarismo_liberalismo_progresista";
  if (econ < 0 && social >= 0) return "populismo_nacional";
  return "derecha_neoliberalismo_conservador";
}

export function GET() {
  const puntos = ALL_CANDIDATES
    .map((c) => {
      const coords = IDEOLOGY_MATRIX[c.name];
      if (!coords) return null;
      return {
        slug: toSlug(c.name),
        candidato: c.name,
        partido: c.party,
        econ: coords.econ,
        social: coords.social,
        cuadrante: cuadrante(coords.econ, coords.social),
      };
    })
    .filter(Boolean);

  return json({
    modelo: "Diagrama de Nolan adaptado",
    ejes: {
      econ: "−1 = más Estado, +1 = más mercado",
      social: "−1 = más progresista, +1 = más conservador",
    },
    cuadrantes: {
      izquierda_socialdemocracia: "Estado fuerte + agenda social progresista",
      libertarismo_liberalismo_progresista: "Libre mercado + derechos civiles amplios",
      derecha_neoliberalismo_conservador: "Libre mercado + valores tradicionales",
      populismo_nacional: "Control estatal + valores tradicionales",
    },
    puntos,
  });
}
