export const practiceAreas = [
  {
    id: "tribunal-do-juri",
    title: "Tribunal do Júri",
    description: "Preparação da defesa e atuação em plenário diante dos jurados.",
    topics: ["Estudo das provas e dos depoimentos", "Preparação para o julgamento", "Inquirição de testemunhas e sustentação em plenário"],
  },
  {
    id: "flagrantes",
    title: "Flagrantes",
    description: "Acompanhamento da prisão em flagrante e orientação à pessoa presa e à família.",
    topics: ["Circunstâncias da prisão", "Análise do auto de prisão em flagrante", "Preparação para a audiência de custódia"],
  },
  {
    id: "lei-de-drogas",
    title: "Lei de Drogas",
    description: "Defesa em investigações e processos que envolvem acusações relacionadas a drogas.",
    topics: ["Contexto da abordagem e da apreensão", "Exame dos laudos e depoimentos", "Discussão das provas no processo"],
  },
] as const;

export type PracticeArea = (typeof practiceAreas)[number]["id"];
