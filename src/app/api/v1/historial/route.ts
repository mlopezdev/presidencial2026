import { EL_NATIONAL, EL_YEARS } from "@/lib/elections-data";
import { absoluteUrl, json, options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

export function GET(req: Request) {
  const summary = EL_YEARS.map((y) => ({
    año: y,
    ganador: EL_NATIONAL[y].winner,
    participacion_pct: EL_NATIONAL[y].turnout,
    abstencion_pct: EL_NATIONAL[y].abstencion,
    total_votos: EL_NATIONAL[y].totalVotes,
    url_detalle: absoluteUrl(req, `/api/v1/historial/${y}`),
  }));
  return json({ años_disponibles: EL_YEARS, elecciones: summary });
}
