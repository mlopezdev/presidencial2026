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

// Paleta por espectro: izquierda=rojos, centro=ámbar/dorado, derecha=azules
export const TOP_CANDIDATES: Candidate[] = [
  { name: "Iván Cepeda",            gender: "M", vice: "Aída Quilcué",            viceGender: "F", party: "Pacto Histórico",        spectrum: "izquierda", color: "#C0392B", lede: "La fuerza de la vida y el cambio continúa." },
  { name: "Abelardo de la Espriella",gender: "M", vice: "José Manuel Restrepo",    viceGender: "M", party: "Defensores de la Patria", spectrum: "derecha",   color: "#1D4ED8", lede: "Firme por la patria." },
  { name: "Paloma Valencia",         gender: "F", vice: "Juan Daniel Oviedo",      viceGender: "M", party: "Centro Democrático",      spectrum: "derecha",   color: "#2563EB", lede: "Sí podemos hacerlo juntos por Colombia." },
  { name: "Claudia López",           gender: "F", vice: "Leonardo Huerta",         viceGender: "M", party: "Con Claudia Imparables",  spectrum: "centro",    color: "#D97706", lede: "Con Claudia, imparables." },
  { name: "Sergio Fajardo",          gender: "M", vice: "Edna Bonilla",            viceGender: "F", party: "Dignidad y Compromiso",   spectrum: "centro",    color: "#B45309", lede: "Diferentes sin ser enemigos." },
  { name: "Miguel Uribe Londoño",    gender: "M", vice: "Luisa Fernanda Villegas", viceGender: "F", party: "Partido Demócrata",       spectrum: "derecha",   color: "#1E40AF", lede: "Trabajando por una sola Colombia." },
];

export const OTHER_CANDIDATES: Candidate[] = [
  { name: "Santiago Botero",  gender: "M", vice: "Carlos Fernando Cuevas",  viceGender: "M", party: "Romper el Sistema",           spectrum: "centro",    color: "#CA8A04", lede: "Es hora de romper el sistema." },
  { name: "Mauricio Lizcano", gender: "M", vice: "Pedro de la Torre",        viceGender: "M", party: "Firme con Lizcano",           spectrum: "centro",    color: "#A16207", lede: "Firme con Lizcano: resultados que se ven." },
  { name: "Roy Barreras",     gender: "M", vice: "Martha Lucía Zamora",      viceGender: "F", party: "La Fuerza de la Paz",         spectrum: "centro",    color: "#F59E0B", lede: "La fuerza de la paz y el consenso." },
  { name: "Sondra Macollins", gender: "F", vice: "Leonardo Karam",           viceGender: "M", party: "La Abogada de Hierro",        spectrum: "derecha",   color: "#3B82F6", lede: "Justicia para todos." },
  { name: "Gustavo Matamoros",gender: "M", vice: "Mila María Paz",           viceGender: "F", party: "Partido Ecologista",          spectrum: "derecha",   color: "#2E4BA8", lede: "Por nuestra tierra y nuestro futuro." },
];

export const ALL_CANDIDATES: Candidate[] = [...TOP_CANDIDATES, ...OTHER_CANDIDATES];

