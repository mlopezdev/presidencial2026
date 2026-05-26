// Datos Congreso 2026 — Senado + Cámara
// Fuente: pipeline scripts/download_congreso2026.py sobre la API de la Registraduría.

export type Corporacion = "senado" | "camara";

export interface PartidoNacional { nombre: string; votos_nacional: number; }

export interface CandidatoNacional {
  partido: string;
  nombre: string;
  cedula: string;
  votos: number;
}

export interface DeptoCongreso {
  id_depto: string;
  departamento: string;
  total: number;          // votos válidos (suma de todos los partidos)
  partidos: Record<string, number>;   // nombre partido → votos
  blanco: number;
  nulo: number;
  no_marcado: number;
  top_candidatos: CandidatoNacional[];
}

export interface MuniCongreso {
  id_muni: string;
  municipio: string;
  total: number;
  partidos: Record<string, number>;
  blanco: number;
  nulo: number;
  no_marcado: number;
}

export type MunisCongresoPorDepto = Record<string, MuniCongreso[]>;

export interface PartidosFile {
  partidos: PartidoNacional[];
  candidatos: CandidatoNacional[];
}

export const CONGRESO_FILES = {
  senado: {
    partidos: "/data/congreso-2026/senado-partidos.json",
    deptos: "/data/congreso-2026/senado-deptos.json",
    munis: "/data/congreso-2026/senado-munis.json",
  },
  camara: {
    partidos: "/data/congreso-2026/camara-partidos.json",
    deptos: "/data/congreso-2026/camara-deptos.json",
    munis: "/data/congreso-2026/camara-munis.json",
  },
} as const;

// Colores referenciales por partido (no oficial). Si el nombre no está, fallback a una paleta cíclica.
export const PARTIDO_COLOR: Record<string, string> = {
  "PACTO HISTÓRICO": "#B8860B",
  "MOVIMIENTO POLÍTICO PACTO HISTÓRICO": "#B8860B",
  "PARTIDO CENTRO DEMOCRÁTICO": "#2E4BA8",
  "PARTIDO LIBERAL COLOMBIANO": "#B3261E",
  "PARTIDO CONSERVADOR COLOMBIANO": "#2E7D32",
  "ALIANZA POR COLOMBIA": "#7C3AED",
  "PARTIDO DE LA UNIÓN POR LA GENTE - PARTIDO DE LA U": "#0891B2",
  "COALICIÓN CAMBIO RADICAL - ALMA": "#C8553D",
  "PARTIDO CAMBIO RADICAL": "#C8553D",
  "PARTIDO ALIANZA VERDE": "#1F8F5C",
  "AHORA COLOMBIA": "#1E40AF",
  "MOVIMIENTO SALVACIÓN NACIONAL": "#6B2D5C",
  "FRENTE AMPLIO UNITARIO": "#D97706",
  "CREEMOS": "#5B3A8B",
  "COALICIÓN FUERZA CIUDADANA": "#0F766E",
};

const FALLBACK_PALETTE = ["#475569", "#9333EA", "#A21CAF", "#0E7490", "#A16207", "#15803D", "#BE123C", "#3F3F46"];

export function partidoColor(nombre: string): string {
  if (PARTIDO_COLOR[nombre]) return PARTIDO_COLOR[nombre];
  // hash determinístico → paleta de respaldo
  let h = 0;
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) | 0;
  return FALLBACK_PALETTE[Math.abs(h) % FALLBACK_PALETTE.length];
}

// Normaliza "PACTO HISTÓRICO ANTIOQUIA" → "PACTO HISTÓRICO" para agrupar
// listas departamentales del mismo movimiento (útil sólo en Cámara).
const DEPTO_SUFIXES = [
  "ANTIOQUIA", "ATLÁNTICO", "ATLANTICO", "BOGOTÁ", "BOGOTA", "BOLÍVAR", "BOLIVAR",
  "BOYACÁ", "BOYACA", "CALDAS", "CAUCA", "CESAR", "CHOCÓ", "CHOCO", "CÓRDOBA", "CORDOBA",
  "CUNDINAMARCA", "HUILA", "MAGDALENA", "META", "NARIÑO", "NARINO", "QUINDÍO", "QUINDIO",
  "RISARALDA", "SANTANDER", "SUCRE", "TOLIMA", "VALLE", "GUAJIRA", "ARAUCA", "CASANARE",
  "PUTUMAYO", "AMAZONAS", "GUAINÍA", "GUAINIA", "VAUPÉS", "VAUPES", "VICHADA",
  "GUAVIARE", "SAN ANDRÉS", "SAN ANDRES", "CAQUETÁ", "CAQUETA", "NORTE DE SANTANDER",
  "CÓRDOBA", "CONSULADOS",
];

export function normalizaPartidoMovimiento(nombre: string): string {
  const up = nombre.toUpperCase();
  for (const suf of DEPTO_SUFIXES) {
    if (up.endsWith(" " + suf)) {
      return nombre.slice(0, nombre.length - suf.length - 1).trim();
    }
  }
  return nombre;
}
