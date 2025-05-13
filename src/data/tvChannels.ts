
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
        id: 'globo',
        name: 'Globo',
        logo: 'https://logodownload.org/wp-content/uploads/2013/12/rede-globo-logo-0.png',
        embedUrl: 'https://embedtv.digital/globo',
        category: 'abertos'
      },
      {
        id: 'sbt',
        name: 'SBT',
        logo: 'https://logodownload.org/wp-content/uploads/2013/12/sbt-logo-1.png',
        embedUrl: 'https://embedtv.digital/sbt',
        category: 'abertos'
      },
      {
        id: 'record',
        name: 'Record',
        logo: 'https://upload.wikimedia.org/wikipedia/pt/1/10/Logotipo_da_RecordTV.png',
        embedUrl: 'https://embedtv.digital/record',
        category: 'abertos'
      },
      {
        id: 'band',
        name: 'Band',
        logo: 'https://logodownload.org/wp-content/uploads/2014/02/band-logo-1.png',
        embedUrl: 'https://embedtv.digital/band',
        category: 'abertos'
      },
      {
        id: 'redetv',
        name: 'RedeTV',
        logo: 'https://upload.wikimedia.org/wikipedia/pt/8/89/RedeTV%21_logo.png',
        embedUrl: 'https://embedtv.digital/redetv',
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
        name: 'SporTV',
        logo: 'https://logodownload.org/wp-content/uploads/2017/07/sportv-logo-0.png',
        embedUrl: 'https://embedtv.digital/sportv',
        category: 'esportes'
      },
      {
        id: 'espn',
        name: 'ESPN',
        logo: 'https://logodownload.org/wp-content/uploads/2015/05/espn-logo-4.png',
        embedUrl: 'https://embedtv.digital/espn',
        category: 'esportes'
      },
      {
        id: 'fox-sports',
        name: 'Fox Sports',
        logo: 'https://logodownload.org/wp-content/uploads/2018/10/fox-sports-logo-0.png',
        embedUrl: 'https://embedtv.digital/fox-sports',
        category: 'esportes'
      },
      {
        id: 'premiere',
        name: 'Premiere',
        logo: 'https://logodownload.org/wp-content/uploads/2017/11/premiere-fc-logo-0.png',
        embedUrl: 'https://embedtv.digital/premiere',
        category: 'esportes'
      }
    ]
  },
  {
    id: 'filmes',
    name: 'Filmes e Séries',
    channels: [
      {
        id: 'telecine',
        name: 'Telecine',
        logo: 'https://logodownload.org/wp-content/uploads/2019/12/telecine-logo-0.png',
        embedUrl: 'https://embedtv.digital/telecine',
        category: 'filmes'
      },
      {
        id: 'hbo',
        name: 'HBO',
        logo: 'https://logodownload.org/wp-content/uploads/2017/04/hbo-logo-1.png',
        embedUrl: 'https://embedtv.digital/hbo',
        category: 'filmes'
      },
      {
        id: 'warner-channel',
        name: 'Warner Channel',
        logo: 'https://logodownload.org/wp-content/uploads/2018/10/warner-channel-logo-1.png',
        embedUrl: 'https://embedtv.digital/warner-channel',
        category: 'filmes'
      },
      {
        id: 'fox',
        name: 'Fox Channel',
        logo: 'https://logodownload.org/wp-content/uploads/2018/07/fox-channel-logo.png',
        embedUrl: 'https://embedtv.digital/fox-channel',
        category: 'filmes'
      },
      {
        id: 'universal',
        name: 'Universal',
        logo: 'https://logodownload.org/wp-content/uploads/2018/07/universal-channel-logo-1.png',
        embedUrl: 'https://embedtv.digital/universal-channel',
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
        logo: 'https://logodownload.org/wp-content/uploads/2018/06/cartoon-network-logo-4.png',
        embedUrl: 'https://embedtv.digital/cartoon-network',
        category: 'infantis'
      },
      {
        id: 'disney',
        name: 'Disney Channel',
        logo: 'https://logodownload.org/wp-content/uploads/2020/01/disney-channel-logo-1.png',
        embedUrl: 'https://embedtv.digital/disney-channel',
        category: 'infantis'
      },
      {
        id: 'nick',
        name: 'Nickelodeon',
        logo: 'https://logodownload.org/wp-content/uploads/2018/11/nickelodeon-logo-1.png',
        embedUrl: 'https://embedtv.digital/nickelodeon',
        category: 'infantis'
      },
      {
        id: 'discovery-kids',
        name: 'Discovery Kids',
        logo: 'https://logodownload.org/wp-content/uploads/2018/05/discovery-kids-logo-1.png',
        embedUrl: 'https://embedtv.digital/discovery-kids',
        category: 'infantis'
      }
    ]
  },
  {
    id: 'documentarios',
    name: 'Documentários',
    channels: [
      {
        id: 'discovery',
        name: 'Discovery Channel',
        logo: 'https://logodownload.org/wp-content/uploads/2017/04/discovery-channel-logo-8.png',
        embedUrl: 'https://embedtv.digital/discovery-channel',
        category: 'documentarios'
      },
      {
        id: 'natgeo',
        name: 'National Geographic',
        logo: 'https://logodownload.org/wp-content/uploads/2017/04/national-geographic-logo-9.png',
        embedUrl: 'https://embedtv.digital/national-geographic',
        category: 'documentarios'
      },
      {
        id: 'history',
        name: 'History',
        logo: 'https://logodownload.org/wp-content/uploads/2017/04/history-channel-logo-1.png',
        embedUrl: 'https://embedtv.digital/history',
        category: 'documentarios'
      }
    ]
  },
  {
    id: 'noticias',
    name: 'Notícias',
    channels: [
      {
        id: 'globonews',
        name: 'GloboNews',
        logo: 'https://logodownload.org/wp-content/uploads/2017/07/globo-news-logo.png',
        embedUrl: 'https://embedtv.digital/globonews',
        category: 'noticias'
      },
      {
        id: 'record-news',
        name: 'Record News',
        logo: 'https://logodownload.org/wp-content/uploads/2017/11/record-news-logo-1.png',
        embedUrl: 'https://embedtv.digital/record-news',
        category: 'noticias'
      },
      {
        id: 'cnn-brasil',
        name: 'CNN Brasil',
        logo: 'https://logodownload.org/wp-content/uploads/2019/07/cnn-logo-0.png',
        embedUrl: 'https://embedtv.digital/cnn-brasil',
        category: 'noticias'
      }
    ]
  }
];
