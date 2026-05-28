import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, json, options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

const VALID = new Set(["senado", "camara"]);

interface Ctx { params: Promise<{ corp: string; depto: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { corp, depto } = await ctx.params;
  if (!VALID.has(corp)) return error(404, `Corporación '${corp}' inválida.`);

  const file = path.join(process.cwd(), "public", "data", "congreso-2026", `${corp}-munis.json`);
  const munisByDep: Record<string, unknown[]> = await readFile(file, "utf-8").then(JSON.parse);
  const list = munisByDep[depto];
  if (!list) return error(404, `Departamento '${depto}' no encontrado para ${corp}.`);

  return json({
    corporacion: corp.toUpperCase(),
    id_depto: depto,
    total_municipios: list.length,
    municipios: list,
  });
}

// Pre-genera todas las combinaciones (senado|camara) × 34 deptos
export async function generateStaticParams() {
  const out: { corp: string; depto: string }[] = [];
  for (const corp of ["senado", "camara"]) {
    const file = path.join(process.cwd(), "public", "data", "congreso-2026", `${corp}-munis.json`);
    const munis: Record<string, unknown[]> = JSON.parse(await readFile(file, "utf-8"));
    for (const depto of Object.keys(munis)) out.push({ corp, depto });
  }
  return out;
}
