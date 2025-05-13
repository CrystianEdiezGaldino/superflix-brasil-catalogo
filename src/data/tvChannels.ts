
import { TvChannel } from '@/types/tvChannel';

export interface ChannelCategory {
  id: string;
  name: string;
  channels: TvChannel[];
}

export const channelCategories: ChannelCategory[] = [
  {
    id: 'abertos',
    name: 'Canais Abertos',
    channels: [
      {
        id: 'globo-rj',
        name: 'Globo RJ',
        embedUrl: 'https://embedtv-0.icu/globo-rj',
        category: 'abertos'
      },
      {
        id: 'globo-sp',
        name: 'Globo SP',
        embedUrl: 'https://embedtv-0.icu/globo-sp',
        category: 'abertos'
      },
      {
        id: 'sbt-central',
        name: 'SBT Central',
        embedUrl: 'https://embedtv-0.icu/sbt-central',
        category: 'abertos'
      },
      {
        id: 'record',
        name: 'Record',
        embedUrl: 'https://embedtv-0.icu/record',
        category: 'abertos'
      },
      {
        id: 'band',
        name: 'Band',
        embedUrl: 'https://embedtv-0.icu/band',
        category: 'abertos'
      },
      {
        id: 'cultura',
        name: 'Cultura',
        embedUrl: 'https://embedtv-0.icu/cultura',
        category: 'abertos'
      },
      {
        id: 'aparecida',
        name: 'Aparecida',
        embedUrl: 'https://embedtv-0.icu/aparecida',
        category: 'abertos'
      },
      {
        id: 'cancao-nova',
        name: 'Canção Nova',
        embedUrl: 'https://embedtv-0.icu/cancao-nova',
        category: 'abertos'
      }
    ]
  },
  {
    id: 'esportes',
    name: 'Esportes',
    channels: [
      {
        id: 'sportv',
        name: 'Sportv',
        embedUrl: 'https://embedtv-0.icu/sportv',
        category: 'esportes'
      },
      {
        id: 'sportv2',
        name: 'Sportv 2',
        embedUrl: 'https://embedtv-0.icu/sportv2',
        category: 'esportes'
      },
      {
        id: 'sportv3',
        name: 'Sportv 3',
        embedUrl: 'https://embedtv-0.icu/sportv3',
        category: 'esportes'
      },
      {
        id: 'sportv4',
        name: 'Sportv 4',
        embedUrl: 'https://embedtv-0.icu/sportv4',
        category: 'esportes'
      },
      {
        id: 'espn',
        name: 'Espn',
        embedUrl: 'https://embedtv-0.icu/espn',
        category: 'esportes'
      },
      {
        id: 'espn2',
        name: 'Espn 2',
        embedUrl: 'https://embedtv-0.icu/espn2',
        category: 'esportes'
      },
      {
        id: 'espn3',
        name: 'Espn 3',
        embedUrl: 'https://embedtv-0.icu/espn3',
        category: 'esportes'
      },
      {
        id: 'espn4',
        name: 'Espn 4',
        embedUrl: 'https://embedtv-0.icu/espn4',
        category: 'esportes'
      },
      {
        id: 'espn5',
        name: 'Espn 5',
        embedUrl: 'https://embedtv-0.icu/espn5',
        category: 'esportes'
      },
      {
        id: 'espn6',
        name: 'Espn 6',
        embedUrl: 'https://embedtv-0.icu/espn6',
        category: 'esportes'
      },
      {
        id: 'band-sports',
        name: 'Band Sports',
        embedUrl: 'https://embedtv-0.icu/band-sports',
        category: 'esportes'
      },
      {
        id: 'combate',
        name: 'Combate',
        embedUrl: 'https://embedtv-0.icu/combate',
        category: 'esportes'
      },
      {
        id: 'premiere1',
        name: 'Premiere 1',
        embedUrl: 'https://embedtv-0.icu/premiere1',
        category: 'esportes'
      },
      {
        id: 'premiere2',
        name: 'Premiere 2',
        embedUrl: 'https://embedtv-0.icu/premiere2',
        category: 'esportes'
      },
      {
        id: 'premiere3',
        name: 'Premiere 3',
        embedUrl: 'https://embedtv-0.icu/premiere3',
        category: 'esportes'
      },
      {
        id: 'premiere4',
        name: 'Premiere 4',
        embedUrl: 'https://embedtv-0.icu/premiere4',
        category: 'esportes'
      },
      {
        id: 'premiere5',
        name: 'Premiere 5',
        embedUrl: 'https://embedtv-0.icu/premiere5',
        category: 'esportes'
      },
      {
        id: 'premiere6',
        name: 'Premiere 6',
        embedUrl: 'https://embedtv-0.icu/premiere6',
        category: 'esportes'
      },
      {
        id: 'premiere7',
        name: 'Premiere 7',
        embedUrl: 'https://embedtv-0.icu/premiere7',
        category: 'esportes'
      },
      {
        id: 'premiere8',
        name: 'Premiere 8',
        embedUrl: 'https://embedtv-0.icu/premiere8',
        category: 'esportes'
      },
      {
        id: 'nosso-futebol1',
        name: 'Nosso Futebol 1',
        embedUrl: 'https://embedtv-0.icu/nosso-futebol1',
        category: 'esportes'
      },
      {
        id: 'nosso-futebol2',
        name: 'Nosso Futebol 2',
        embedUrl: 'https://embedtv-0.icu/nosso-futebol2',
        category: 'esportes'
      },
      {
        id: 'nosso-futebol3',
        name: 'Nosso Futebol 3',
        embedUrl: 'https://embedtv-0.icu/nosso-futebol3',
        category: 'esportes'
      },
      {
        id: 'nba-league-pass1',
        name: 'NBA League Pass 01',
        embedUrl: 'https://embedtv-0.icu/nba-league-pass1',
        category: 'esportes'
      },
      {
        id: 'nba-league-pass2',
        name: 'NBA League Pass 02',
        embedUrl: 'https://embedtv-0.icu/nba-league-pass2',
        category: 'esportes'
      },
      {
        id: 'ufc-fight-pass',
        name: 'UFC Fight Pass',
        embedUrl: 'https://embedtv-0.icu/ufc-fight-pass',
        category: 'esportes'
      },
      {
        id: 'fish-tv',
        name: 'Fish TV',
        embedUrl: 'https://embedtv-0.icu/fish-tv',
        category: 'esportes'
      },
      {
        id: 'off',
        name: 'OFF',
        embedUrl: 'https://embedtv-0.icu/off',
        category: 'esportes'
      }
    ]
  },
  {
    id: 'filmes',
    name: 'Filmes e Séries',
    channels: [
      {
        id: 'telecine-premium',
        name: 'Telecine Premium',
        embedUrl: 'https://embedtv-0.icu/telecine-premium',
        category: 'filmes'
      },
      {
        id: 'telecine-pipoca',
        name: 'Telecine Pipoca',
        embedUrl: 'https://embedtv-0.icu/telecine-pipoca',
        category: 'filmes'
      },
      {
        id: 'telecine-action',
        name: 'Telecine Action',
        embedUrl: 'https://embedtv-0.icu/telecine-action',
        category: 'filmes'
      },
      {
        id: 'telecine-touch',
        name: 'Telecine Touch',
        embedUrl: 'https://embedtv-0.icu/telecine-touch',
        category: 'filmes'
      },
      {
        id: 'telecine-fun',
        name: 'Telecine Fun',
        embedUrl: 'https://embedtv-0.icu/telecine-fun',
        category: 'filmes'
      },
      {
        id: 'telecine-cult',
        name: 'Telecine Cult',
        embedUrl: 'https://embedtv-0.icu/telecine-cult',
        category: 'filmes'
      },
      {
        id: 'hbo',
        name: 'HBO',
        embedUrl: 'https://embedtv-0.icu/hbo',
        category: 'filmes'
      },
      {
        id: 'hbo2',
        name: 'HBO 2',
        embedUrl: 'https://embedtv-0.icu/hbo2',
        category: 'filmes'
      },
      {
        id: 'hbo-family',
        name: 'HBO Family',
        embedUrl: 'https://embedtv-0.icu/hbo-family',
        category: 'filmes'
      },
      {
        id: 'hbo-plus',
        name: 'HBO Plus',
        embedUrl: 'https://embedtv-0.icu/hbo-plus',
        category: 'filmes'
      },
      {
        id: 'hbo-xtreme',
        name: 'HBO Xtreme',
        embedUrl: 'https://embedtv-0.icu/hbo-xtreme',
        category: 'filmes'
      },
      {
        id: 'hbo-mundi',
        name: 'HBO Mundi',
        embedUrl: 'https://embedtv-0.icu/hbo-mundi',
        category: 'filmes'
      },
      {
        id: 'hbo-pop',
        name: 'HBO POP',
        embedUrl: 'https://embedtv-0.icu/hbo-pop',
        category: 'filmes'
      },
      {
        id: 'warner-channel',
        name: 'Warnerchannel',
        embedUrl: 'https://embedtv-0.icu/warnerchannel',
        category: 'filmes'
      },
      {
        id: 'tnt',
        name: 'TNT',
        embedUrl: 'https://embedtv-0.icu/tnt',
        category: 'filmes'
      },
      {
        id: 'tnt-series',
        name: 'TNT Series',
        embedUrl: 'https://embedtv-0.icu/tnt-series',
        category: 'filmes'
      },
      {
        id: 'tnt-novelas',
        name: 'TNT Novelas',
        embedUrl: 'https://embedtv-0.icu/tnt-novelas',
        category: 'filmes'
      },
      {
        id: 'megapix',
        name: 'Megapix',
        embedUrl: 'https://embedtv-0.icu/megapix',
        category: 'filmes'
      },
      {
        id: 'space',
        name: 'Space',
        embedUrl: 'https://embedtv-0.icu/space',
        category: 'filmes'
      },
      {
        id: 'cinemax',
        name: 'Cinemax',
        embedUrl: 'https://embedtv-0.icu/cinemax',
        category: 'filmes'
      },
      {
        id: 'fx',
        name: 'FX',
        embedUrl: 'https://embedtv-0.icu/fx',
        category: 'filmes'
      },
      {
        id: 'universal',
        name: 'Universal',
        embedUrl: 'https://embedtv-0.icu/universal',
        category: 'filmes'
      },
      {
        id: 'studio-universal',
        name: 'Studio Universal',
        embedUrl: 'https://embedtv-0.icu/studio-universal',
        category: 'filmes'
      },
      {
        id: 'paramount',
        name: 'Paramount',
        embedUrl: 'https://embedtv-0.icu/paramount',
        category: 'filmes'
      },
      {
        id: 'sony-channel',
        name: 'Sony Channel',
        embedUrl: 'https://embedtv-0.icu/sony-channel',
        category: 'filmes'
      },
      {
        id: 'star-channel',
        name: 'Star Channel',
        embedUrl: 'https://embedtv-0.icu/star-channel',
        category: 'filmes'
      },
      {
        id: 'ae',
        name: 'AE',
        embedUrl: 'https://embedtv-0.icu/ae',
        category: 'filmes'
      },
      {
        id: 'axn',
        name: 'AXN',
        embedUrl: 'https://embedtv-0.icu/axn',
        category: 'filmes'
      },
      {
        id: 'tcm',
        name: 'TCM',
        embedUrl: 'https://embedtv-0.icu/tcm',
        category: 'filmes'
      }
    ]
  },
  {
    id: 'infantis',
    name: 'Infantis',
    channels: [
      {
        id: 'cartoon',
        name: 'Cartoon Network',
        embedUrl: 'https://embedtv-0.icu/cartoon',
        category: 'infantis'
      },
      {
        id: 'cartoonito',
        name: 'Cartoonito',
        embedUrl: 'https://embedtv-0.icu/cartoonito',
        category: 'infantis'
      },
      {
        id: 'disney-channel',
        name: 'Disney Channel',
        embedUrl: 'https://embedtv-0.icu/disney-channel',
        category: 'infantis'
      },
      {
        id: 'nickelodeon',
        name: 'Nickelodeon',
        embedUrl: 'https://embedtv-0.icu/nickelodeon',
        category: 'infantis'
      },
      {
        id: 'nick-junior',
        name: 'Nick Junior',
        embedUrl: 'https://embedtv-0.icu/nick-junior',
        category: 'infantis'
      },
      {
        id: 'discovery-kids',
        name: 'Discovery Kids',
        embedUrl: 'https://embedtv-0.icu/discovery-kids',
        category: 'infantis'
      },
      {
        id: 'gloob',
        name: 'Gloob',
        embedUrl: 'https://embedtv-0.icu/gloob',
        category: 'infantis'
      }
    ]
  },
  {
    id: 'documentarios',
    name: 'Documentários',
    channels: [
      {
        id: 'discovery-channel',
        name: 'Discovery Channel',
        embedUrl: 'https://embedtv-0.icu/discovery-channel',
        category: 'documentarios'
      },
      {
        id: 'discovery-science',
        name: 'Discovery Science',
        embedUrl: 'https://embedtv-0.icu/discovery-science',
        category: 'documentarios'
      },
      {
        id: 'discovery-theater',
        name: 'Discovery Theater',
        embedUrl: 'https://embedtv-0.icu/discovery-theater',
        category: 'documentarios'
      },
      {
        id: 'discovery-turbo',
        name: 'Discovery Turbo',
        embedUrl: 'https://embedtv-0.icu/discovery-turbo',
        category: 'documentarios'
      },
      {
        id: 'discovery-world',
        name: 'Discovery World',
        embedUrl: 'https://embedtv-0.icu/discovery-world',
        category: 'documentarios'
      },
      {
        id: 'discovery-id',
        name: 'Discovery ID',
        embedUrl: 'https://embedtv-0.icu/discovery-id',
        category: 'documentarios'
      },
      {
        id: 'discovery-hh',
        name: 'Discovery H&H',
        embedUrl: 'https://embedtv-0.icu/discovery-hh',
        category: 'documentarios'
      },
      {
        id: 'history-channel',
        name: 'History',
        embedUrl: 'https://embedtv-0.icu/history',
        category: 'documentarios'
      },
      {
        id: 'history2',
        name: 'History 2',
        embedUrl: 'https://embedtv-0.icu/history2',
        category: 'documentarios'
      },
      {
        id: 'animal-planet',
        name: 'Animal Planet',
        embedUrl: 'https://embedtv-0.icu/animal-planet',
        category: 'documentarios'
      }
    ]
  },
  {
    id: 'noticias',
    name: 'Notícias',
    channels: [
      {
        id: 'globo-news',
        name: 'Globo News',
        embedUrl: 'https://embedtv-0.icu/globo-news',
        category: 'noticias'
      },
      {
        id: 'band-news',
        name: 'Band News',
        embedUrl: 'https://embedtv-0.icu/band-news',
        category: 'noticias'
      },
      {
        id: 'cnn-brasil',
        name: 'CNN Brasil',
        embedUrl: 'https://embedtv-0.icu/cnn-brasil',
        category: 'noticias'
      }
    ]
  },
  {
    id: 'variedades',
    name: 'Variedades',
    channels: [
      {
        id: 'multishow',
        name: 'Multishow',
        embedUrl: 'https://embedtv-0.icu/multishow',
        category: 'variedades'
      },
      {
        id: 'viva',
        name: 'VIVA',
        embedUrl: 'https://embedtv-0.icu/viva',
        category: 'variedades'
      },
      {
        id: 'gnt',
        name: 'GNT',
        embedUrl: 'https://embedtv-0.icu/gnt',
        category: 'variedades'
      },
      {
        id: 'comedy-central',
        name: 'Comedy Central',
        embedUrl: 'https://embedtv-0.icu/comedy-central',
        category: 'variedades'
      },
      {
        id: 'mtv',
        name: 'MTV',
        embedUrl: 'https://embedtv-0.icu/mtv',
        category: 'variedades'
      },
      {
        id: 'food-network',
        name: 'Food Network',
        embedUrl: 'https://embedtv-0.icu/food-network',
        category: 'variedades'
      },
      {
        id: 'hgtv',
        name: 'HGTV',
        embedUrl: 'https://embedtv-0.icu/hgtv',
        category: 'variedades'
      },
      {
        id: 'tlc',
        name: 'TLC',
        embedUrl: 'https://embedtv-0.icu/tlc',
        category: 'variedades'
      },
      {
        id: 'adult-swim',
        name: 'Adult Swim',
        embedUrl: 'https://embedtv-0.icu/adult-swim',
        category: 'variedades'
      }
    ]
  },
  {
    id: 'streaming',
    name: 'Streaming',
    channels: [
      {
        id: 'disney-plus-1',
        name: 'Disney Plus 1',
        embedUrl: 'https://embedtv-0.icu/disney-plus-1',
        category: 'streaming'
      },
      {
        id: 'disney-plus-2',
        name: 'Disney Plus 2',
        embedUrl: 'https://embedtv-0.icu/disney-plus-2',
        category: 'streaming'
      },
      {
        id: 'disney-plus-3',
        name: 'Disney Plus 3',
        embedUrl: 'https://embedtv-0.icu/disney-plus-3',
        category: 'streaming'
      },
      {
        id: 'paramount-plus',
        name: 'Paramount Plus',
        embedUrl: 'https://embedtv-0.icu/paramount-plus',
        category: 'streaming'
      },
      {
        id: 'paramount-plus-2',
        name: 'Paramount Plus 2',
        embedUrl: 'https://embedtv-0.icu/paramount-plus-2',
        category: 'streaming'
      },
      {
        id: 'max-1',
        name: 'Max - 1',
        embedUrl: 'https://embedtv-0.icu/max-1',
        category: 'streaming'
      },
      {
        id: 'max-2',
        name: 'Max - 2',
        embedUrl: 'https://embedtv-0.icu/max-2',
        category: 'streaming'
      },
      {
        id: 'max-3',
        name: 'Max - 3',
        embedUrl: 'https://embedtv-0.icu/max-3',
        category: 'streaming'
      },
      {
        id: 'max-4',
        name: 'Max - 4',
        embedUrl: 'https://embedtv-0.icu/max-4',
        category: 'streaming'
      },
      {
        id: 'max-5',
        name: 'Max - 5',
        embedUrl: 'https://embedtv-0.icu/max-5',
        category: 'streaming'
      },
      {
        id: 'max-6',
        name: 'Max - 6',
        embedUrl: 'https://embedtv-0.icu/max-6',
        category: 'streaming'
      },
      {
        id: 'prime-video',
        name: 'Prime Video',
        embedUrl: 'https://embedtv-0.icu/prime-video',
        category: 'streaming'
      },
      {
        id: 'prime-video-2',
        name: 'Prime Video 2',
        embedUrl: 'https://embedtv-0.icu/prime-video-2',
        category: 'streaming'
      },
      {
        id: 'goat-1',
        name: 'Goat - 1',
        embedUrl: 'https://embedtv-0.icu/goat-1',
        category: 'streaming'
      },
      {
        id: 'goat-2',
        name: 'Goat - 2',
        embedUrl: 'https://embedtv-0.icu/goat-2',
        category: 'streaming'
      },
      {
        id: 'goat-3',
        name: 'Goat - 3',
        embedUrl: 'https://embedtv-0.icu/goat-3',
        category: 'streaming'
      }
    ]
  },
  {
    id: '24-horas',
    name: 'Canais 24 Horas',
    channels: [
      {
        id: '24h-todo-mundo-odeia-o-cris',
        name: '24H Todo Mundo Odeia o Cris',
        embedUrl: 'https://embedtv-0.icu/24h-todo-mundo-odeia-o-cris',
        category: '24-horas'
      },
      {
        id: '24h-os-simpsons',
        name: '24H Os Simpsons',
        embedUrl: 'https://embedtv-0.icu/24h-os-simpsons',
        category: '24-horas'
      },
      {
        id: '24h-dragon-ball-z',
        name: '24H Dragon Ball Z',
        embedUrl: 'https://embedtv-0.icu/24h-dragon-ball-z',
        category: '24-horas'
      }
    ]
  },
  {
    id: 'portugal',
    name: 'Canais Portugueses',
    channels: [
      {
        id: 'pt-sportv1',
        name: 'PT - Sportv 1',
        embedUrl: 'https://embedtv-0.icu/pt-sportv1',
        category: 'portugal'
      },
      {
        id: 'pt-sportv2',
        name: 'PT - Sportv 2',
        embedUrl: 'https://embedtv-0.icu/pt-sportv2',
        category: 'portugal'
      },
      {
        id: 'pt-sportv3',
        name: 'PT - Sportv 3',
        embedUrl: 'https://embedtv-0.icu/pt-sportv3',
        category: 'portugal'
      },
      {
        id: 'pt-sportv4',
        name: 'PT - Sportv 4',
        embedUrl: 'https://embedtv-0.icu/pt-sportv4',
        category: 'portugal'
      },
      {
        id: 'pt-sportv5',
        name: 'PT - Sportv 5',
        embedUrl: 'https://embedtv-0.icu/pt-sportv5',
        category: 'portugal'
      },
      {
        id: 'pt-eleven1',
        name: 'PT - Eleven 1',
        embedUrl: 'https://embedtv-0.icu/pt-eleven1',
        category: 'portugal'
      },
      {
        id: 'pt-eleven3',
        name: 'PT - Eleven 3',
        embedUrl: 'https://embedtv-0.icu/pt-eleven3',
        category: 'portugal'
      },
      {
        id: 'pt-eleven4',
        name: 'PT - Eleven 4',
        embedUrl: 'https://embedtv-0.icu/pt-eleven4',
        category: 'portugal'
      },
      {
        id: 'pt-eleven5',
        name: 'PT - Eleven 5',
        embedUrl: 'https://embedtv-0.icu/pt-eleven5',
        category: 'portugal'
      },
      {
        id: 'pt-eleven6',
        name: 'PT - Eleven 6',
        embedUrl: 'https://embedtv-0.icu/pt-eleven6',
        category: 'portugal'
      }
    ]
  },
  {
    id: 'adultos',
    name: 'Adultos',
    channels: [
      {
        id: 'play-boy',
        name: 'Play Boy',
        embedUrl: 'https://embedtv-0.icu/play-boy',
        category: 'adultos'
      },
      {
        id: 'sexy-hot',
        name: 'Sexy Hot',
        embedUrl: 'https://embedtv-0.icu/sexy-hot',
        category: 'adultos'
      }
    ]
  }
];
