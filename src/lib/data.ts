export type Spectrum = "izquierda" | "centro" | "derecha";

export interface Candidate {
  name: string;
  gender: "M" | "F";
  vice: string;
  viceGender: "M" | "F";
  party: string;
  spectrum: Spectrum;
  color: string;
  lede: string;
}

export const TOP_CANDIDATES: Candidate[] = [
  { name: "Iván Cepeda", gender: "M", vice: "Aída Quilcué", viceGender: "F", party: "Pacto Histórico", spectrum: "izquierda", color: "#B8860B", lede: "La fuerza de la vida y el cambio continúa." },
  { name: "Abelardo de la Espriella", gender: "M", vice: "José Manuel Restrepo", viceGender: "M", party: "Defensores de la Patria", spectrum: "derecha", color: "#B3261E", lede: "Firme por la patria." },
  { name: "Paloma Valencia", gender: "F", vice: "Juan Daniel Oviedo", viceGender: "M", party: "Centro Democrático", spectrum: "derecha", color: "#2F6B8A", lede: "Sí podemos hacerlo juntos por Colombia." },
  { name: "Claudia López", gender: "F", vice: "Leonardo Huerta", viceGender: "M", party: "Con Claudia Imparables", spectrum: "centro", color: "#1F6E4A", lede: "Con Claudia, imparables." },
  { name: "Sergio Fajardo", gender: "M", vice: "Edna Bonilla", viceGender: "F", party: "Dignidad y Compromiso", spectrum: "centro", color: "#5B3A8B", lede: "Diferentes sin ser enemigos." },
  { name: "Miguel Uribe Londoño", gender: "M", vice: "Luisa Fernanda Villegas", viceGender: "F", party: "Partido Demócrata", spectrum: "derecha", color: "#2E4BA8", lede: "Trabajando por una sola Colombia." },
  { name: "Luis Gilberto Murillo", gender: "M", vice: "Luz María Zapata", viceGender: "F", party: "Luis Gilberto Soy Yo", spectrum: "centro", color: "#1E5B3A", lede: "No soy el candidato de ningún político." },
];

export const OTHER_CANDIDATES: Candidate[] = [
  { name: "Santiago Botero", gender: "M", vice: "Carlos Fernando Cuevas", viceGender: "M", party: "Romper el Sistema", spectrum: "centro", color: "#4B5563", lede: "Es hora de romper el sistema." },
  { name: "Mauricio Lizcano", gender: "M", vice: "Pedro de la Torre", viceGender: "M", party: "Firme con Lizcano", spectrum: "centro", color: "#6B8E23", lede: "Firme con Lizcano: resultados que se ven." },
  { name: "Roy Barreras", gender: "M", vice: "Martha Lucía Zamora", viceGender: "F", party: "La Fuerza de la Paz", spectrum: "centro", color: "#B3261E", lede: "La fuerza de la paz y el consenso." },
  { name: "Carlos Caicedo", gender: "M", vice: "Nelson Alarcón", viceGender: "M", party: "Fuerza Ciudadana", spectrum: "izquierda", color: "#C2410C", lede: "El cambio es con la gente." },
  { name: "Sondra Macollins", gender: "F", vice: "Leonardo Karam", viceGender: "M", party: "La Abogada de Hierro", spectrum: "derecha", color: "#6B2D5C", lede: "Justicia para todos." },
  { name: "Gustavo Matamoros", gender: "M", vice: "Mila María Paz", viceGender: "F", party: "Partido Ecologista", spectrum: "izquierda", color: "#2E7D32", lede: "Por nuestra tierra y nuestro futuro." },
  { name: "Clara López", gender: "F", vice: "María Consuelo del Río", viceGender: "F", party: "Esperanza Democrática", spectrum: "izquierda", color: "#722F37", lede: "Esperanza democrática para el pueblo." },
];

export const ALL_CANDIDATES: Candidate[] = [...TOP_CANDIDATES, ...OTHER_CANDIDATES];

// Mapa de fotos disponibles en /public/candidates
export const CANDIDATE_PHOTOS: Record<string, string> = {
  "Iván Cepeda": "/candidates/cepeda.png",
  "Luis Gilberto Murillo": "/candidates/Luis_GIlberto_Murillo.png",
  "Paloma Valencia": "/candidates/Paloma_Valencia.png",
  "Roy Barreras": "/candidates/Roy_Barreras.png",
  "Santiago Botero": "/candidates/Santiago_Botero.png",
  "Sondra Macollins": "/candidates/Sondra.png",
  "Mauricio Lizcano": "/candidates/Oscar_MAuricio_Lizcano.png",
};

