export type Spectrum = "izquierda" | "centro" | "derecha";

export interface CandMeta { color: string; spectrum: Spectrum; short: string; }

// Nombres tal como aparecen en los JSON agregados (public/data/mapa/*.json).
// 2018 conserva tildes; 2022 viene normalizado sin tildes.
export const CAND_META: Record<string, CandMeta> = {
  // 2018
  "IVÁN DUQUE":                       { color: "#2E4BA8", spectrum: "derecha",   short: "Duque" },
  "GUSTAVO PETRO":                    { color: "#B8860B", spectrum: "izquierda", short: "Petro" },
  "SERGIO FAJARDO":                   { color: "#5B3A8B", spectrum: "centro",    short: "Fajardo" },
  "GERMÁN VARGAS LLERAS":             { color: "#C8553D", spectrum: "derecha",   short: "Vargas L." },
  "HUMBERTO DE LA CALLE":             { color: "#B3261E", spectrum: "centro",    short: "De la Calle" },
  "VIVIANE MORALES":                  { color: "#6B2D5C", spectrum: "derecha",   short: "V. Morales" },
  "JORGE ANTONIO TRUJILLO SARMIENTO": { color: "#7C5E2A", spectrum: "derecha",   short: "Trujillo" },
  "PROMOTORES VOTO EN BLANCO":        { color: "#9CA3AF", spectrum: "centro",    short: "V. blanco" },
  // 2022 (sin tildes, como vienen normalizados)
  "FEDERICO GUTIERREZ":               { color: "#2E4BA8", spectrum: "derecha",   short: "Fico" },
  "RODOLFO HERNANDEZ":                { color: "#1E8F8F", spectrum: "derecha",   short: "Rodolfo" },
  "INGRID BETANCOURT":                { color: "#2E7D32", spectrum: "centro",    short: "Íngrid" },
  "JOHN MILTON RODRIGUEZ":            { color: "#6B2D5C", spectrum: "derecha",   short: "J.M. Rodríguez" },
  "ENRIQUE GOMEZ MARTINEZ":           { color: "#7C5E2A", spectrum: "derecha",   short: "E. Gómez" },
  "LUIS PEREZ":                       { color: "#9C6E2A", spectrum: "centro",    short: "L. Pérez" },
};

// Mapeo nombre depto en GeoJSON → nombre canónico en los JSON de datos
export const GEO_TO_DATA: Record<string, string> = {
  "ANTIOQUIA": "ANTIOQUIA",
  "ATLANTICO": "ATLÁNTICO",
  "SANTAFE DE BOGOTA D.C": "BOGOTÁ D.C.",
  "BOLIVAR": "BOLÍVAR",
  "BOYACA": "BOYACÁ",
  "CALDAS": "CALDAS",
  "CAQUETA": "CAQUETÁ",
  "CAUCA": "CAUCA",
  "CESAR": "CESAR",
  "CORDOBA": "CÓRDOBA",
  "CUNDINAMARCA": "CUNDINAMARCA",
  "CHOCO": "CHOCÓ",
  "HUILA": "HUILA",
  "LA GUAJIRA": "LA GUAJIRA",
  "MAGDALENA": "MAGDALENA",
  "META": "META",
  "NARIÑO": "NARIÑO",
  "NORTE DE SANTANDER": "NORTE DE SANTANDER",
  "QUINDIO": "QUINDÍO",
  "RISARALDA": "RISARALDA",
  "SANTANDER": "SANTANDER",
  "SUCRE": "SUCRE",
  "TOLIMA": "TOLIMA",
  "VALLE DEL CAUCA": "VALLE DEL CAUCA",
  "ARAUCA": "ARAUCA",
  "CASANARE": "CASANARE",
  "PUTUMAYO": "PUTUMAYO",
  "AMAZONAS": "AMAZONAS",
  "GUAINIA": "GUAINÍA",
  "GUAVIARE": "GUAVIARE",
  "VAUPES": "VAUPÉS",
  "VICHADA": "VICHADA",
  "ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA": "SAN ANDRÉS",
};

export interface DeptResult {
  cod: number;
  depto: string;
  total: number;
  candidatos: Record<string, number>;
  blanco?: number;
  nulo?: number;
  participacion?: {
    censoM: number; censoH: number; votoCand?: number;
    votoTotal: number; blanco: number; nulo: number; noMarcado: number;
    abst: number; censo: number;
  };
}

export interface MapaDataset {
  year: 2018 | 2022;
  round: "r1" | "r2";
  data: DeptResult[];
}

export const MAPA_FILES = {
  "2018-r1": "/data/mapa/2018-r1.json",
  "2018-r2": "/data/mapa/2018-r2.json",
  "2022-r1": "/data/mapa/2022-r1.json",
  "2022-r2": "/data/mapa/2022-r2.json",
} as const;

export const MUNI_FILES = {
  "2022-r1": "/data/mapa/2022-r1-munis.json",
  "2022-r2": "/data/mapa/2022-r2-munis.json",
} as const;

export interface MuniResult {
  codMun: number;
  mun: string;
  codDep: number;
  dep: string;
  total: number;
  candidatos: Record<string, number>;
  blanco: number;
  nulo: number;
  participacion?: {
    censoM: number; censoH: number; votoCand?: number;
    votoTotal: number; blanco: number; nulo: number; noMarcado: number;
    abst: number; censo: number;
  };
}

export type MunisByDepto = Record<string, MuniResult[]>;

export const GEOJSON_URL = "/data/mapa/colombia-deptos.geo.json";
