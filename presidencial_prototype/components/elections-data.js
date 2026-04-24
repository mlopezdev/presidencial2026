// ─────────────────────────────────────────────────────────
// HISTORIAL ELECTORAL — datos aproximados a registros oficiales
// Fuente: Registraduría Nacional del Estado Civil (consolidados
// públicos de 2010, 2014, 2018, 2022). Los porcentajes son
// aproximaciones con fines editoriales e ilustrativos.
// ─────────────────────────────────────────────────────────

// Colores por candidato (persistentes entre elecciones)
window.EL_COLOR = {
  // 2010
  "Juan Manuel Santos": "#E8A200",
  "Antanas Mockus": "#2E7D32",
  "Germán Vargas Lleras": "#C8553D",
  "Gustavo Petro": "#B8860B",
  "Noemí Sanín": "#1E40AF",
  "Rafael Pardo": "#B3261E",
  // 2014
  "Óscar Iván Zuluaga": "#2E4BA8",
  "Marta Lucía Ramírez": "#1E40AF",
  "Clara López": "#722F37",
  "Enrique Peñalosa": "#2E7D32",
  // 2018
  "Iván Duque": "#2E4BA8",
  "Sergio Fajardo": "#5B3A8B",
  "Humberto de la Calle": "#B3261E",
  // 2022
  "Federico Gutiérrez": "#2E4BA8",
  "Rodolfo Hernández": "#1E8F8F",
  "John Milton Rodríguez": "#6B2D5C",
};

// Espectro por candidato
window.EL_SPECTRUM = {
  "Juan Manuel Santos": "derecha",
  "Antanas Mockus": "centro",
  "Germán Vargas Lleras": "derecha",
  "Gustavo Petro": "izquierda",
  "Noemí Sanín": "derecha",
  "Rafael Pardo": "centro",
  "Óscar Iván Zuluaga": "derecha",
  "Marta Lucía Ramírez": "derecha",
  "Clara López": "izquierda",
  "Enrique Peñalosa": "centro",
  "Iván Duque": "derecha",
  "Sergio Fajardo": "centro",
  "Humberto de la Calle": "centro",
  "Federico Gutiérrez": "derecha",
  "Rodolfo Hernández": "derecha",
  "John Milton Rodríguez": "derecha",
};

