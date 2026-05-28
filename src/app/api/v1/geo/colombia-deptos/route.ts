import { readFile } from "node:fs/promises";
import path from "node:path";
import { options } from "@/lib/api-helpers";

export const dynamic = "force-static";
export function OPTIONS() { return options(); }

export async function GET() {
  const file = path.join(process.cwd(), "public", "data", "mapa", "colombia-deptos.geo.json");
  const body = await readFile(file, "utf-8");
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/geo+json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
