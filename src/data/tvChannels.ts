
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
    id: "amazon-prime-video",
    name: "Amazon Prime Video",
    category: "Futebol",
    description: "Transmissão de jogos de futebol através da plataforma Amazon Prime Video.",
    iframeUrl: "https://embedcanaistv.com/amazonprimevideo/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/primevideo.png"
  },
  {
    id: "espn",
    name: "ESPN",
    category: "Futebol",
    description: "Canal dedicado aos esportes com foco em futebol e outros eventos esportivos.",
    iframeUrl: "https://embedcanaistv.com/espn/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn.png"
  },
  {
    id: "espn-2",
    name: "ESPN 2",
    category: "Futebol",
    description: "Canal secundário da ESPN com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/espn2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn2.png"
  },
  {
    id: "espn-3",
    name: "ESPN 3",
    category: "Futebol",
    description: "Canal terciário da ESPN com programação complementar de esportes.",
    iframeUrl: "https://embedcanaistv.com/espn3/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn3.png"
  },
  {
    id: "espn-4",
    name: "ESPN 4",
    category: "Futebol",
    description: "Quarto canal da ESPN com programação esportiva.",
    iframeUrl: "https://embedcanaistv.com/espn4/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn4.png"
  },
  {
    id: "espn-5",
    name: "ESPN 5",
    category: "Futebol",
    description: "Quinto canal da ESPN com programação esportiva.",
    iframeUrl: "https://embedcanaistv.com/espn5/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn.png"
  },
  {
    id: "espn-6",
    name: "ESPN 6",
    category: "Futebol",
    description: "Sexto canal da ESPN com programação esportiva.",
    iframeUrl: "https://embedcanaistv.com/espn6/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/espn.png"
  },
  {
    id: "hbo-max",
    name: "HBO Max",
    category: "Futebol",
    description: "Transmissão de jogos de futebol e eventos esportivos pela HBO Max.",
    iframeUrl: "https://embedcanaistv.com/max/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbomax.png"
  },
  {
    id: "nosso-futebol",
    name: "Nosso Futebol",
    category: "Futebol",
    description: "Canal dedicado à transmissão de futebol brasileiro.",
    iframeUrl: "https://embedcanaistv.com/nossofutebol/",
    logoUrl: "https://i.imgur.com/5jMqNTm.png"
  },
  {
    id: "paramount-plus",
    name: "Paramount+",
    category: "Futebol",
    description: "Transmissão de jogos de futebol e eventos esportivos pelo Paramount+.",
    iframeUrl: "https://embedcanaistv.com/paramountplus/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/paramountnetwork.png"
  },
  {
    id: "premiere",
    name: "Premiere",
    category: "Futebol",
    description: "Canal dedicado à transmissão dos principais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere.png"
  },
  {
    id: "premiere-2",
    name: "Premiere 2",
    category: "Futebol",
    description: "Segundo canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere2.png"
  },
  {
    id: "premiere-3",
    name: "Premiere 3",
    category: "Futebol",
    description: "Terceiro canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere3/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere3.png"
  },
  {
    id: "premiere-4",
    name: "Premiere 4",
    category: "Futebol",
    description: "Quarto canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere4/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere4.png"
  },
  {
    id: "premiere-5",
    name: "Premiere 5",
    category: "Futebol",
    description: "Quinto canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere5/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere5.png"
  },
  {
    id: "premiere-6",
    name: "Premiere 6",
    category: "Futebol",
    description: "Sexto canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere6/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere6.png"
  },
  {
    id: "premiere-7",
    name: "Premiere 7",
    category: "Futebol",
    description: "Sétimo canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere7/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere7.png"
  },
  {
    id: "premiere-8",
    name: "Premiere 8",
    category: "Futebol",
    description: "Oitavo canal do Premiere com mais jogos do Campeonato Brasileiro.",
    iframeUrl: "https://embedcanaistv.com/premiere8/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/premiere8.png"
  },
  
  // Esportes
  {
    id: "band-sports",
    name: "Band Sports",
    category: "Esportes",
    description: "Canal esportivo da Band com programação diversificada de esportes.",
    iframeUrl: "https://embedcanaistv.com/bandsports/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/bandsports.png"
  },
  {
    id: "combate",
    name: "Combate",
    category: "Esportes",
    description: "Canal dedicado às lutas e artes marciais.",
    iframeUrl: "https://embedcanaistv.com/combate/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/combate.png"
  },
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
    description: "Segundo canal da SporTV com mais eventos esportivos.",
    iframeUrl: "https://embedcanaistv.com/sportv2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sportv2.png"
  },
  {
    id: "tnt-sports",
    name: "TNT Sports",
    category: "Esportes",
    description: "Canal dedicado à transmissão de eventos esportivos.",
    iframeUrl: "https://embedcanaistv.com/tntsports/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tntsports.png"
  },
  {
    id: "ufc-fight-pass",
    name: "UFC Fight Pass",
    category: "Esportes",
    description: "Serviço de streaming oficial do UFC com lutas ao vivo e conteúdo exclusivo.",
    iframeUrl: "https://embedcanaistv.com/ufcfightpass/",
    logoUrl: "https://i.imgur.com/Ywp3N0J.png"
  },

  // Canais Abertos
  {
    id: "band-sp",
    name: "Band SP",
    category: "Abertos",
    description: "Sinal da TV Bandeirantes para São Paulo.",
    iframeUrl: "https://embedcanaistv.com/bandsp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/band.png"
  },
  {
    id: "globo-ba",
    name: "Globo BA",
    category: "Abertos",
    description: "Sinal da TV Globo para a Bahia.",
    iframeUrl: "https://embedcanaistv.com/globoba/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "globo-df",
    name: "Globo DF",
    category: "Abertos",
    description: "Sinal da TV Globo para Brasília.",
    iframeUrl: "https://embedcanaistv.com/globodf/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "globo-mg",
    name: "Globo MG",
    category: "Abertos",
    description: "Sinal da TV Globo para Minas Gerais.",
    iframeUrl: "https://embedcanaistv.com/globomg/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "globo-rj",
    name: "Globo RJ",
    category: "Abertos",
    description: "Sinal da TV Globo para o Rio de Janeiro.",
    iframeUrl: "https://embedcanaistv.com/globorj/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "globo-rs",
    name: "Globo RS",
    category: "Abertos",
    description: "Sinal da TV Globo para Rio Grande do Sul.",
    iframeUrl: "https://embedcanaistv.com/globors/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "globo-sp",
    name: "Globo SP",
    category: "Abertos",
    description: "Sinal da TV Globo para São Paulo.",
    iframeUrl: "https://embedcanaistv.com/globosp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globo.png"
  },
  {
    id: "record-mg",
    name: "Record MG",
    category: "Abertos",
    description: "Sinal da Record para Minas Gerais.",
    iframeUrl: "https://embedcanaistv.com/globosp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/recordtvmg.png"
  },
  {
    id: "record-rj",
    name: "Record RJ",
    category: "Abertos",
    description: "Sinal da Record para o Rio de Janeiro.",
    iframeUrl: "https://embedcanaistv.com/recordrj/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/recordtvrj.png"
  },
  {
    id: "record-sp",
    name: "Record SP",
    category: "Abertos",
    description: "Sinal da Record para São Paulo.",
    iframeUrl: "https://embedcanaistv.com/recordsp/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/recordtvsp.png"
  },
  {
    id: "rede-tv",
    name: "Rede TV",
    category: "Abertos",
    description: "Canal aberto brasileiro com programação diversificada.",
    iframeUrl: "https://embedcanaistv.com/redetv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/redetv.png"
  },
  {
    id: "sbt",
    name: "SBT",
    category: "Abertos",
    description: "Sistema Brasileiro de Televisão, canal aberto com programação variada.",
    iframeUrl: "https://embedcanaistv.com/sbt/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sbt.png"
  },
  {
    id: "tv-cultura",
    name: "TV Cultura",
    category: "Abertos",
    description: "Canal público brasileiro com programação educativa e cultural.",
    iframeUrl: "https://embedcanaistv.com/tvcultura/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tvcultura.png"
  },

  // Filmes e Séries
  {
    id: "aee",
    name: "A&E",
    category: "Filmes e Séries",
    description: "Canal de entretenimento com filmes, séries e documentários.",
    iframeUrl: "https://embedcanaistv.com/aee/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/ae.png"
  },
  {
    id: "adult-swim",
    name: "Adult Swim",
    category: "Filmes e Séries",
    description: "Bloco de programação com animações e séries para o público adulto.",
    iframeUrl: "https://embedcanaistv.com/adultswim/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/adultswim.png"
  },
  {
    id: "amc",
    name: "AMC",
    category: "Filmes e Séries",
    description: "Canal de televisão especializado em filmes e séries.",
    iframeUrl: "https://embedcanaistv.com/amc/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/amc.png"
  },
  {
    id: "axn",
    name: "AXN",
    category: "Filmes e Séries",
    description: "Canal de televisão com foco em filmes de ação e séries.",
    iframeUrl: "https://embedcanaistv.com/axn/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/axn.png"
  },
  {
    id: "cinecanal",
    name: "Cinecanal",
    category: "Filmes e Séries",
    description: "Canal de televisão dedicado à exibição de filmes.",
    iframeUrl: "https://embedcanaistv.com/cinecanal/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/cinecanal.png"
  },
  {
    id: "cinemax",
    name: "Cinemax",
    category: "Filmes e Séries",
    description: "Canal dedicado à exibição de filmes de todos os gêneros.",
    iframeUrl: "https://embedcanaistv.com/cinemax/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/cinemax.png"
  },
  {
    id: "darkflix",
    name: "Darkflix",
    category: "Filmes e Séries",
    description: "Canal com filmes de suspense, terror e ação.",
    iframeUrl: "https://embedcanaistv.com/darkflix/",
    logoUrl: "https://i.imgur.com/HHiWB2e.png"
  },
  {
    id: "dark-matter",
    name: "Dark Matter",
    category: "Filmes e Séries",
    description: "Canal especializado em filmes e séries de ficção científica e terror.",
    iframeUrl: "https://embedcanaistv.com/darkmatter/",
    logoUrl: "https://i.imgur.com/HsB5MWr.png"
  },
  {
    id: "film-arts",
    name: "Film & Arts",
    category: "Filmes e Séries",
    description: "Canal dedicado ao cinema, artes e cultura.",
    iframeUrl: "https://embedcanaistv.com/filmarts/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/filmandarts.png"
  },
  {
    id: "hbo",
    name: "HBO",
    category: "Filmes e Séries",
    description: "Canal premium com filmes, séries e documentários exclusivos.",
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
    id: "hbo-family",
    name: "HBO Family",
    category: "Filmes e Séries",
    description: "Canal da HBO com programação voltada para toda a família.",
    iframeUrl: "https://embedcanaistv.com/hbofamily/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbofamily.png"
  },
  {
    id: "hbo-plus",
    name: "HBO Plus",
    category: "Filmes e Séries",
    description: "Canal adicional da HBO com mais filmes e séries.",
    iframeUrl: "https://embedcanaistv.com/hboplus/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hboplus.png"
  },
  {
    id: "hbo-pop",
    name: "HBO Pop",
    category: "Filmes e Séries",
    description: "Canal da HBO com programação voltada para o público jovem.",
    iframeUrl: "https://embedcanaistv.com/hbopop/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbopop.png"
  },
  {
    id: "hbo-signature",
    name: "HBO Signature",
    category: "Filmes e Séries",
    description: "Canal premium da HBO com filmes aclamados e séries originais.",
    iframeUrl: "https://embedcanaistv.com/hbosignature/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hbosignature.png"
  },
  {
    id: "hbo-xtreme",
    name: "HBO Xtreme",
    category: "Filmes e Séries",
    description: "Canal da HBO com filmes de ação, terror e adrenalina.",
    iframeUrl: "https://embedcanaistv.com/hboxtreme/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hboxtreme.png"
  },
  {
    id: "megapix",
    name: "Megapix",
    category: "Filmes e Séries",
    description: "Canal brasileiro de filmes com programação diversificada.",
    iframeUrl: "https://embedcanaistv.com/megapix/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/megapix.png"
  },
  {
    id: "movie-sphere",
    name: "Movie Sphere",
    category: "Filmes e Séries",
    description: "Canal dedicado a exibição de filmes de diversos gêneros.",
    iframeUrl: "https://embedcanaistv.com/moviesphere/",
    logoUrl: "https://i.imgur.com/K8YW3iM.png"
  },
  {
    id: "sony-channel",
    name: "Sony Channel",
    category: "Filmes e Séries",
    description: "Canal de entretenimento com filmes e séries da Sony.",
    iframeUrl: "https://embedcanaistv.com/sonychannel/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/sonychannel.png"
  },
  {
    id: "space",
    name: "Space",
    category: "Filmes e Séries",
    description: "Canal de televisão dedicado a filmes de ação e ficção científica.",
    iframeUrl: "https://embedcanaistv.com/space/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/space.png"
  },
  {
    id: "spark-tv",
    name: "Spark TV",
    category: "Filmes e Séries",
    description: "Canal com filmes e séries variadas.",
    iframeUrl: "https://embedcanaistv.com/sparktvluzeamor/",
    logoUrl: "https://i.imgur.com/6fgU2Bx.png"
  },
  {
    id: "star-channel",
    name: "Star Channel",
    category: "Filmes e Séries",
    description: "Canal de televisão com programação diversificada de filmes e séries.",
    iframeUrl: "https://embedcanaistv.com/starchannel/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/starchannel.png"
  },
  {
    id: "studio-universal",
    name: "Studio Universal",
    category: "Filmes e Séries",
    description: "Canal especializado em filmes clássicos.",
    iframeUrl: "https://embedcanaistv.com/studiouniversal/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/studiouniversal.png"
  },
  {
    id: "tc-action",
    name: "Telecine Action",
    category: "Filmes e Séries",
    description: "Canal de filmes de ação, aventura e suspense.",
    iframeUrl: "https://embedcanaistv.com/tcaction/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecineaction.png"
  },
  {
    id: "tc-cult",
    name: "Telecine Cult",
    category: "Filmes e Séries",
    description: "Canal dedicado a filmes alternativos e clássicos do cinema.",
    iframeUrl: "https://embedcanaistv.com/tccult/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecinecult.png"
  },
  {
    id: "tc-fun",
    name: "Telecine Fun",
    category: "Filmes e Séries",
    description: "Canal do grupo Telecine com filmes de comédia e animação.",
    iframeUrl: "https://embedcanaistv.com/tcfun/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecinefun.png"
  },
  {
    id: "tc-pipoca",
    name: "Telecine Pipoca",
    category: "Filmes e Séries",
    description: "Canal do grupo Telecine com sucessos do cinema para toda a família.",
    iframeUrl: "https://embedcanaistv.com/tcpipoca/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecinepipoca.png"
  },
  {
    id: "tc-premium",
    name: "Telecine Premium",
    category: "Filmes e Séries",
    description: "Canal premium do grupo Telecine com lançamentos e sucessos do cinema.",
    iframeUrl: "https://embedcanaistv.com/tcpremium/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecinepremium.png"
  },
  {
    id: "tc-touch",
    name: "Telecine Touch",
    category: "Filmes e Séries",
    description: "Canal do grupo Telecine com filmes românticos e dramas.",
    iframeUrl: "https://embedcanaistv.com/tctouch/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/telecinetouch.png"
  },
  {
    id: "tnt",
    name: "TNT",
    category: "Filmes e Séries",
    description: "Canal com filmes e séries de sucesso.",
    iframeUrl: "https://embedcanaistv.com/tnt/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tnt.png"
  },
  {
    id: "tnt-novelas",
    name: "TNT Novelas",
    category: "Filmes e Séries",
    description: "Canal dedicado à exibição de novelas clássicas e contemporâneas.",
    iframeUrl: "https://embedcanaistv.com/tntnovelas/",
    logoUrl: "https://i.imgur.com/bPO7Vf6.png"
  },
  {
    id: "tnt-series",
    name: "TNT Séries",
    category: "Filmes e Séries",
    description: "Canal dedicado à exibição de séries nacionais e internacionais.",
    iframeUrl: "https://embedcanaistv.com/tntseries/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tntseries.png"
  },
  {
    id: "universal-tv",
    name: "Universal TV",
    category: "Filmes e Séries",
    description: "Canal com filmes e séries da Universal Studios.",
    iframeUrl: "https://embedcanaistv.com/universaltv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/universaltv.png"
  },
  {
    id: "usa",
    name: "USA Channel",
    category: "Filmes e Séries",
    description: "Canal americano com séries e filmes populares.",
    iframeUrl: "https://embedcanaistv.com/usa/",
    logoUrl: "https://iptv-org.github.io/epg/logo/us/usanetwork.png"
  },
  {
    id: "warner",
    name: "Warner Channel",
    category: "Filmes e Séries",
    description: "Canal de entretenimento com séries e filmes da Warner Bros.",
    iframeUrl: "https://embedcanaistv.com/warner/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/warnerchannel.png"
  },

  // Variedades
  {
    id: "animal-planet",
    name: "Animal Planet",
    category: "Variedades",
    description: "Canal dedicado à vida animal e natureza.",
    iframeUrl: "https://embedcanaistv.com/animalplanet/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/animalplanet.png"
  },
  {
    id: "arte-1",
    name: "Arte 1",
    category: "Variedades",
    description: "Canal brasileiro dedicado às artes e cultura.",
    iframeUrl: "https://embedcanaistv.com/arte1/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/arte1.png"
  },
  {
    id: "canal-brasil",
    name: "Canal Brasil",
    category: "Variedades",
    description: "Canal dedicado à produção audiovisual brasileira.",
    iframeUrl: "https://embedcanaistv.com/canalbrasil/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/canalbrasil.png"
  },
  {
    id: "comedy-central",
    name: "Comedy Central",
    category: "Variedades",
    description: "Canal de entretenimento dedicado a programas humorísticos.",
    iframeUrl: "https://embedcanaistv.com/comedycentral/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/comedycentral.png"
  },
  {
    id: "discovery-home-health",
    name: "Discovery Home & Health",
    category: "Variedades",
    description: "Canal com programas sobre bem-estar, saúde e decoração.",
    iframeUrl: "https://embedcanaistv.com/discoveryhh/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoveryhomeandhealth.png"
  },
  {
    id: "discovery-science",
    name: "Discovery Science",
    category: "Variedades",
    description: "Canal com programação focada em ciência e tecnologia.",
    iframeUrl: "https://embedcanaistv.com/discoveryscience/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoveryscience.png"
  },
  {
    id: "discovery-theater",
    name: "Discovery Theater",
    category: "Variedades",
    description: "Canal com documentários e séries em alta definição.",
    iframeUrl: "https://embedcanaistv.com/discoverytheater/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoverytheater.png"
  },
  {
    id: "discovery-world",
    name: "Discovery World",
    category: "Variedades",
    description: "Canal com documentários sobre história, culturas e lugares.",
    iframeUrl: "https://embedcanaistv.com/discoveryworld/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoveryworld.png"
  },
  {
    id: "discovery-id",
    name: "Discovery ID",
    category: "Variedades",
    description: "Canal com programas sobre investigação criminal e mistérios.",
    iframeUrl: "https://embedcanaistv.com/discoveryid/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/investigationdiscovery.png"
  },
  {
    id: "discovery-turbo",
    name: "Discovery Turbo",
    category: "Variedades",
    description: "Canal dedicado ao mundo automotivo.",
    iframeUrl: "https://embedcanaistv.com/discoveryturbo/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/discoveryturbo.png"
  },
  {
    id: "film-arts-var",
    name: "Film & Arts",
    category: "Variedades",
    description: "Canal dedicado ao cinema, artes e cultura.",
    iframeUrl: "https://embedcanaistv.com/filmarts/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/filmandarts.png"
  },
  {
    id: "fish-tv",
    name: "Fish TV",
    category: "Variedades",
    description: "Canal dedicado à pesca esportiva e esportes aquáticos.",
    iframeUrl: "https://embedcanaistv.com/fishtv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/fishtv.png"
  },
  {
    id: "food-network",
    name: "Food Network",
    category: "Variedades",
    description: "Canal dedicado à gastronomia e culinária.",
    iframeUrl: "https://embedcanaistv.com/foodnetwork/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/foodnetwork.png"
  },
  {
    id: "fuel-tv",
    name: "Fuel TV",
    category: "Variedades",
    description: "Canal dedicado aos esportes radicais.",
    iframeUrl: "https://embedcanaistv.com/fueltv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/fueltv.png"
  },
  {
    id: "gnt",
    name: "GNT",
    category: "Variedades",
    description: "Canal de variedades com programação voltada ao público feminino.",
    iframeUrl: "https://embedcanaistv.com/gnt/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/gnt.png"
  },
  {
    id: "hgtv",
    name: "HGTV",
    category: "Variedades",
    description: "Canal especializado em programas sobre decoração e reforma.",
    iframeUrl: "https://embedcanaistv.com/hgtv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/hgtv.png"
  },
  {
    id: "history",
    name: "History Channel",
    category: "Variedades",
    description: "Canal com programação sobre história e documentários.",
    iframeUrl: "https://embedcanaistv.com/history/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/history.png"
  },
  {
    id: "history-2",
    name: "History 2",
    category: "Variedades",
    description: "Segundo canal do History com mais documentários históricos.",
    iframeUrl: "https://embedcanaistv.com/history2/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/history2.png"
  },
  {
    id: "lifetime",
    name: "Lifetime",
    category: "Variedades",
    description: "Canal com programação voltada ao público feminino.",
    iframeUrl: "https://embedcanaistv.com/lifetime/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/lifetime.png"
  },
  {
    id: "multishow",
    name: "Multishow",
    category: "Variedades",
    description: "Canal de entretenimento e variedades com música, humor e séries.",
    iframeUrl: "https://embedcanaistv.com/multishow/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/multishow.png"
  },
  {
    id: "mtv",
    name: "MTV",
    category: "Variedades",
    description: "Canal de entretenimento voltado ao público jovem.",
    iframeUrl: "https://embedcanaistv.com/mtv/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/mtv.png"
  },
  {
    id: "national-geografic",
    name: "National Geographic",
    category: "Variedades",
    description: "Canal com documentários sobre ciência, história e natureza.",
    iframeUrl: "https://embedcanaistv.com/nationalgeografic/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/nationalgeographic.png"
  },
  {
    id: "tlc",
    name: "TLC",
    category: "Variedades",
    description: "Canal com reality shows e programação de estilo de vida.",
    iframeUrl: "https://embedcanaistv.com/tlc/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/tlc.png"
  },
  {
    id: "viva",
    name: "Viva",
    category: "Variedades",
    description: "Canal brasileiro que reexibe programas da TV Globo.",
    iframeUrl: "https://embedcanaistv.com/viva/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/viva.png"
  },

  // Notícias
  {
    id: "band-news",
    name: "Band News",
    category: "Notícias",
    description: "Canal de notícias da Band com programação 24 horas.",
    iframeUrl: "https://embedcanaistv.com/bandnews/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/bandnews.png"
  },
  {
    id: "cnn-brasil",
    name: "CNN Brasil",
    category: "Notícias",
    description: "Canal de notícias 24 horas.",
    iframeUrl: "https://embedcanaistv.com/cnnbrasil/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/cnnbrasil.png"
  },
  {
    id: "globo-news",
    name: "GloboNews",
    category: "Notícias",
    description: "Canal de notícias 24 horas da Globo.",
    iframeUrl: "https://embedcanaistv.com/globonews/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/globonews.png"
  },
  {
    id: "jovem-pan-news",
    name: "Jovem Pan News",
    category: "Notícias",
    description: "Canal de notícias da rádio Jovem Pan.",
    iframeUrl: "https://embedcanaistv.com/jovempannews/",
    logoUrl: "https://i.imgur.com/xH1Fm7Z.png"
  },
  {
    id: "record-news",
    name: "Record News",
    category: "Notícias",
    description: "Canal de notícias da Record.",
    iframeUrl: "https://embedcanaistv.com/recordnews/",
    logoUrl: "https://iptv-org.github.io/epg/logo/br/recordnews.png"
  }
];