// ── Resultados nacionales (1ra y 2da vuelta) ─────────
// Porcentajes sobre votos válidos. Abstención sobre censo electoral.
window.EL_NATIONAL = {
  2010: {
    abstencion: 50.7,
    turnout: 49.3,
    totalVotes: 14_781_020,
    r1: [
      { name: "Juan Manuel Santos", pct: 46.6, votes: 6_802_043 },
      { name: "Antanas Mockus", pct: 21.5, votes: 3_134_222 },
      { name: "Germán Vargas Lleras", pct: 10.1, votes: 1_473_627 },
      { name: "Gustavo Petro", pct: 9.1, votes: 1_331_267 },
      { name: "Noemí Sanín", pct: 6.1, votes: 893_819 },
      { name: "Rafael Pardo", pct: 4.4, votes: 638_302 },
    ],
    r2: [
      { name: "Juan Manuel Santos", pct: 69.1, votes: 9_028_943 },
      { name: "Antanas Mockus", pct: 27.5, votes: 3_587_975 },
    ],
    winner: "Juan Manuel Santos",
  },
  2014: {
    abstencion: 59.9,
    turnout: 40.1,
    totalVotes: 13_216_915,
    r1: [
      { name: "Óscar Iván Zuluaga", pct: 29.3, votes: 3_769_005 },
      { name: "Juan Manuel Santos", pct: 25.7, votes: 3_301_815 },
      { name: "Marta Lucía Ramírez", pct: 15.5, votes: 1_995_696 },
      { name: "Clara López", pct: 15.2, votes: 1_958_414 },
      { name: "Enrique Peñalosa", pct: 8.3, votes: 1_065_142 },
    ],
    r2: [
      { name: "Juan Manuel Santos", pct: 50.9, votes: 7_816_986 },
      { name: "Óscar Iván Zuluaga", pct: 45.0, votes: 6_905_001 },
    ],
    winner: "Juan Manuel Santos",
  },
  2018: {
    abstencion: 46.6,
    turnout: 53.4,
    totalVotes: 19_636_714,
    r1: [
      { name: "Iván Duque", pct: 39.1, votes: 7_569_693 },
      { name: "Gustavo Petro", pct: 25.1, votes: 4_855_069 },
      { name: "Sergio Fajardo", pct: 23.7, votes: 4_589_696 },
      { name: "Germán Vargas Lleras", pct: 7.3, votes: 1_407_840 },
      { name: "Humberto de la Calle", pct: 2.1, votes: 399_180 },
    ],
    r2: [
      { name: "Iván Duque", pct: 54.0, votes: 10_373_080 },
      { name: "Gustavo Petro", pct: 41.8, votes: 8_034_189 },
    ],
    winner: "Iván Duque",
  },
  2022: {
    abstencion: 45.1,
    turnout: 54.9,
    totalVotes: 21_627_037,
    r1: [
      { name: "Gustavo Petro", pct: 40.3, votes: 8_527_768 },
      { name: "Rodolfo Hernández", pct: 28.1, votes: 5_953_209 },
      { name: "Federico Gutiérrez", pct: 23.9, votes: 5_058_010 },
      { name: "Sergio Fajardo", pct: 4.2, votes: 888_385 },
      { name: "John Milton Rodríguez", pct: 1.3, votes: 271_245 },
    ],
    r2: [
      { name: "Gustavo Petro", pct: 50.4, votes: 11_281_002 },
      { name: "Rodolfo Hernández", pct: 47.3, votes: 10_580_412 },
    ],
    winner: "Gustavo Petro",
  },
};

