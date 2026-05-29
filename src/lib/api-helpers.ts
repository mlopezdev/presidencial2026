// Utilidades comunes para los Route Handlers de /api/v1/*.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

interface JsonOptions {
  /** Segundos de cache pública (CDN/browser). 0 desactiva el cache. */
  cacheSeconds?: number;
  status?: number;
}

export function json(data: unknown, opts: JsonOptions = {}): Response {
  const { cacheSeconds = 3600, status = 200 } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    ...CORS_HEADERS,
  };
  if (cacheSeconds > 0) {
    headers["Cache-Control"] = `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`;
  } else {
    headers["Cache-Control"] = "no-store";
  }
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

export function error(status: number, message: string, extra?: Record<string, unknown>): Response {
  return json({ error: message, status, ...(extra ?? {}) }, { status, cacheSeconds: 0 });
}

/** Handler para preflight CORS. */
export function options(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** "Iván Cepeda" → "ivan-cepeda" */
export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Devuelve URL absoluta a partir de un path relativo + el Request entrante. */
export function absoluteUrl(req: Request, path: string): string {
  if (path.startsWith("http")) return path;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}${path.startsWith("/") ? path : "/" + path}`;
}
