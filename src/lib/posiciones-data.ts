import posicionesRaw from "../../public/data/posiciones.json";
import temasRaw from "../../public/data/temas-polemicos.json";

export type Posicion = "si" | "no" | "no_pronunciado";

export interface Tema {
  id: string;
  numero: number;
  pregunta: string;
}

export const TEMAS: Tema[] = temasRaw as Tema[];

// Mapa de slug a nombre completo del candidato
const SLUG_TO_NAME: Record<string, string> = {
  "ivan-cepeda":               "Iván Cepeda",
  "clara-lopez":               "Clara López",
  "claudia-lopez":             "Claudia López",
  "santiago-botero":           "Santiago Botero",
  "gustavo-matamoros":         "Gustavo Matamoros",
  "paloma-valencia":           "Paloma Valencia",
  "sergio-fajardo":            "Sergio Fajardo",
  "roy-barreras":              "Roy Barreras",
  "mauricio-lizcano":          "Mauricio Lizcano",
  "abelardo-de-la-espriella":  "Abelardo de la Espriella",
  "miguel-uribe-londono":      "Miguel Uribe Londoño",
  "sondra-macollins":          "Sondra Macollins",
  "carlos-caicedo":            "Carlos Caicedo",
  "luis-gilberto-murillo":     "Luis Gilberto Murillo",
};

// posiciones por nombre completo → tema-id → posición
export const POSICIONES: Record<string, Record<string, Posicion>> = Object.fromEntries(
  Object.entries(posicionesRaw).map(([slug, temas]) => [
    SLUG_TO_NAME[slug] ?? slug,
    temas as Record<string, Posicion>,
  ]),
);

export function getPosicion(candidateName: string, temaId: string): Posicion {
  return POSICIONES[candidateName]?.[temaId] ?? "no_pronunciado";
}
