export type AxisKey = "Salud" | "Economía" | "Educación" | "Seguridad";

export type Proposal = {
  title: string;
  desc: string;
};

export type CandidateProfile = {
  name: string;
  alignment: string;
  proposals: Record<AxisKey, Proposal[]>;
};

export const axisOrder: AxisKey[] = ["Salud", "Economía", "Educación", "Seguridad"];

export const candidateOrder = [
  "Iván Cepeda",
  "Abelardo de la Espriella",
  "Paloma Valencia",
];

export const candidates: CandidateProfile[] = [
  {
    name: "Abelardo de la Espriella",
    alignment: "Derecha / Conservador",
    proposals: {
      Salud: [
        {
          title: "Plan de choque 90 días",
          desc: "Invertir 10 billones de pesos para reactivar tratamientos, entregar medicamentos y pagar a médicos y hospitales.",
        },
        {
          title: "Ley de punto final",
          desc: "Sanear el déficit del sistema (más de 40 billones) mediante una ley de punto final que liquide deudas.",
        },
        {
          title: "Protección de EPS funcionales",
          desc: "Mantener las EPS que funcionan. Las inviables se transforman o salen; abrir puerta a capitalización privada o mixta.",
        },
        {
          title: "Salud rural",
          desc: "Focalizar EPS reestructuradas en zonas sin competencia real, con lógica de suficiencia y continuidad del servicio.",
        },
        {
          title: "Política de prevención",
          desc: "Promover deporte y alimentación sana desde la niñez para reducir enfermedades crónicas.",
        },
      ],
      Economía: [
        {
          title: "Reducción del Estado",
          desc: "Recortar el aparato estatal un 40%, eliminando ~70.000 cargos de funcionarios y contratistas. Expedir 90 decretos el mismo día de posesión.",
        },
        {
          title: "Reforma tributaria",
          desc: "Eliminar el 4×1.000 y el impuesto a la gasolina. Simplificar el sistema tributario sin castigar la actividad productiva.",
        },
        {
          title: "Crecimiento económico",
          desc: "Meta de crecimiento superior al 6% anual. Impulsar infraestructura, vivienda, agroindustria, turismo, industrias creativas, hidrocarburos y minería.",
        },
        {
          title: "Inversión extranjera",
          desc: "Atraer capital con seguridad jurídica y reglas claras. Incentivos tributarios temporales para tecnología e infraestructura.",
        },
        {
          title: "Capitalismo popular",
          desc: "Apoyar al emprendedor como generador de riqueza. Activar círculos virtuosos entre empresa, trabajo y estabilidad nacional.",
        },
        {
          title: "Bloque anticorrupción",
          desc: "Crear estructura operativa presidencial para recuperar $70 billones anuales perdidos en corrupción, con extinción de dominio exprés en 25-30 días.",
        },
        {
          title: "Fracking e hidrocarburos",
          desc: "Apoyar el fracking para aumentar producción de petróleo. 'El fracking es una obra civil; si se hace bien, no sale mal'.",
        },
      ],
      Educación: [
        {
          title: "Revolución educativa rural",
          desc: "Triplicar la jornada escolar en zonas rurales, financiada con alianzas público-privadas.",
        },
        {
          title: "Educación en salud y alimentación",
          desc: "Introducir en la escuela educación sobre alimentación sana y hábitos saludables.",
        },
        {
          title: "Empleo y oportunidades juveniles",
          desc: "Priorizar el acceso de jóvenes al empleo formal y la educación.",
        },
        {
          title: "Deporte como política de Estado",
          desc: "Llevar deporte a niños y jóvenes como política de Estado para reducir carga futura sobre el sistema de salud.",
        },
      ],
      Seguridad: [
        {
          title: "Mano dura contra el crimen",
          desc: "Política de seguridad extremamente estricta: 'Criminal que no se someta debe estar en cárcel dura o ser neutralizado por la Fuerza Pública'.",
        },
        {
          title: "Fumigación de coca",
          desc: "Fumigar de inmediato las 330.000 hectáreas de coca con apoyo de aeronaves de EE.UU.",
        },
        {
          title: "Alianza militar internacional",
          desc: "Renovar cooperación con EE.UU. e Israel. Dotar a la Fuerza Pública de drones y tecnología de punta.",
        },
        {
          title: "Megacárceles",
          desc: "Construir 10 megacárceles en zonas apartadas bajo concesiones privadas de hasta 80 años, inspirado en el modelo Bukele.",
        },
        {
          title: "Porte de armas",
          desc: "Legalizar el porte de armas para ciudadanos responsables como mecanismo de defensa personal y familiar.",
        },
        {
          title: "Fin de la Paz Total",
          desc: "Frenar los procesos de paz con grupos armados. 'La paz no se negocia'.",
        },
        {
          title: "Eliminación de la JEP",
          desc: "Eliminar la Jurisdicción Especial para la Paz por costosa e ineficaz; recursos se destinarían a reducir impuestos.",
        },
      ],
    },
  },
  {
    name: "Claudia López",
    alignment: "Centro / Liberal-progresista",
    proposals: {
      Salud: [
        {
          title: "Rescate financiero urgente",
          desc: "El 7 de agosto, primer día de gobierno, restablecer liquidez a clínicas y hospitales para que medicamentos y tratamientos sean un derecho y no un calvario.",
        },
        {
          title: "Sistema mixto público-privado-comunitario",
          desc: "Modelo de salud mixto entre lo privado, lo público y lo comunitario con precios estandarizados por regiones y niveles de riesgo.",
        },
        {
          title: "Historia clínica única con tecnología",
          desc: "Uso de tecnología para implementar una historia clínica única nacional que mejore la atención y eficiencia del sistema.",
        },
        {
          title: "Salud preventiva como prioridad",
          desc: "La mejor inversión en salud es superar la pobreza extrema: priorizar que 8 millones de colombianos accedan a condiciones dignas de vida.",
        },
      ],
      Economía: [
        {
          title: "Desarrollo regional sin corrupción",
          desc: "Modelo centrado en transformación productiva regional con inversión pública focalizada y apoyo a empresas para duplicar la productividad de cada territorio.",
        },
        {
          title: "Reducción del IVA",
          desc: "Propone bajar el IVA del 19% al 15% como medida de reactivación económica orientada a la clase media y los pequeños negocios.",
        },
        {
          title: "Apoyo a microempresarios",
          desc: "Subsidio orientado a respaldar el pago del salario mínimo en microempresas. Incentivos para que los pequeños negocios no le teman a la formalidad.",
        },
        {
          title: "Actualización catastral",
          desc: "Propone actualización catastral como herramienta de equidad fiscal y fuente de recursos para financiar desarrollo territorial.",
        },
        {
          title: "Regla fiscal estricta",
          desc: "Establecer regla fiscal para impedir gastos descomunales del Gobierno y garantizar disciplina presupuestal.",
        },
        {
          title: "Contratación privada para empleo regional",
          desc: "La mejor inversión estatal es contratar al sector privado para generar empleos no dependientes de alcaldías o gobernaciones.",
        },
      ],
      Educación: [
        {
          title: "Un millón de becas",
          desc: "Plan de un millón de becas para que jóvenes accedan a educación superior con posibilidades de inserción laboral.",
        },
        {
          title: "Educación como eje de seguridad",
          desc: "La seguridad es educación para niños, becas para jóvenes y manzanas del cuidado para mujeres.",
        },
        {
          title: "Educación, salud y servicios como pilares",
          desc: "Educación, protección social, salud y servicios públicos son los pilares para generar mayor inversión y movilidad social.",
        },
      ],
      Seguridad: [
        {
          title: "Justicia implacable contra mafias",
          desc: "Justicia implacable contra mafias con fortalecimiento de la Fuerza Pública: 40.000 nuevos miembros, modernización y profesionalización de soldados y policías.",
        },
        {
          title: "Ataque a las finanzas del narcotráfico",
          desc: "Política de seguridad centrada en atacar las finanzas del narcotráfico, no solo la producción.",
        },
        {
          title: "Justicia restaurativa comunitaria",
          desc: "Justicia restaurativa que brinde soluciones comunitarias y tome en serio las segundas oportunidades junto al control territorial con legitimidad democrática.",
        },
        {
          title: "Fiscalía Antimafia y Anticorrupción",
          desc: "Crear una Fiscalía Antimafia y Anticorrupción como unidad especializada independiente para combatir criminalidad organizada y corrupción.",
        },
        {
          title: "Sistema carcelario diferenciado",
          desc: "Establecer sistema carcelario diferenciado para evitar que prisiones funcionen como centros de coordinación delictiva.",
        },
      ],
    },
  },
  {
    name: "Iván Cepeda",
    alignment: "Izquierda / Pacto Histórico",
    proposals: {
      Salud: [
        {
          title: "Reforma al sistema de salud",
          desc: "Sistema de salud mixto. Necesidad urgente de reforma sin esperar, pues puede morir mucha gente por la inacción del gobierno en la aprobación de cambios estructurales.",
        },
        {
          title: "Continuidad de reformas sanitarias",
          desc: "Profundizar las reformas sociales del gobierno Petro en salud. El centro del programa es la política social.",
        },
      ],
      Economía: [
        {
          title: "Capitalismo productivo",
          desc: "Buscar un capitalismo productivo que no afecte el modelo actual y no ataque al sector empresarial. No restringir las empresas sino orientarlas hacia la producción.",
        },
        {
          title: "Austeridad del gasto público",
          desc: "Plan de austeridad: reducción del propio sueldo y del gabinete, orientando el ahorro de funcionamiento hacia el bienestar social.",
        },
        {
          title: "Superación del neoliberalismo",
          desc: "Propone superar el modelo neoliberal que, según Cepeda, presentó la reducción del Estado como modernidad pero produjo acumulación corrupta de capital.",
        },
        {
          title: "Continuidad de reformas sociales",
          desc: "Continuar las reformas del gobierno Petro y profundizar las transformaciones sociales comenzadas. 'Yo seré el sucesor de Gustavo Petro'.",
        },
        {
          title: "Reforma agraria productiva",
          desc: "Revolución agraria orientada a convertir territorios rurales en zonas prósperas integradas a mercados urbanos e internacionales para abaratar alimentos.",
        },
        {
          title: "Erradicación del hambre",
          desc: "Superar la inseguridad alimentaria mediante revolución agraria que fortalezca la economía campesina y sus vínculos con mercados populares urbanos.",
        },
      ],
      Educación: [
        {
          title: "Revolución educativa",
          desc: "Transformación profunda del sistema educativo como parte de las tres revoluciones democráticas para transformar la nación.",
        },
        {
          title: "Educación y movilidad social",
          desc: "La educación es clave para superar la pobreza y la marginalización. Colombia no solo despoja de tierras y derechos; también despoja de humanidad.",
        },
        {
          title: "Poder constituyente educativo",
          desc: "Impulsar un proceso amplio de participación, deliberación y acción política en el que la ciudadanía sea sujeto activo del cambio educativo.",
        },
      ],
      Seguridad: [
        {
          title: "Paz como eje central",
          desc: "La revolución debe ser pacífica: el cambio no surge de la violencia sino de las conciencias y la imaginación del pueblo colombiano.",
        },
        {
          title: "Continuar la Paz Total",
          desc: "Continuar y profundizar los procesos de paz con grupos armados. Opuesto a la política de seguridad basada exclusivamente en la fuerza.",
        },
        {
          title: "Territorios rurales libres de violencia",
          desc: "Convertir territorios rurales en zonas prósperas, libres de narcotráfico y minería ilegal, mediante desarrollo económico y social.",
        },
        {
          title: "Anticorrupción como seguridad",
          desc: "Proteger los recursos del agua y del Estado de la corrupción. Castigos severos para actos de corrupción.",
        },
      ],
    },
  },
  {
    name: "Paloma Valencia",
    alignment: "Derecha / Centro Democrático",
    proposals: {
      Salud: [
        {
          title: "Puesto de Mando Unificado presidencial",
          desc: "Intervención directa con PMU permanente desde la Presidencia para destrabar citas y procedimientos represados.",
        },
        {
          title: "Saneamiento financiero del sistema",
          desc: "Sanear financieramente el sistema con titularización para pagar deudas y garantizar atención oportuna.",
        },
        {
          title: "Hospitales padrinos en los territorios",
          desc: "Llevar hospitales padrinos a los territorios para garantizar atención en toda Colombia, especialmente en zonas rurales.",
        },
        {
          title: "Telemedicina rural",
          desc: "Expansión de la telemedicina en zonas rurales para mejorar el acceso a los servicios de salud en regiones alejadas.",
        },
        {
          title: "Alianza público-privada en salud",
          desc: "El sistema debe sostenerse en una alianza público-privada con supervisión del Estado para garantizar calidad y cobertura.",
        },
      ],
      Economía: [
        {
          title: "Crecimiento del 5%",
          desc: "Recuperar la confianza inversionista, simplificar impuestos y alcanzar un crecimiento del 5% anual del PIB.",
        },
        {
          title: "Reducción de impuestos al sector productivo",
          desc: "Reducir la carga sobre el sector productivo, bajar impuesto de renta y reducir el impuesto al patrimonio. Promover dos días sin IVA para productos colombianos.",
        },
        {
          title: "Régimen simple para mipymes",
          desc: "Modificar la Ley Escalera de la Formalidad para consolidar un esquema de un solo impuesto y menos trámites para mipymes y microempresas.",
        },
        {
          title: "Refinanciación de la deuda pública",
          desc: "Refinanciar la deuda pública con cooperación internacional para liberar recursos y mejorar la sostenibilidad fiscal del Estado.",
        },
        {
          title: "Estrategia de crédito abierto",
          desc: "Gran comunidad de crédito con cámaras de comercio y mini-régimen simple que garantice cobertura a los pequeños empresarios.",
        },
        {
          title: "Economía sin odio de clases",
          desc: "Un país que se enriquezca para que todos puedan vivir con ingresos dignos. Una economía fraterna, con garantías para la inversión y mejores salarios.",
        },
      ],
      Educación: [
        {
          title: "Libre elección del colegio",
          desc: "Las familias de menores ingresos podrán elegir el colegio de sus hijos entre instituciones públicas o privadas financiadas por el Estado mediante bonos escolares.",
        },
        {
          title: "IA y tecnología desde la educación básica",
          desc: "Incorporar desde la educación básica contenidos de automatización, inteligencia artificial, robótica y programación.",
        },
        {
          title: "Formación por competencias para el empleo",
          desc: "Programas de formación orientados al empleo y conectados con las demandas del mercado laboral.",
        },
        {
          title: "Educación como mayor inequidad",
          desc: "La mayor inequidad en Colombia es la educación. El foco será lograr formación de calidad para todos los niños colombianos.",
        },
      ],
      Seguridad: [
        {
          title: "Control total del territorio",
          desc: "'Colombia no puede seguir viviendo con miedo.' El Estado debe volver a controlar el territorio y la ley cumplirse en cada rincón del país.",
        },
        {
          title: "Recuperación de la autoridad",
          desc: "Lo más urgente: asegurar que la población no sea víctima de extorsiones, homicidios ni actos de violencia como la voladura de pueblos o el bloqueo de vías.",
        },
        {
          title: "Inteligencia artificial para la seguridad",
          desc: "Modelo de control en tiempo real con herramientas tecnológicas, incluyendo IA y blockchain, para combatir el crimen y la corrupción.",
        },
      ],
    },
  },
  {
    name: "Roy Barreras",
    alignment: "Centro-izquierda / Frente por la Vida",
    proposals: {
      Salud: [
        {
          title: "Salud para la vida: de la ley a la realidad",
          desc: "Fortalecer el sistema sanitario con tecnología, dignificación del personal médico y enfoque en medicina preventiva.",
        },
        {
          title: "Reforma urgente del sistema de salud",
          desc: "Reforma necesaria con un sistema mixto. No se puede esperar al 7 de agosto por la crisis humanitaria actual.",
        },
        {
          title: "Estatuto del Trabajador de la Salud",
          desc: "Incluye piso salarial nacional, fin de la contratación por prestación de servicios para funciones permanentes y carrera sanitaria basada en méritos.",
        },
        {
          title: "Incentivos para médicos rurales",
          desc: "Bonificaciones de hasta 50%, subsidios de vivienda y beneficios académicos para médicos que trabajen en zonas rurales.",
        },
        {
          title: "Gas natural para evitar apagón energético-sanitario",
          desc: "Transformar el sistema eléctrico, sanear deudas y garantizar mínimo vital eléctrico para evitar crisis sanitaria.",
        },
      ],
      Economía: [
        {
          title: "Reactivación económica por construcción",
          desc: "La construcción es el motor más inmediato para dinamizar la actividad productiva y acelerar la generación de empleo.",
        },
        {
          title: "Aumento de productividad e inversión",
          desc: "Si el país no aumenta su productividad y la confianza del sector privado, no habrá con qué pagar la deuda social. Atraer inversión con estabilidad y reglas claras.",
        },
        {
          title: "Reactivación de cadenas productivas",
          desc: "Generar empleo ahora reactivando las cadenas productivas. La educación es clave y hay que tener confianza para reactivar la economía.",
        },
        {
          title: "Escrituración masiva de tierras",
          desc: "El 50% de la tierra no tiene título de propiedad; escriturar la tierra no escriturada para habilitar el desarrollo productivo eficaz.",
        },
        {
          title: "Reforma política anticorrupción",
          desc: "'Este sistema político electoral es desastroso'. Reforma política que limpie la política. Es la principal medida anticorrupción.",
        },
        {
          title: "Turismo y economía minera",
          desc: "Recuperar la economía minera. Colombia tiene reservas de cobre y níquel comparables a las de Perú y Chile. Apuesta por turismo de clase mundial.",
        },
      ],
      Educación: [
        {
          title: "Educación para el trabajo",
          desc: "Fortalecer la educación orientada al trabajo conectada con las demandas del mercado laboral y las necesidades productivas del país.",
        },
        {
          title: "Escuela Virtual para mujeres",
          desc: "Escuela Virtual de Colombia para niñas y jóvenes con entrega de un millón de computadores con conectividad.",
        },
        {
          title: "Centros de emprendimiento femenino",
          desc: "Centros comunitarios donde las mujeres puedan estudiar, desarrollar negocios y recibir orientación profesional.",
        },
        {
          title: "El poder de la cultura",
          desc: "Fortalecer la formación artística y cultural desde la educación básica como eje de identidad y cohesión nacional.",
        },
      ],
      Seguridad: [
        {
          title: "Gobierno de unidad nacional",
          desc: "Gobierno de unidad nacional que reactive la economía, recupere el sistema de salud y enfrente la criminalidad superando el sectarismo.",
        },
        {
          title: "Recuperar control del territorio",
          desc: "Recuperar la autoridad del Estado y fortalecer la presencia institucional en todo el país. 'Tenemos la fuerza para hacerlo'.",
        },
        {
          title: "Seguridad total",
          desc: "Eje de 'seguridad total' para poner orden y recuperar el control territorial desde las regiones, articulado con alcaldes y gobernadores.",
        },
        {
          title: "Paz profundizada",
          desc: "Trayectoria de construcción de paz: Ley de Víctimas, JEP, Comisión de la Verdad. Propone profundizar la implementación del Acuerdo de Paz.",
        },
      ],
    },
  },
];
