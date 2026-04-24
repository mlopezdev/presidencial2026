/**
 * Capa de acceso a la "base de datos" de candidatos presidenciales 2026.
 *
 * Fuente de los datos: /public/data/*.json (generados desde el Excel oficial).
 * Estrategia: consumo desde frontend puro vía fetch — no hay backend.
 *
 * Cómo usarlo:
 *
 *   // En un Client Component:
 *   import { loadCandidatos, loadPosiciones, loadTemas } from "@/lib/candidatos-data";
 *
 *   const [candidatos, setCandidatos] = useState<Candidato[]>([]);
 *   useEffect(() => { loadCandidatos().then(setCandidatos); }, []);
 *
 *   // En un Server Component (Next.js App Router) basta con import directo:
 *   import candidatos from "../../public/data/candidatos.json";
 */

export type EspectroSimple = "izquierda" | "centro" | "derecha";

export type RespuestaPolemica = "si" | "no" | "no_pronunciado";

export interface Candidato {
  numero: number;
  id: string;                       // slug estable, ej. "ivan-cepeda"
  displayName: string;              // nombre corto canónico usado en la app
  nombreCompleto: string;
  formulaVicepresidente: string;
  partido: string;
  espectroPolitico: string;         // texto original del Excel
  espectroSimple: EspectroSimple;   // normalizado a 3 valores
  posicionTarjeton: number;
  profesion: string;
  edadAproximada: number | null;
  cargoPrevioDestacado: string;
  departamentoOrigen: string;
  comoLlegoALaCandidatura: string;
  urlFuente: string;

  biografia: string | null;
  trayectoria: string[];

  propuestaBandera: string | null;
  financiacionAval: string | null;
  encuestas: string | null;
  perfilElectoradoObjetivo: string | null;
  notasAdicionales: string | null;

  foto: string | null;              // ruta en /public/candidates
}

export interface TemaPolemico {
  id: string;                       // "tema-01" .. "tema-15"
  numero: number;
  pregunta: string;
}

/** Matriz de posiciones: { [candidatoId]: { [temaId]: respuesta } } */
export type PosicionesMap = Record<string, Record<string, RespuestaPolemica>>;

export interface EventoCalendario {
  evento: string;
  fecha: string;
  notas: string | null;
}

export interface NotaMetodologica {
  tema: string;
  detalle: string | null;
}

export interface Calendario {
  eventos: EventoCalendario[];
  notasMetodologicas: NotaMetodologica[];
}

// ---------- Loaders (fetch desde /public) ----------

const DATA_BASE = "/data";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export const loadCandidatos = () =>
  fetchJson<Candidato[]>(`${DATA_BASE}/candidatos.json`);

export const loadTemas = () =>
  fetchJson<TemaPolemico[]>(`${DATA_BASE}/temas-polemicos.json`);

export const loadPosiciones = () =>
  fetchJson<PosicionesMap>(`${DATA_BASE}/posiciones.json`);

export const loadCalendario = () =>
  fetchJson<Calendario>(`${DATA_BASE}/calendario.json`);

/** Carga todo en paralelo. Útil para páginas que muestran mucha info a la vez. */
export async function loadAll() {
  const [candidatos, temas, posiciones, calendario] = await Promise.all([
    loadCandidatos(),
    loadTemas(),
    loadPosiciones(),
    loadCalendario(),
  ]);
  return { candidatos, temas, posiciones, calendario };
}

// ---------- Helpers de consulta ----------

export function findCandidatoById(
  lista: Candidato[],
  id: string,
): Candidato | undefined {
  return lista.find((c) => c.id === id);
}

export function findCandidatoByName(
  lista: Candidato[],
  name: string,
): Candidato | undefined {
  const norm = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return lista.find(
    (c) =>
      c.displayName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() === norm,
  );
}

/** Devuelve las respuestas de un candidato etiquetadas con la pregunta. */
export function respuestasDeCandidato(
  candidatoId: string,
  temas: TemaPolemico[],
  posiciones: PosicionesMap,
): Array<{ tema: TemaPolemico; respuesta: RespuestaPolemica }> {
  const mapa = posiciones[candidatoId] ?? {};
  return temas.map((t) => ({
    tema: t,
    respuesta: mapa[t.id] ?? "no_pronunciado",
  }));
}
