import { EL_NATIONAL, EL_SPECTRUM, EL_YEARS } from "@/lib/elections-data";
import { error, json, options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

interface Ctx { params: Promise<{ year: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { year } = await ctx.params;
  const y = Number(year);
  const data = EL_NATIONAL[y];
  if (!data) return error(404, `Año '${year}' no disponible. Disponibles: ${EL_YEARS.join(", ")}`);

  const mapRound = (rs: typeof data.r1) => rs.map((r) => ({
    candidato: r.name,
    espectro: EL_SPECTRUM[r.name] ?? null,
    porcentaje: r.pct,
    votos: r.votes,
  }));

  return json({
    año: y,
    headline: data.headline,
    blurb: data.blurb,
    ganador: data.winner,
    total_votos: data.totalVotes,
    participacion_pct: data.turnout,
    abstencion_pct: data.abstencion,
    primera_vuelta: mapRound(data.r1),
    segunda_vuelta: data.r2.length ? mapRound(data.r2) : null,
  });
}

export function generateStaticParams() {
  return EL_YEARS.map((y) => ({ year: String(y) }));
}