// ── Departamental: ganadores por departamento en 2da vuelta ──
// dpto: { 2010, 2014, 2018, 2022 } → nombre del ganador
// Aprox. basadas en consolidados departamentales de 2da vuelta.
window.EL_DEPT_WINNER = {
  "Amazonas":            { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Antioquia":           { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Arauca":              { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Atlántico":           { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Bolívar":             { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Boyacá":              { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Caldas":              { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Caquetá":             { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Casanare":            { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Cauca":               { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Cesar":               { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Chocó":               { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Córdoba":             { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Cundinamarca":        { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Guainía":             { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Guaviare":            { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Huila":               { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "La Guajira":          { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Magdalena":           { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Meta":                { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Nariño":              { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Norte de Santander":  { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Putumayo":            { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Gustavo Petro",2022: "Gustavo Petro" },
  "Quindío":             { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Risaralda":           { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "San Andrés":          { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Santander":           { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Sucre":               { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Tolima":              { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Valle del Cauca":     { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
  "Vaupés":              { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Vichada":             { 2010: "Juan Manuel Santos", 2014: "Óscar Iván Zuluaga",   2018: "Iván Duque",   2022: "Rodolfo Hernández" },
  "Bogotá D.C.":         { 2010: "Juan Manuel Santos", 2014: "Juan Manuel Santos",   2018: "Iván Duque",   2022: "Gustavo Petro" },
};

// ── Porcentajes departamentales de 2da vuelta (ganador vs retador) ──
// Aproximados a datos oficiales. {winner_pct: %, other: {nombre: %}}
window.EL_DEPT_PCT = {
  // Datos ilustrativos por elección (2018 y 2022 con más granularidad)
  2018: {
    "Antioquia":       { "Iván Duque": 73.3, "Gustavo Petro": 23.8 },
    "Bogotá D.C.":     { "Iván Duque": 50.5, "Gustavo Petro": 47.0 },
    "Atlántico":       { "Iván Duque": 54.8, "Gustavo Petro": 42.4 },
    "Valle del Cauca": { "Iván Duque": 52.1, "Gustavo Petro": 44.6 },
    "Cundinamarca":    { "Iván Duque": 55.4, "Gustavo Petro": 41.7 },
    "Santander":       { "Iván Duque": 60.3, "Gustavo Petro": 36.9 },
    "Boyacá":          { "Iván Duque": 56.4, "Gustavo Petro": 40.5 },
    "Norte de Santander":{ "Iván Duque": 63.8, "Gustavo Petro": 33.0 },
    "Cauca":           { "Gustavo Petro": 58.2, "Iván Duque": 38.8 },
    "Nariño":          { "Gustavo Petro": 65.5, "Iván Duque": 31.6 },
    "La Guajira":      { "Gustavo Petro": 55.6, "Iván Duque": 41.3 },
    "Putumayo":        { "Gustavo Petro": 62.0, "Iván Duque": 35.1 },
    "Chocó":           { "Gustavo Petro": 70.2, "Iván Duque": 27.4 },
    "Arauca":          { "Gustavo Petro": 52.7, "Iván Duque": 44.1 },
    "Amazonas":        { "Iván Duque": 51.4, "Gustavo Petro": 44.9 },
    "Bolívar":         { "Iván Duque": 52.1, "Gustavo Petro": 44.8 },
    "Caldas":          { "Iván Duque": 71.9, "Gustavo Petro": 25.7 },
    "Caquetá":         { "Iván Duque": 66.5, "Gustavo Petro": 30.8 },
    "Casanare":        { "Iván Duque": 75.4, "Gustavo Petro": 22.2 },
    "Cesar":           { "Iván Duque": 63.1, "Gustavo Petro": 33.7 },
    "Córdoba":         { "Iván Duque": 60.4, "Gustavo Petro": 36.5 },
    "Guainía":         { "Iván Duque": 58.3, "Gustavo Petro": 38.2 },
    "Guaviare":        { "Iván Duque": 68.9, "Gustavo Petro": 28.9 },
    "Huila":           { "Iván Duque": 60.0, "Gustavo Petro": 37.0 },
    "Magdalena":       { "Iván Duque": 55.6, "Gustavo Petro": 41.8 },
    "Meta":            { "Iván Duque": 69.2, "Gustavo Petro": 28.4 },
    "Quindío":         { "Iván Duque": 67.0, "Gustavo Petro": 29.6 },
    "Risaralda":       { "Iván Duque": 64.2, "Gustavo Petro": 33.2 },
    "San Andrés":      { "Iván Duque": 56.4, "Gustavo Petro": 40.8 },
    "Sucre":           { "Iván Duque": 57.8, "Gustavo Petro": 39.6 },
    "Tolima":          { "Iván Duque": 58.1, "Gustavo Petro": 39.2 },
    "Vaupés":          { "Iván Duque": 55.2, "Gustavo Petro": 42.1 },
    "Vichada":         { "Iván Duque": 62.5, "Gustavo Petro": 34.9 },
  },
  2022: {
    "Antioquia":       { "Rodolfo Hernández": 73.2, "Gustavo Petro": 25.3 },
    "Bogotá D.C.":     { "Gustavo Petro": 58.3, "Rodolfo Hernández": 39.7 },
    "Atlántico":       { "Gustavo Petro": 66.1, "Rodolfo Hernández": 32.4 },
    "Valle del Cauca": { "Gustavo Petro": 55.7, "Rodolfo Hernández": 42.9 },
    "Cundinamarca":    { "Gustavo Petro": 51.4, "Rodolfo Hernández": 46.3 },
    "Santander":       { "Rodolfo Hernández": 60.8, "Gustavo Petro": 37.8 },
    "Boyacá":          { "Gustavo Petro": 50.7, "Rodolfo Hernández": 47.2 },
    "Norte de Santander":{ "Rodolfo Hernández": 58.5, "Gustavo Petro": 39.6 },
    "Cauca":           { "Gustavo Petro": 73.4, "Rodolfo Hernández": 24.6 },
    "Nariño":          { "Gustavo Petro": 76.1, "Rodolfo Hernández": 21.8 },
    "La Guajira":      { "Gustavo Petro": 68.5, "Rodolfo Hernández": 29.3 },
    "Putumayo":        { "Gustavo Petro": 74.5, "Rodolfo Hernández": 23.0 },
    "Chocó":           { "Gustavo Petro": 82.1, "Rodolfo Hernández": 16.1 },
    "Arauca":          { "Gustavo Petro": 60.3, "Rodolfo Hernández": 37.0 },
    "Amazonas":        { "Gustavo Petro": 51.0, "Rodolfo Hernández": 45.2 },
    "Bolívar":         { "Gustavo Petro": 67.8, "Rodolfo Hernández": 30.4 },
    "Caldas":          { "Rodolfo Hernández": 59.8, "Gustavo Petro": 37.7 },
    "Caquetá":         { "Rodolfo Hernández": 54.1, "Gustavo Petro": 43.2 },
    "Casanare":        { "Rodolfo Hernández": 71.3, "Gustavo Petro": 26.3 },
    "Cesar":           { "Gustavo Petro": 53.6, "Rodolfo Hernández": 44.2 },
    "Córdoba":         { "Gustavo Petro": 58.9, "Rodolfo Hernández": 39.0 },
    "Guainía":         { "Rodolfo Hernández": 54.3, "Gustavo Petro": 42.1 },
    "Guaviare":        { "Rodolfo Hernández": 57.0, "Gustavo Petro": 40.0 },
    "Huila":           { "Gustavo Petro": 54.8, "Rodolfo Hernández": 43.0 },
    "Magdalena":       { "Gustavo Petro": 66.9, "Rodolfo Hernández": 31.5 },
    "Meta":            { "Rodolfo Hernández": 55.8, "Gustavo Petro": 42.1 },
    "Quindío":         { "Rodolfo Hernández": 57.4, "Gustavo Petro": 40.0 },
    "Risaralda":       { "Rodolfo Hernández": 52.9, "Gustavo Petro": 44.5 },
    "San Andrés":      { "Gustavo Petro": 58.2, "Rodolfo Hernández": 39.3 },
    "Sucre":           { "Gustavo Petro": 70.5, "Rodolfo Hernández": 27.3 },
    "Tolima":          { "Gustavo Petro": 55.4, "Rodolfo Hernández": 41.9 },
    "Vaupés":          { "Rodolfo Hernández": 50.5, "Gustavo Petro": 46.3 },
    "Vichada":         { "Rodolfo Hernández": 56.8, "Gustavo Petro": 40.4 },
  },
};

// ── Top municipios por candidato (mejor desempeño relativo) ──
window.EL_TOP_MUNIS = {
  2022: {
    "Gustavo Petro": [
      { muni: "Bojayá", dept: "Chocó", pct: 93.2 },
      { muni: "Toribío", dept: "Cauca", pct: 91.8 },
      { muni: "Suárez", dept: "Cauca", pct: 88.5 },
      { muni: "Tumaco", dept: "Nariño", pct: 87.4 },
      { muni: "Quibdó", dept: "Chocó", pct: 82.6 },
    ],
    "Rodolfo Hernández": [
      { muni: "Piedecuesta", dept: "Santander", pct: 84.1 },
      { muni: "Floridablanca", dept: "Santander", pct: 79.3 },
      { muni: "Bucaramanga", dept: "Santander", pct: 76.7 },
      { muni: "Girón", dept: "Santander", pct: 75.2 },
      { muni: "Yopal", dept: "Casanare", pct: 73.8 },
    ],
  },
  2018: {
    "Iván Duque": [
      { muni: "Aguadas", dept: "Caldas", pct: 91.2 },
      { muni: "Marinilla", dept: "Antioquia", pct: 88.7 },
      { muni: "Yopal", dept: "Casanare", pct: 82.6 },
      { muni: "Sabaneta", dept: "Antioquia", pct: 84.3 },
      { muni: "Rionegro", dept: "Antioquia", pct: 83.0 },
    ],
    "Gustavo Petro": [
      { muni: "Toribío", dept: "Cauca", pct: 86.4 },
      { muni: "Bojayá", dept: "Chocó", pct: 84.7 },
      { muni: "Inírida", dept: "Guainía", pct: 72.3 },
      { muni: "Tumaco", dept: "Nariño", pct: 78.5 },
      { muni: "Riosucio", dept: "Chocó", pct: 74.1 },
    ],
  },
};

// ── Urbano vs rural (ilustrativo, puntos agregados) ──
// % voto del ganador de la 2da vuelta en municipios urbanos vs rurales
window.EL_URBAN_RURAL = {
  2010: { urbano: { winner: "Juan Manuel Santos", pct: 67.2 }, rural: { winner: "Juan Manuel Santos", pct: 71.8 } },
  2014: { urbano: { winner: "Juan Manuel Santos", pct: 52.8 }, rural: { winner: "Juan Manuel Santos", pct: 48.1 } },
  2018: { urbano: { winner: "Iván Duque", pct: 57.2 }, rural: { winner: "Gustavo Petro", pct: 52.4 } },
  2022: { urbano: { winner: "Gustavo Petro", pct: 51.8 }, rural: { winner: "Gustavo Petro", pct: 49.3 } },
};

// ── Demografía (voto por grupo, aprox. encuestas de salida) ──
window.EL_DEMO_AGE = {
  2022: {
    "18-24": { "Gustavo Petro": 64, "Rodolfo Hernández": 33 },
    "25-39": { "Gustavo Petro": 56, "Rodolfo Hernández": 41 },
    "40-54": { "Gustavo Petro": 48, "Rodolfo Hernández": 50 },
    "55-69": { "Gustavo Petro": 44, "Rodolfo Hernández": 54 },
    "70+":   { "Gustavo Petro": 41, "Rodolfo Hernández": 57 },
  },
  2018: {
    "18-24": { "Gustavo Petro": 54, "Iván Duque": 42 },
    "25-39": { "Gustavo Petro": 47, "Iván Duque": 48 },
    "40-54": { "Gustavo Petro": 40, "Iván Duque": 56 },
    "55-69": { "Gustavo Petro": 38, "Iván Duque": 59 },
    "70+":   { "Gustavo Petro": 34, "Iván Duque": 62 },
  },
};

window.EL_DEMO_GENDER = {
  2022: {
    "Mujeres": { "Gustavo Petro": 51, "Rodolfo Hernández": 46 },
    "Hombres": { "Gustavo Petro": 49, "Rodolfo Hernández": 48 },
  },
  2018: {
    "Mujeres": { "Gustavo Petro": 40, "Iván Duque": 55 },
    "Hombres": { "Gustavo Petro": 44, "Iván Duque": 53 },
  },
};

// Facts editoriales para cada elección (titulares)
window.EL_HEADLINES = {
  2010: {
    title: "La reelección del uribismo sin Uribe",
    blurb: "Juan Manuel Santos, ex ministro de Defensa, gana en segunda vuelta con amplio margen contra Antanas Mockus, que lidera una ola verde histórica en la primera vuelta.",
  },
  2014: {
    title: "El plebiscito por la paz anticipada",
    blurb: "Santos se reelige tras perder la primera vuelta frente a Zuluaga. La campaña queda marcada por el debate sobre los diálogos con las FARC en La Habana.",
  },
  2018: {
    title: "El primer cara a cara izquierda vs. derecha",
    blurb: "Iván Duque, apadrinado por Uribe, gana sobre Gustavo Petro en la primera segunda vuelta polarizada entre la derecha uribista y la izquierda petrista.",
  },
  2022: {
    title: "La izquierda llega al Palacio por primera vez",
    blurb: "Gustavo Petro derrota a Rodolfo Hernández en una segunda vuelta reñida. Es el primer presidente de izquierda en la historia de Colombia.",
  },
};
