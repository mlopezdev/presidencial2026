import { readFile } from "node:fs/promises";
import path from "node:path";
import { absoluteUrl, error, json, options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

const VALID = new Set(["senado", "camara"]);

interface Ctx { params: Promise<{ corp: string }> }

export async function GET(req: Request, ctx: Ctx) {
  const { corp } = await ctx.params;
  if (!VALID.has(corp)) return error(404, `Corporación '${corp}' inválida. Usa 'senado' o 'camara'.`);

  const dataDir = path.join(process.cwd(), "public", "data", "congreso-2026");
  const [partidos, deptos] = await Promise.all([
    readFile(path.join(dataDir, `${corp}-partidos.json`), "utf-8").then(JSON.parse),
    readFile(path.join(dataDir, `${corp}-deptos.json`), "utf-8").then(JSON.parse),
  ]);

  return json({
    corporacion: corp.toUpperCase(),
    fuente: "Registraduría Nacional del Estado Civil — escrutinios 2026",
    partidos: partidos.partidos,
    candidatos_nacional: partidos.candidatos,
    deptos: deptos.map((d: { id_depto: string; departamento: string }) => ({
      ...d,
      url_municipios: absoluteUrl(req, `/api/v1/congreso-2026/${corp}/munis/${d.id_depto}`),
    })),
  });
}

export function generateStaticParams() {
  return [{ corp: "senado" }, { corp: "camara" }];
}