// Mapa de fotos disponibles en /public/candidates
export const CANDIDATE_PHOTOS: Record<string, string> = {
  "Abelardo de la Espriella": "/candidates/Abelardo.png",
  "Claudia López": "/candidates/Clauida Lopez.png",
  "Gustavo Matamoros": "/candidates/Matamoros.png",
  "Iván Cepeda": "/candidates/cepeda.png",
  "Miguel Uribe Londoño": "/candidates/Miguel Uribe.png",
  "Mauricio Lizcano": "/candidates/Oscar_MAuricio_Lizcano.png",
  "Paloma Valencia": "/candidates/Paloma_Valencia.png",
  "Roy Barreras": "/candidates/Roy_Barreras.png",
  "Santiago Botero": "/candidates/Santiago_Botero.png",
  "Sondra Macollins": "/candidates/Sondra.png",
  "Sergio Fajardo": "/candidates/Fajaro-removebg-preview.png",
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
      { title: "Salud sin intermediación financiera privada", desc: "Consolidar un modelo enfocado en la prevención comunitaria, eliminando la intermediación financiera privada." },
      { title: "Salud mental en el ámbito educativo", desc: "Rutas de Alertas Tempranas y atención psicosocial obligatoria para jóvenes en colegios y universidades." },
      { title: "Integración de la medicina tradicional", desc: "Incorporar el Sistema Indígena de Salud (SISPI) y prácticas de medicina tradicional al esquema territorial." },
    ],
    Economía: [
      { title: "Fondo Nacional por el Derecho al Agua", desc: "Priorizar acueductos comunitarios y saneamiento básico en el campo colombiano." },
      { title: "30.000 km de vías terciarias", desc: "Plan Nacional de Vías Terciarias ejecutado directamente por las Juntas de Acción Comunal." },
      { title: "Comunidades Energéticas", desc: "Financiar infraestructura solar y eólica local y prohibir expresamente el fracking." },
      { title: "IA para transparencia en contratación", desc: "Modernizar portales estatales con cruce de bases de datos para emitir alertas tempranas de corrupción." },
    ],
    Educación: [
      { title: "Subsidios integrales contra la deserción", desc: "Apoyos económicos de transporte, alimentación y sostenimiento para estudiantes de sectores vulnerables." },
      { title: "Métricas de calidad académica", desc: "Estándares estrictos de evaluación para todos los grados y niveles del sistema educativo." },
      { title: "Educación pública + primer empleo", desc: "Fortalecer la educación pública incluyente e integrar el programa 'Estado Joven' para inserción laboral juvenil." },
    ],
    Seguridad: [
      { title: "Seguridad Humana estructural", desc: "Abordar el desempleo y la pobreza territorial como mecanismo de prevención del delito." },
      { title: "Paz condicionada al respeto civil", desc: "Continuar diálogos de paz solo si se respeta irrestrictamente a la población civil y se aplica justicia restaurativa." },
      { title: "Macrocorrupción como amenaza de seguridad", desc: "Elevar la lucha contra la macrocorrupción a asunto de seguridad nacional, persiguiendo sus finanzas criminales." },
    ],
  },
  "Miguel Uribe Londoño": {
    Salud: [
      { title: "Pago inmediato de deuda con hospitales", desc: "Saldar la billonaria deuda acumulada del Estado con clínicas y hospitales para normalizar la entrega de medicamentos." },
      { title: "Sistema mixto sin estatización", desc: "Defender el modelo mixto rechazando la estatización absoluta para evitar corrupción y politiquería con los recursos médicos." },
      { title: "Dignificación del personal médico", desc: "Mejorar las condiciones laborales y salariales de médicos, enfermeras y especialistas en todo el país." },
    ],
    Economía: [
      { title: "Plan de choque vial para el campo", desc: "Mejorar y pavimentar al menos el 24% de las vías terciarias para abaratar costos agrícolas y conectar regiones." },
      { title: "Bonos Verdes y Azules", desc: "Emitir bonos para atraer capital privado internacional y cofinanciar obras de infraestructura de alto impacto social." },
      { title: "Reactivación de hidrocarburos y minería", desc: "Reactivar la exploración para financiar obras públicas y la transición energética sin nuevos impuestos." },
      { title: "Muralla Digital 4.0", desc: "IA para rastrear y auditar la contratación estatal y eliminar la corrupción burocrática." },
    ],
    Educación: [
      { title: "Protección contra el adoctrinamiento", desc: "Blindar escuelas y colegios públicos priorizando una educación basada en principios y valores éticos." },
      { title: "Pensum alineado con el sector privado", desc: "Ajustar técnicamente los planes de estudio a las demandas reales del empresariado para garantizar inserción laboral rápida." },
      { title: "Oportunidades para grupos vulnerables", desc: "Políticas focalizadas en formación para mujeres, jóvenes y adultos mayores vulnerables." },
    ],
    Seguridad: [
      { title: "Restauración de la Seguridad Democrática", desc: "Eliminar concesiones políticas a grupos armados y ordenar el uso de la fuerza legítima del Estado." },
      { title: "Reforma penal contra la impunidad", desc: "Garantizar que los criminales cumplan condenas completas, acabando con la excarcelación exprés." },
      { title: "Prohibición del consumo de drogas en espacios públicos", desc: "Desarticular las rentas del microtráfico y proteger a las familias del entorno del consumo." },
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
  "Mauricio Lizcano": {
    Salud: [
      { title: "Giro directo a hospitales", desc: "Recursos del Estado directamente a hospitales y clínicas, sin intermediación financiera de las EPS." },
      { title: "EPS solo como administradoras logísticas", desc: "Retirar a las EPS la intermediación financiera y el manejo de la UPC; transformarlas en administradoras de referencia médica." },
      { title: "Telemedicina e IA para destrabar el sistema", desc: "Uso de telemedicina e IA para asignar citas, declarar emergencias logísticas y resolver cuellos de botella en medicamentos." },
    ],
    Economía: [
      { title: "Recorte burocrático de 40-45 billones", desc: "Eliminar gasto burocrático del Estado para generar caja y confianza inversionista, sin nuevas reformas tributarias." },
      { title: "'Estartazo' económico: crecer al 6-7%", desc: "Meta de crecimiento del PIB transformando a Colombia en productor de tecnología e innovación." },
      { title: "Reactivación con 'Mi Casa Ya'", desc: "Inyección de recursos al programa de vivienda para dinamizar 37 industrias derivadas de la construcción." },
      { title: "Data Centers y soberanía digital", desc: "Atraer inversión para construir Data Centers nacionales y reducir dependencia de monopolios tecnológicos extranjeros." },
    ],
    Educación: [
      { title: "Creadores, no consumidores de tecnología", desc: "Transición del modelo educativo para formar en programación, IA y ciberseguridad desde las aulas." },
      { title: "750.000 nuevos cupos de educación superior", desc: "Distribuidos equitativamente entre el SENA, universidades públicas y privadas." },
      { title: "Reforma anticorrupción al PAE", desc: "Garantizar alimentación escolar los 365 días del año eliminando la corrupción en el programa." },
    ],
    Seguridad: [
      { title: "10 millones de cámaras con IA", desc: "Choque tecnológico con reconocimiento facial y georreferenciación obligatoria en el transporte público." },
      { title: "Fin de la 'Paz Total' como incentivo", desc: "Devolver a la Fuerza Pública la ofensiva operativa, las garantías jurídicas y la moral institucional." },
      { title: "Reforma a la justicia contra la impunidad", desc: "Agilizar procesos y lograr condenas efectivas para evitar la excarcelación exprés en casos de flagrancia." },
    ],
  },
  "Sondra Macollins": {
    Salud: [
      { title: "Información por confirmar", desc: "Las propuestas oficiales en este eje están en proceso de consolidación. Se actualizarán cuando estén verificadas." },
    ],
    Economía: [
      { title: "Información por confirmar", desc: "Las propuestas oficiales en este eje están en proceso de consolidación. Se actualizarán cuando estén verificadas." },
    ],
    Educación: [
      { title: "Información por confirmar", desc: "Las propuestas oficiales en este eje están en proceso de consolidación. Se actualizarán cuando estén verificadas." },
    ],
    Seguridad: [
      { title: "Justicia para todos", desc: "Énfasis en seguridad ciudadana y modernización del sistema de justicia, en línea con su perfil profesional. Propuestas detalladas por publicar." },
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
  "Santiago Botero":          { econ:  0.25, social:  0.00 },
  "Mauricio Lizcano":         { econ:  0.32, social:  0.05 },
  "Roy Barreras":             { econ: -0.20, social: -0.30 },
  "Sondra Macollins":         { econ:  0.60, social:  0.75 },
  "Gustavo Matamoros":        { econ:  0.40, social:  0.45 },
};

export const TIMELINES: Record<string, { y: string; t: string; d: string }[]> = {
  "Iván Cepeda": [
    { y: "—",    t: "Formación académica", d: "Filósofo y especialista en Derecho Internacional Humanitario. Histórico defensor de derechos humanos en Colombia." },
    { y: "1994", t: "Cofundador de MOVICE", d: "Co-funda el Movimiento Nacional de Víctimas de Crímenes de Estado." },
    { y: "2010", t: "Representante a la Cámara", d: "Elegido por Bogotá; inicia su labor legislativa en defensa de víctimas y memoria histórica." },
    { y: "2014", t: "Senador de la República", d: "Ocupa curul en el Senado y profundiza su trabajo en derechos humanos y paz." },
    { y: "2016", t: "Facilitador del Acuerdo de Paz", d: "Rol clave en el proceso de paz de La Habana que culminó en el Acuerdo de 2016." },
    { y: "oct. 2025", t: "Candidato oficial del Pacto Histórico", d: "Gana la consulta interna del Pacto Histórico y se consolida como candidato presidencial para 2026, en alianza con sectores de la Alianza Verde." },
  ],
  "Miguel Uribe Londoño": [
    { y: "—",    t: "Formación académica", d: "Economista, abogado y empresario antioqueño con amplia trayectoria en el sector privado." },
    { y: "1979", t: "Secretario Económico de la Presidencia", d: "Cargo en la alta administración pública (1979–1982)." },
    { y: "1990", t: "Senador de la República", d: "Ocupa curul en el Senado (1990–1991)." },
    { y: "2025", t: "Asume las banderas de su hijo", d: "Tras el asesinato del senador Miguel Uribe Turbay, decide continuar su legado político." },
    { y: "2025", t: "Expulsado del Centro Democrático", d: "Tras ser excluido del proceso interno del partido, inscribe su candidatura presidencial para 2026 avalado por el Partido Demócrata Colombiano junto a Luisa Fernanda Villegas." },
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
  "Mauricio Lizcano": [
    { y: "—", t: "Formación académica", d: "Abogado con maestría en Administración Pública (MPA) de Harvard y MBA del MIT." },
    { y: "—", t: "Representante a la Cámara", d: "Inicia su carrera legislativa como congresista." },
    { y: "—", t: "Senador de la República", d: "Varios periodos en el Senado." },
    { y: "2016", t: "Presidente del Congreso", d: "Elegido Presidente del Senado, máxima autoridad del poder legislativo (2016–2017)." },
    { y: "2022", t: "Director del DAPRE", d: "Jefe del Departamento Administrativo de la Presidencia bajo el gobierno Petro (2022–2023)." },
    { y: "2023", t: "Ministro TIC", d: "Impulsa el despliegue de redes 5G, capacitación digital masiva y digitalización del Estado (2023–2025)." },
    { y: "2025", t: "Candidato presidencial", d: "Renuncia en enero de 2025 y lanza la 'Revolución del Sentido Común', avalado por firmas, el partido ASI y la coalición F.A.M.I.L.I.A." },
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

export interface DofaEntry {
  fortalezas: string[];
  oportunidades: string[];
  debilidades: string[];
  amenazas: string[];
}

export const DOFA_DATA: Record<string, DofaEntry> = {
  "Miguel Uribe Londoño": {
    fortalezas: [
      "Fuerte conexión emocional, empatía y respeto ciudadano derivados de su tragedia personal y su resiliencia.",
      "Sólida experiencia mixta: conocimiento de primera mano en la creación de empleo privado y experiencia en la alta administración pública.",
      "Su ruptura con el expresidente Uribe le otorga independencia frente al establecimiento tradicional de la derecha.",
    ],
    oportunidades: [
      "Capitalizar el miedo y la frustración ciudadana ante el deterioro de la seguridad pública y el estancamiento económico del país.",
      "Atraer a un sector del empresariado y de votantes de derecha que buscan una figura de autoridad moral distinta a los líderes partidistas habituales.",
    ],
    debilidades: [
      "Su avanzada edad y el largo tiempo que permaneció alejado de la primera línea electoral antes de reemplazar a su hijo.",
      "Ausencia del respaldo de una maquinaria política nacional poderosa, dependiendo de un partido minoritario y emergente.",
    ],
    amenazas: [
      "La profunda fragmentación de la derecha, donde compite contra figuras mediáticas que dividen su base natural de votantes.",
      "El riesgo de invisibilización mediática durante la contienda, evidenciado en sus recursos legales para no ser excluido de los debates televisados.",
    ],
  },
  "Iván Cepeda": {
    fortalezas: [
      "Indiscutible autoridad moral y liderazgo entre víctimas, defensores de derechos humanos, sindicatos y sectores campesinos.",
      "Sólido respaldo orgánico de la coalición de gobierno y aliados de centro-izquierda.",
      "Gran capacidad argumentativa y experiencia política y técnica probada en procesos de paz.",
    ],
    oportunidades: [
      "Capitalizar la necesidad histórica de desarrollo agrario para movilizar masivamente el voto rural.",
      "Enarbolar la bandera anticorrupción institucional para captar el voto de opinión inconforme con la política tradicional.",
    ],
    debilidades: [
      "Hereda naturalmente el desgaste institucional, las críticas y la polarización del gobierno de Gustavo Petro.",
      "Su figura genera un alto nivel de rechazo ('antivoto') en el sector corporativo, gremial y en la derecha política.",
    ],
    amenazas: [
      "Unificación y reagrupación estratégica de los sectores de derecha en segunda vuelta bajo discursos de 'mano dura'.",
      "Alta exposición a elaboradas campañas de guerra sucia y desinformación impulsadas por Inteligencia Artificial (deepfakes).",
    ],
  },
  "Mauricio Lizcano": {
    fortalezas: [
      "Amplio conocimiento de la filigrana del Estado (experiencia legislativa y ejecutiva).",
      "Resultados tangibles recientes como exministro TIC (despliegue de tecnología 5G y capacitación digital masiva).",
      "Dominio experto de temas de vanguardia global (IA, economía digital, ciberseguridad).",
    ],
    oportunidades: [
      "Profundo agotamiento del electorado frente a los discursos de odio y la polarización extrema.",
      "La necesidad urgente de modernización y reactivación económica del país a través de la industria tecnológica.",
    ],
    debilidades: [
      "Desconfianza y estigma en sectores empresariales y de derecha por su participación en la primera mitad del gobierno de Gustavo Petro.",
      "No cuenta con el respaldo de una maquinaria política nacional unificada y tradicional.",
    ],
    amenazas: [
      "La tendencia histórica del electorado colombiano hacia el 'voto útil' (votar con miedo hacia los extremos), que debilita a los candidatos de centro.",
      "El complejo panorama de déficit fiscal que podría limitar la financiación de grandes proyectos de infraestructura.",
    ],
  },
};