const normalizeCandidateName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const CANDIDATE_PHOTOS_NORMALIZED = Object.fromEntries(
  Object.entries(CANDIDATE_PHOTOS).map(([name, path]) => [normalizeCandidateName(name), path]),
);

export function getCandidatePhoto(name: string): string | undefined {
  return CANDIDATE_PHOTOS[name] ?? CANDIDATE_PHOTOS_NORMALIZED[normalizeCandidateName(name)];
}

export const AXES = [
  { key: "Salud", desc: "Cobertura, reforma del sistema, prevención y atención rural." },
  { key: "Economía", desc: "Impuestos, productividad, inversión y generación de empleo." },
  { key: "Educación", desc: "Acceso, calidad, tecnología y formación para el trabajo." },
  { key: "Seguridad", desc: "Control territorial, justicia, prevención y paz." },
] as const;

export type AxisKey = (typeof AXES)[number]["key"];

interface Proposal { title: string; desc: string; }
type CompareEntry = Record<AxisKey, Proposal[]>;

export const COMPARE_DATA: Record<string, CompareEntry> = {
  "Iván Cepeda": {
    Salud: [
      { title: "Reforma al sistema de salud", desc: "Sistema mixto. Reforma urgente sin esperar, pues la inacción afecta vidas." },
      { title: "Continuidad sanitaria", desc: "Profundizar las reformas sociales del gobierno Petro en salud." },
    ],
    Economía: [
      { title: "Capitalismo productivo", desc: "Orientar empresas hacia la producción sin restringir al sector privado." },
      { title: "Austeridad del gasto", desc: "Reducción del sueldo presidencial y del gabinete, hacia bienestar social." },
      { title: "Reforma agraria", desc: "Territorios rurales prósperos integrados a mercados urbanos." },
    ],
    Educación: [
      { title: "Revolución educativa", desc: "Transformación profunda del sistema educativo como eje democrático." },
      { title: "Movilidad social", desc: "La educación como clave para superar pobreza y marginalización." },
    ],
    Seguridad: [
      { title: "Paz como eje central", desc: "El cambio surge de las conciencias, no de la violencia." },
      { title: "Continuar la Paz Total", desc: "Profundizar los procesos de paz con grupos armados." },
      { title: "Territorios libres", desc: "Zonas rurales sin narcotráfico ni minería ilegal." },
    ],
  },
  "Abelardo de la Espriella": {
    Salud: [
      { title: "Plan de choque 90 días", desc: "Invertir 10 billones para reactivar tratamientos, medicamentos y pagos a hospitales." },
      { title: "Ley de punto final", desc: "Sanear el déficit del sistema con una ley que liquide deudas." },
      { title: "Salud rural", desc: "EPS reestructuradas en zonas sin competencia real." },
    ],
    Economía: [
      { title: "Reducción del Estado", desc: "Recortar 40% del aparato estatal y eliminar 70.000 cargos." },
      { title: "Reforma tributaria", desc: "Eliminar el 4×1.000 y el impuesto a la gasolina." },
      { title: "Crecimiento > 6%", desc: "Infraestructura, vivienda, agroindustria, turismo, hidrocarburos." },
    ],
    Educación: [
      { title: "Jornada escolar rural", desc: "Triplicar la jornada escolar en zonas rurales con alianzas público-privadas." },
      { title: "Empleo juvenil", desc: "Priorizar acceso de jóvenes al empleo formal y la educación." },
    ],
    Seguridad: [
      { title: "Mano dura", desc: "Política de seguridad extrema: cárcel dura o neutralización por Fuerza Pública." },
      { title: "Fumigación de coca", desc: "Fumigar las 330.000 hectáreas de coca con apoyo internacional." },
      { title: "Megacárceles", desc: "Construir 10 megacárceles bajo concesiones privadas." },
    ],
  },
  "Paloma Valencia": {
    Salud: [
      { title: "Puesto de Mando Unificado", desc: "Intervención directa desde la Presidencia para destrabar citas represadas." },
      { title: "Saneamiento financiero", desc: "Titularización para pagar deudas y garantizar atención oportuna." },
      { title: "Telemedicina rural", desc: "Expansión a regiones alejadas para mejorar acceso a servicios." },
    ],
    Economía: [
      { title: "Crecimiento del 5%", desc: "Recuperar confianza inversionista y simplificar impuestos." },
      { title: "Régimen simple", desc: "Un solo impuesto y menos trámites para mipymes y microempresas." },
      { title: "Reducción tributaria", desc: "Bajar impuesto de renta y al patrimonio. Dos días sin IVA." },
    ],
    Educación: [
      { title: "Libre elección del colegio", desc: "Bonos escolares para familias de menores ingresos." },
      { title: "IA desde la básica", desc: "Automatización, inteligencia artificial, robótica y programación." },
    ],
    Seguridad: [
      { title: "Control total del territorio", desc: "El Estado debe volver a controlar el territorio y la ley cumplirse." },
      { title: "Recuperar la autoridad", desc: "Proteger a la población de extorsiones, homicidios y bloqueos." },
      { title: "IA para seguridad", desc: "Control en tiempo real con IA y blockchain." },
    ],
  },
  "Claudia López": {
    Salud: [
      { title: "Rescate financiero urgente", desc: "Primer día: restablecer liquidez a clínicas y hospitales." },
      { title: "Sistema mixto", desc: "Modelo público-privado-comunitario con precios estandarizados." },
      { title: "Historia clínica única", desc: "Tecnología para mejorar atención y eficiencia del sistema." },
    ],
    Economía: [
      { title: "Desarrollo regional", desc: "Inversión pública focalizada para duplicar productividad territorial." },
      { title: "Reducción del IVA", desc: "Bajar del 19% al 15% como reactivación para clase media." },
      { title: "Apoyo a microempresarios", desc: "Subsidio al pago del salario mínimo en microempresas." },
    ],
    Educación: [
      { title: "Un millón de becas", desc: "Plan de becas para educación superior con inserción laboral." },
      { title: "Educación como seguridad", desc: "Becas, manzanas del cuidado y educación básica." },
    ],
    Seguridad: [
      { title: "Justicia implacable", desc: "40.000 nuevos miembros de Fuerza Pública; modernización." },
      { title: "Finanzas del narcotráfico", desc: "Atacar el dinero, no solo la producción." },
      { title: "Fiscalía Antimafia", desc: "Unidad especializada independiente contra crimen organizado." },
    ],
  },
  "Roy Barreras": {
    Salud: [
      { title: "Salud para la vida", desc: "Tecnología, dignificación del personal médico y medicina preventiva." },
      { title: "Estatuto del Trabajador", desc: "Piso salarial nacional y fin de la tercerización permanente." },
      { title: "Incentivos rurales", desc: "Bonificaciones de hasta 50% para médicos en zonas rurales." },
    ],
    Economía: [
      { title: "Construcción como motor", desc: "Dinamizar la actividad productiva y acelerar el empleo." },
      { title: "Escrituración de tierras", desc: "Titular el 50% de tierras sin título para habilitar desarrollo." },
      { title: "Reforma política", desc: "Limpiar el sistema electoral como principal medida anticorrupción." },
    ],
    Educación: [
      { title: "Educación para el trabajo", desc: "Conectada con demandas del mercado laboral." },
      { title: "Escuela Virtual", desc: "Un millón de computadores con conectividad para niñas y jóvenes." },
    ],
    Seguridad: [
      { title: "Unidad nacional", desc: "Gobierno que supere el sectarismo frente a la criminalidad." },
      { title: "Recuperar territorio", desc: "Autoridad del Estado y presencia institucional en todo el país." },
      { title: "Paz profundizada", desc: "Profundizar la implementación del Acuerdo de Paz." },
    ],
  },
  "Sergio Fajardo": {
    Salud: [
      { title: "Sistema mixto eficiente", desc: "Preservar lo que funciona, corregir lo que falla en el sistema actual." },
      { title: "Medicina preventiva", desc: "Inversión en salud pública y prevención de enfermedades crónicas." },
    ],
    Economía: [
      { title: "Economía del conocimiento", desc: "Ciencia, tecnología e innovación como motores del crecimiento." },
      { title: "Formalización laboral", desc: "Incentivos para que más empresas operen en la formalidad." },
    ],
    Educación: [
      { title: "Educación de calidad", desc: "Maestros bien pagados y formados, cobertura universal." },
      { title: "Ciencia y tecnología", desc: "Fortalecer la investigación y el desarrollo desde la escuela." },
    ],
    Seguridad: [
      { title: "Presencia del Estado", desc: "Institucionalidad fuerte en todas las regiones del país." },
      { title: "No al modelo Bukele", desc: "Rechaza políticas de mano dura importadas." },
    ],
  },
  "Luis Gilberto Murillo": {
    Salud: [
      { title: "Salud como derecho", desc: "Garantizar acceso universal, especialmente en comunidades vulnerables." },
      { title: "Atención étnica", desc: "Salud intercultural para comunidades indígenas y afrocolombianas." },
    ],
    Economía: [
      { title: "Economía verde", desc: "Biodiversidad como activo económico para el desarrollo sostenible." },
      { title: "Empleo regional", desc: "Fortalecer las economías locales y reducir las brechas territoriales." },
    ],
    Educación: [
      { title: "Educación pertinente", desc: "Curricula que responden a las necesidades de cada región." },
      { title: "Conectividad rural", desc: "Internet y tecnología para niños en zonas remotas." },
    ],
    Seguridad: [
      { title: "Seguridad humana", desc: "Seguridad entendida como bienestar integral, no solo represión." },
      { title: "Diálogo regional", desc: "Soluciones de paz negociadas con actores locales." },
    ],
  },
};

