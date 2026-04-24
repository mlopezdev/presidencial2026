// ─────────────────────────────────────────────────────────
// TILE MAP DE COLOMBIA — rejilla ilustrativa de 32 departamentos
// Cada depto ocupa una celda en coordenadas aproximadamente
// geográficas. Inspirado en los tile maps de NYT/Bloomberg.
// ─────────────────────────────────────────────────────────

// Coordenadas (col, row) donde 0,0 = esquina sup-izq
// El mapa simplificado tiene ~8 columnas x ~11 filas
window.CO_TILES = [
  // Caribe (norte)
  { dept: "La Guajira",          col: 5, row: 0, abbr: "LAG", region: "Caribe" },
  { dept: "San Andrés",          col: 0, row: 0, abbr: "SAP", region: "Insular" },
  { dept: "Atlántico",           col: 3, row: 1, abbr: "ATL", region: "Caribe" },
  { dept: "Magdalena",           col: 4, row: 1, abbr: "MAG", region: "Caribe" },
  { dept: "Cesar",               col: 5, row: 1, abbr: "CES", region: "Caribe" },
  { dept: "Bolívar",             col: 3, row: 2, abbr: "BOL", region: "Caribe" },
  { dept: "Sucre",               col: 2, row: 2, abbr: "SUC", region: "Caribe" },
  { dept: "Córdoba",             col: 1, row: 2, abbr: "COR", region: "Caribe" },
  { dept: "Norte de Santander",  col: 5, row: 2, abbr: "NSA", region: "Andina" },

  // Andina central
  { dept: "Antioquia",           col: 1, row: 3, abbr: "ANT", region: "Andina" },
  { dept: "Santander",           col: 4, row: 3, abbr: "SAN", region: "Andina" },
  { dept: "Arauca",              col: 6, row: 3, abbr: "ARA", region: "Orinoquía" },
  { dept: "Chocó",               col: 0, row: 4, abbr: "CHO", region: "Pacífica" },
  { dept: "Caldas",              col: 2, row: 4, abbr: "CAL", region: "Andina" },
  { dept: "Boyacá",              col: 3, row: 4, abbr: "BOY", region: "Andina" },
  { dept: "Casanare",            col: 5, row: 4, abbr: "CAS", region: "Orinoquía" },
  { dept: "Vichada",             col: 7, row: 4, abbr: "VIC", region: "Orinoquía" },
  { dept: "Risaralda",           col: 1, row: 5, abbr: "RIS", region: "Andina" },
  { dept: "Quindío",             col: 2, row: 5, abbr: "QUI", region: "Andina" },
  { dept: "Cundinamarca",        col: 3, row: 5, abbr: "CUN", region: "Andina" },
  { dept: "Bogotá D.C.",         col: 4, row: 5, abbr: "BOG", region: "Andina" },
  { dept: "Meta",                col: 5, row: 5, abbr: "MET", region: "Orinoquía" },

  // Sur
  { dept: "Valle del Cauca",     col: 1, row: 6, abbr: "VAL", region: "Pacífica" },
  { dept: "Tolima",              col: 2, row: 6, abbr: "TOL", region: "Andina" },
  { dept: "Huila",               col: 3, row: 6, abbr: "HUI", region: "Andina" },
  { dept: "Guaviare",            col: 5, row: 6, abbr: "GUV", region: "Amazonía" },
  { dept: "Guainía",             col: 7, row: 6, abbr: "GUA", region: "Amazonía" },
  { dept: "Cauca",               col: 1, row: 7, abbr: "CAU", region: "Pacífica" },
  { dept: "Caquetá",             col: 3, row: 7, abbr: "CAQ", region: "Amazonía" },
  { dept: "Vaupés",              col: 6, row: 7, abbr: "VAU", region: "Amazonía" },
  { dept: "Nariño",              col: 1, row: 8, abbr: "NAR", region: "Pacífica" },
  { dept: "Putumayo",            col: 2, row: 8, abbr: "PUT", region: "Amazonía" },
  { dept: "Amazonas",            col: 4, row: 9, abbr: "AMA", region: "Amazonía" },
];

// Helper para obtener dpto por col/row (no usado directamente)
window.CO_GRID_COLS = 8;
window.CO_GRID_ROWS = 10;
