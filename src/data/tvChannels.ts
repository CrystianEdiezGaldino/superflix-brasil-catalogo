export const channelCategories = [
  "Futebol",
  "Esportes",
  "Abertos",
  "Filmes e Séries",
  "Variedades",
  "Notícias"
] as const;

export interface TvChannel {
  id: string;
  name: string;
  category: typeof channelCategories[number];
  description: string;
  iframeUrl: string;
  logoUrl?: string;
}

export const tvChannels: TvChannel[] = [
  // Futebol

  {
    id: "premiere-2",
    name: "Premiere 2",
    category: "Futebol",
    description: "Canal dedicado à transmissão dos principais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere2/",
  },
  {
    id: "espn",
    name: "ESPN",
    category: "Futebol",
    description: "Canal líder em esportes nos Estados Unidos, com foco em futebol e outros esportes.",
    iframeUrl: "https://embedcanaistv.com/espn/",
  },
  {
    id: "espn-2",
    name: "ESPN 2",
    category: "Futebol",
    description: "Segundo canal da ESPN com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/espn2/",
  },

  // Esportes
  {
    id: "sportv",
    name: "SporTV",
    category: "Esportes",
    description: "Canal brasileiro dedicado à transmissão de eventos esportivos.",
    iframeUrl: "https://embedcanaistv.com/sportv/",
  },
  {
    id: "sportv-2",
    name: "SporTV 2",
    category: "Esportes",
    description: "Segundo canal da SporTV com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/sportv2/",
  },
  {
    id: "band-sports",
    name: "BandSports",
    category: "Esportes",
    description: "Canal esportivo da Band com foco em diversos esportes.",
    iframeUrl: "https://embedcanaistv.com/bandsports/",
  },

  // Abertos
  {
    id: "globo-sp",
    name: "Globo SP",
    category: "Abertos",
    description: "Sinal da TV Globo para São Paulo.",
    iframeUrl: "https://embedcanaistv.com/globosp/",
  },
  {
    id: "sbt",
    name: "SBT",
    category: "Abertos",
    description: "Sistema Brasileiro de Televisão, uma das maiores emissoras do Brasil.",
    iframeUrl: "https://embedcanaistv.com/sbt/",
  },
  {
    id: "record",
    name: "Record",
    category: "Abertos",
    description: "Rede Record de Televisão, uma das principais emissoras do Brasil.",
    iframeUrl: "https://embedcanaistv.com/recordsp/",
  },

  // Filmes e Séries
  {
    id: "hbo",
    name: "HBO",
    category: "Filmes e Séries",
    description: "Canal premium com filmes e séries exclusivas.",
    iframeUrl: "https://embedcanaistv.com/hbo/",
  },
  {
    id: "hbo-2",
    name: "HBO 2",
    category: "Filmes e Séries",
    description: "Segundo canal da HBO com programação complementar.",
    iframeUrl: "https://embedcanaistv.com/hbo2/",
  },
  {
    id: "tnt",
    name: "TNT",
    category: "Filmes e Séries",
    description: "Canal com filmes e séries de sucesso.",
    iframeUrl: "https://embedcanaistv.com/tnt/",
  },

  // Variedades
  {
    id: "discovery",
    name: "Discovery Channel",
    category: "Variedades",
    description: "Canal com documentários e programas educativos.",
    iframeUrl: "https://embedcanaistv.com/discovery/",
  },
  {
    id: "animal-planet",
    name: "Animal Planet",
    category: "Variedades",
    description: "Canal dedicado à vida animal e natureza.",
    iframeUrl: "https://embedcanaistv.com/animalplanet/",
  },
  {
    id: "history",
    name: "History Channel",
    category: "Variedades",
    description: "Canal com documentários históricos e programas educativos.",
    iframeUrl: "https://embedcanaistv.com/history/",
  },

  // Notícias
  {
    id: "globo-news",
    name: "GloboNews",
    category: "Notícias",
    description: "Canal de notícias 24 horas da Globo.",
    iframeUrl: "https://embedcanaistv.com/globonews/",
  },
  {
    id: "cnn-brasil",
    name: "CNN Brasil",
    category: "Notícias",
    description: "Canal de notícias 24 horas da CNN no Brasil.",
    iframeUrl: "https://embedcanaistv.com/cnnbrasil/",
  },
  {
    id: "band-news",
    name: "BandNews",
    category: "Notícias",
    description: "Canal de notícias 24 horas da Band.",
    iframeUrl: "https://embedcanaistv.com/bandnews/",
  },
];