export const IDEOLOGY_MATRIX: Record<string, { econ: number; social: number }> = {
  "Iván Cepeda":              { econ: -0.85, social: -0.75 },
  "Abelardo de la Espriella": { econ:  0.90, social:  0.85 },
  "Paloma Valencia":          { econ:  0.70, social:  0.70 },
  "Claudia López":            { econ:  0.10, social: -0.55 },
  "Sergio Fajardo":           { econ:  0.05, social: -0.15 },
  "Miguel Uribe Londoño":     { econ:  0.65, social:  0.65 },
  "Luis Gilberto Murillo":    { econ: -0.05, social: -0.25 },
  "Santiago Botero":          { econ:  0.25, social:  0.00 },
  "Mauricio Lizcano":         { econ:  0.20, social:  0.10 },
  "Roy Barreras":             { econ: -0.20, social: -0.30 },
  "Carlos Caicedo":           { econ: -0.55, social: -0.40 },
  "Sondra Macollins":         { econ:  0.60, social:  0.75 },
  "Gustavo Matamoros":        { econ: -0.50, social: -0.60 },
  "Clara López":              { econ: -0.65, social: -0.45 },
};

export const TIMELINES: Record<string, { y: string; t: string; d: string }[]> = {
  "Iván Cepeda": [
    { y: "1994", t: "Cofundador de MOVICE", d: "Movimiento Nacional de Víctimas de Crímenes de Estado." },
    { y: "2010", t: "Elegido Representante a la Cámara", d: "Por Bogotá, bancada del Polo Democrático." },
    { y: "2014", t: "Senador de la República", d: "Inicia su trabajo por memoria histórica y paz." },
    { y: "2016", t: "Acuerdo de Paz de La Habana", d: "Participa activamente en el proceso." },
    { y: "2025", t: "Candidato presidencial", d: "Anuncia su precandidatura por el Pacto Histórico." },
  ],
  "Abelardo de la Espriella": [
    { y: "1990", t: "Abogado penalista", d: "Inicia ejercicio profesional en Córdoba." },
    { y: "2005", t: "Firma de abogados de alto perfil", d: "Reconocimiento mediático nacional." },
    { y: "2020", t: "Figura pública polarizante", d: "Comentarista político frecuente." },
    { y: "2024", t: "Movimiento Defensores de la Patria", d: "Lanza su plataforma política." },
    { y: "2025", t: "Candidato presidencial", d: "Oficializa campaña." },
  ],
  "Paloma Valencia": [
    { y: "2002", t: "Abogada constitucionalista", d: "Ejercicio profesional y academia." },
    { y: "2014", t: "Senadora por Centro Democrático", d: "Primera curul en el Congreso." },
    { y: "2018", t: "Reelegida al Senado", d: "Liderazgo en comisiones clave." },
    { y: "2024", t: "Precandidata presidencial", d: "Anuncia aspiración." },
    { y: "2025", t: "Candidata oficial", d: "Campaña por el Centro Democrático." },
  ],
  "Claudia López": [
    { y: "2006", t: "Columnista y analista política", d: "Reconocida por trabajo anticorrupción." },
    { y: "2014", t: "Senadora por la Alianza Verde", d: "Primera curul en el Senado." },
    { y: "2019", t: "Alcaldesa de Bogotá", d: "Primera mujer electa alcaldesa de la capital." },
    { y: "2023", t: "Finaliza alcaldía", d: "Entrega mandato y anuncia proyecto nacional." },
    { y: "2025", t: "Candidata presidencial", d: "Con Claudia Imparables." },
  ],
  "Roy Barreras": [
    { y: "2002", t: "Representante a la Cámara", d: "Inicia carrera legislativa por el Valle." },
    { y: "2010", t: "Senador de la República", d: "Varios periodos consecutivos." },
    { y: "2016", t: "Negociador del Acuerdo de Paz", d: "Participa en el proceso de La Habana." },
    { y: "2022", t: "Presidente del Congreso", d: "Lidera el Senado en la coalición de gobierno." },
    { y: "2025", t: "Candidato presidencial", d: "Lanza La Fuerza de la Paz." },
  ],
};

