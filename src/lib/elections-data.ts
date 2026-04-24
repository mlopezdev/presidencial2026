export const EL_COLOR: Record<string, string> = {
  "Juan Manuel Santos": "#E8A200",
  "Antanas Mockus": "#2E7D32",
  "Germán Vargas Lleras": "#C8553D",
  "Gustavo Petro": "#B8860B",
  "Noemí Sanín": "#1E40AF",
  "Rafael Pardo": "#B3261E",
  "Óscar Iván Zuluaga": "#2E4BA8",
  "Marta Lucía Ramírez": "#1E40AF",
  "Clara López": "#722F37",
  "Enrique Peñalosa": "#2E7D32",
  "Iván Duque": "#2E4BA8",
  "Sergio Fajardo": "#5B3A8B",
  "Humberto de la Calle": "#B3261E",
  "Federico Gutiérrez": "#2E4BA8",
  "Rodolfo Hernández": "#1E8F8F",
  "John Milton Rodríguez": "#6B2D5C",
  "Francia Márquez": "#B8860B",
  "Íngrid Betancourt": "#2E7D32",
};

export const EL_SPECTRUM: Record<string, string> = {
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
  "Íngrid Betancourt": "centro",
};

export interface RoundResult { name: string; pct: number; votes: number; }

export interface ElectionYear {
  abstencion: number;
  turnout: number;
  totalVotes: number;
  r1: RoundResult[];
  r2: RoundResult[];
  winner: string;
  headline: string;
  blurb: string;
}

export const EL_NATIONAL: Record<number, ElectionYear> = {
  2010: {
    abstencion: 50.7, turnout: 49.3, totalVotes: 14_781_020,
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
    headline: "La ola verde que no fue suficiente",
    blurb: "Santos ganó en primera vuelta con mayoría. Mockus lideró un movimiento ciudadano sin precedentes que no alcanzó para desafiar al candidato uribista en segunda.",
  },
  2014: {
    abstencion: 59.9, turnout: 40.1, totalVotes: 13_216_915,
    r1: [
      { name: "Óscar Iván Zuluaga", pct: 29.3, votes: 3_769_005 },
      { name: "Juan Manuel Santos", pct: 25.7, votes: 3_301_815 },
      { name: "Marta Lucía Ramírez", pct: 15.5, votes: 1_995_696 },
      { name: "Clara López", pct: 15.2, votes: 1_958_414 },
      { name: "Enrique Peñalosa", pct: 8.3, votes: 1_065_142 },
    ],
    r2: [
      { name: "Juan Manuel Santos", pct: 50.9, votes: 7_839_342 },
      { name: "Óscar Iván Zuluaga", pct: 45.0, votes: 6_917_001 },
    ],
    winner: "Juan Manuel Santos",
    headline: "El voto por la paz en segunda vuelta",
    blurb: "Santos remontó una primera vuelta adversa apoyado en la esperanza del Acuerdo de Paz. Zuluaga lideró la primera ronda pero perdió por un estrecho margen.",
  },
  2018: {
    abstencion: 46.6, turnout: 53.4, totalVotes: 19_636_714,
    r1: [
      { name: "Iván Duque", pct: 39.1, votes: 7_616_857 },
      { name: "Gustavo Petro", pct: 25.1, votes: 4_851_254 },
      { name: "Sergio Fajardo", pct: 23.7, votes: 4_589_696 },
      { name: "Germán Vargas Lleras", pct: 7.0, votes: 1_408_815 },
      { name: "Humberto de la Calle", pct: 2.1, votes: 397_151 },
    ],
    r2: [
      { name: "Iván Duque", pct: 54.0, votes: 10_373_080 },
      { name: "Gustavo Petro", pct: 41.8, votes: 8_034_189 },
    ],
    winner: "Iván Duque",
    headline: "Duque aplasta a Petro en segunda vuelta",
    blurb: "El candidato del Centro Democrático logró una victoria contundente. Petro consolidó la izquierda como fuerza electoral de primer orden por primera vez en la historia.",
  },
  2022: {
    abstencion: 41.9, turnout: 58.1, totalVotes: 22_635_533,
    r1: [
      { name: "Gustavo Petro", pct: 40.3, votes: 8_527_768 },
      { name: "Federico Gutiérrez", pct: 23.9, votes: 5_060_766 },
      { name: "Rodolfo Hernández", pct: 23.0, votes: 4_873_905 },
      { name: "Sergio Fajardo", pct: 4.2, votes: 888_818 },
      { name: "Íngrid Betancourt", pct: 2.2, votes: 465_278 },
    ],
    r2: [
      { name: "Gustavo Petro", pct: 50.5, votes: 11_281_013 },
      { name: "Rodolfo Hernández", pct: 47.3, votes: 10_580_412 },
    ],
    winner: "Gustavo Petro",
    headline: "Colombia eligió su primer presidente de izquierda",
    blurb: "Petro y Francia Márquez alcanzaron la presidencia en una segunda vuelta histórica frente al outsider Rodolfo Hernández. La participación fue la más alta en décadas.",
  },
};

export const EL_YEARS = [2010, 2014, 2018, 2022] as const;
