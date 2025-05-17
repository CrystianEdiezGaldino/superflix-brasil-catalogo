
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
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere.png"
  },
  {
    id: "espn",
    name: "ESPN",
    category: "Futebol",
    description: "Canal líder em esportes nos Estados Unidos, com foco em futebol e outros esportes.",
    iframeUrl: "https://embedcanaistv.com/espn/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn.png"
  },
  {
    id: "espn-2",
    name: "ESPN 2",
    category: "Futebol",
    description: "Segundo canal da ESPN com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/espn2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn2.png"
  },

  // Esportes
  {
    id: "sportv",
    name: "SporTV",
    category: "Esportes",
    description: "Canal brasileiro dedicado à transmissão de eventos esportivos.",
    iframeUrl: "https://embedcanaistv.com/sportv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sportv.png"
  },
  {
    id: "sportv-2",
    name: "SporTV 2",
    category: "Esportes",
    description: "Segundo canal da SporTV com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/sportv2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sportv2.png"
  },
  {
    id: "band-sports",
    name: "BandSports",
    category: "Esportes",
    description: "Canal esportivo da Band com foco em diversos esportes.",
    iframeUrl: "https://embedcanaistv.com/bandsports/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/bandsports.png"
  },

  // Abertos
  {
    id: "globo-sp",
    name: "Globo SP",
    category: "Abertos",
    description: "Sinal da TV Globo para São Paulo.",
    iframeUrl: "https://embedcanaistv.com/globosp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "sbt",
    name: "SBT",
    category: "Abertos",
    description: "Sistema Brasileiro de Televisão, uma das maiores emissoras do Brasil.",
    iframeUrl: "https://embedcanaistv.com/sbt/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sbt.png"
  },
  {
    id: "record",
    name: "Record",
    category: "Abertos",
    description: "Rede Record de Televisão, uma das principais emissoras do Brasil.",
    iframeUrl: "https://embedcanaistv.com/recordsp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/recordtvsp.png"
  },

  // Filmes e Séries
  {
    id: "hbo",
    name: "HBO",
    category: "Filmes e Séries",
    description: "Canal premium com filmes e séries exclusivas.",
    iframeUrl: "https://embedcanaistv.com/hbo/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbo.png"
  },
  {
    id: "hbo-2",
    name: "HBO 2",
    category: "Filmes e Séries",
    description: "Segundo canal da HBO com programação complementar.",
    iframeUrl: "https://embedcanaistv.com/hbo2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbo2.png"
  },
  {
    id: "tnt",
    name: "TNT",
    category: "Filmes e Séries",
    description: "Canal com filmes e séries de sucesso.",
    iframeUrl: "https://embedcanaistv.com/tnt/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tnt.png"
  },

  // Variedades
  {
    id: "discovery",
    name: "Discovery Channel",
    category: "Variedades",
    description: "Canal com documentários e programas educativos.",
    iframeUrl: "https://embedcanaistv.com/discovery/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoverychannel.png"
  },
  {
    id: "animal-planet",
    name: "Animal Planet",
    category: "Variedades",
    description: "Canal dedicado à vida animal e natureza.",
    iframeUrl: "https://embedcanaistv.com/animalplanet/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/animalplanet.png"
  },
  {
    id: "history",
    name: "History Channel",
    category: "Variedades",
    description: "Canal com documentários históricos e programas educativos.",
    iframeUrl: "https://embedcanaistv.com/history/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/history.png"
  },

  // Notícias
  {
    id: "globo-news",
    name: "GloboNews",
    category: "Notícias",
    description: "Canal de notícias 24 horas da Globo.",
    iframeUrl: "https://embedcanaistv.com/globonews/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globonews.png"
  },
  {
    id: "cnn-brasil",
    name: "CNN Brasil",
    category: "Notícias",
    description: "Canal de notícias 24 horas da CNN no Brasil.",
    iframeUrl: "https://embedcanaistv.com/cnnbrasil/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/cnnbrasil.png"
  },
  {
    id: "band-news",
    name: "BandNews",
    category: "Notícias",
    description: "Canal de notícias 24 horas da Band.",
    iframeUrl: "https://embedcanaistv.com/bandnews/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/bandnews.png"
  },
];