export const DEFAULT_TIMELINE = [
  { y: "2005", t: "Carrera profesional", d: "Formación académica y primera actividad pública." },
  { y: "2014", t: "Ingreso a la vida política", d: "Primer cargo electo o de relevancia." },
  { y: "2020", t: "Consolidación", d: "Mayor visibilidad y proyección nacional." },
  { y: "2024", t: "Precandidatura", d: "Anuncio de aspiración presidencial." },
  { y: "2025", t: "Candidatura oficial", d: "Campaña en marcha." },
];

export const HISTORIC_ELECTIONS = [
  {
    year: 2010,
    winner: "Juan Manuel Santos",
    candidates: [
      { name: "Juan Manuel Santos", gender: "M", vice: "Angelino Garzón", viceGender: "M", spectrum: "derecha", party: "Partido de la U" },
      { name: "Antanas Mockus", gender: "M", vice: "Sergio Fajardo", viceGender: "M", spectrum: "centro", party: "Partido Verde" },
      { name: "Germán Vargas Lleras", gender: "M", vice: "Elsa Gladys Cifuentes", viceGender: "F", spectrum: "derecha", party: "Cambio Radical" },
      { name: "Gustavo Petro", gender: "M", vice: "Clara López", viceGender: "F", spectrum: "izquierda", party: "Polo Democrático" },
      { name: "Noemí Sanín", gender: "F", vice: "Juan Lozano", viceGender: "M", spectrum: "derecha", party: "Partido Conservador" },
      { name: "Rafael Pardo", gender: "M", vice: "Aníbal Gaviria", viceGender: "M", spectrum: "centro", party: "Partido Liberal" },
    ],
  },
  {
    year: 2014,
    winner: "Juan Manuel Santos",
    candidates: [
      { name: "Óscar Iván Zuluaga", gender: "M", vice: "Carlos Holmes Trujillo", viceGender: "M", spectrum: "derecha", party: "Centro Democrático" },
      { name: "Juan Manuel Santos", gender: "M", vice: "Germán Vargas Lleras", viceGender: "M", spectrum: "derecha", party: "Partido de la U" },
      { name: "Marta Lucía Ramírez", gender: "F", vice: "Camilo Gómez", viceGender: "M", spectrum: "derecha", party: "Partido Conservador" },
      { name: "Clara López", gender: "F", vice: "Aída Avella", viceGender: "F", spectrum: "izquierda", party: "Polo Democrático" },
      { name: "Enrique Peñalosa", gender: "M", vice: "Isabel Segovia", viceGender: "F", spectrum: "centro", party: "Partido Verde" },
    ],
  },
  {
    year: 2018,
    winner: "Iván Duque",
    candidates: [
      { name: "Iván Duque", gender: "M", vice: "Marta Lucía Ramírez", viceGender: "F", spectrum: "derecha", party: "Centro Democrático" },
      { name: "Gustavo Petro", gender: "M", vice: "Ángela María Robledo", viceGender: "F", spectrum: "izquierda", party: "Colombia Humana" },
      { name: "Sergio Fajardo", gender: "M", vice: "Claudia López", viceGender: "F", spectrum: "centro", party: "Coalición Colombia" },
      { name: "Germán Vargas Lleras", gender: "M", vice: "Luis Felipe Henao", viceGender: "M", spectrum: "derecha", party: "Cambio Radical" },
      { name: "Humberto de la Calle", gender: "M", vice: "Clara López", viceGender: "F", spectrum: "centro", party: "Partido Liberal" },
    ],
  },
  {
    year: 2022,
    winner: "Gustavo Petro",
    candidates: [
      { name: "Gustavo Petro", gender: "M", vice: "Francia Márquez", viceGender: "F", spectrum: "izquierda", party: "Pacto Histórico" },
      { name: "Rodolfo Hernández", gender: "M", vice: "Marelen Castillo", viceGender: "F", spectrum: "derecha", party: "Liga Gobernantes Anticorrupción" },
      { name: "Federico Gutiérrez", gender: "M", vice: "Rodrigo Lara", viceGender: "M", spectrum: "derecha", party: "Equipo por Colombia" },
      { name: "Sergio Fajardo", gender: "M", vice: "Luis Gilberto Murillo", viceGender: "M", spectrum: "centro", party: "Coalición Centro Esperanza" },
      { name: "Íngrid Betancourt", gender: "F", vice: "José Luis Esparza", viceGender: "M", spectrum: "centro", party: "Verde Oxígeno" },
    ],
  },
];
