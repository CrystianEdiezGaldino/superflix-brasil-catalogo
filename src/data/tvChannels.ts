
import { TvChannel } from "@/types/tvChannel";

// Define channel categories
export const channelCategories = [
  {
    id: "entertainment",
    name: "Entretenimento",
    channels: [
      {
        id: "globo",
        name: "Globo",
        logo: "https://logodownload.org/wp-content/uploads/2013/12/rede-globo-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCJ1JhlOxfKI_r8XQCrJgUZw",
        category: "entertainment"
      },
      {
        id: "record",
        name: "Record TV",
        logo: "https://logodownload.org/wp-content/uploads/2013/12/record-tv-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCJ2KjOQrYCgL3ffjrQxnK7A",
        category: "entertainment"
      },
      {
        id: "sbt",
        name: "SBT",
        logo: "https://logodownload.org/wp-content/uploads/2013/12/sbt-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCvaP_dY2zGFBtm42QalBKeQ",
        category: "entertainment"
      },
      {
        id: "band",
        name: "Band",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/band-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCoa-D_VfMkFrCYoB2mKl5Xw",
        category: "entertainment"
      },
      {
        id: "redetv",
        name: "RedeTV",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/redetv-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCB-JdxN_ni1q50z0eg6iVlg",
        category: "entertainment"
      }
    ]
  },
  {
    id: "news",
    name: "Notícias",
    channels: [
      {
        id: "globonews",
        name: "GloboNews",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/globo-news-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCJEMj9NDbSItoQ8yBF5rjbg",
        category: "news"
      },
      {
        id: "cnnbrasil",
        name: "CNN Brasil",
        logo: "https://logodownload.org/wp-content/uploads/2020/01/cnn-brasil-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCvdwhh_fDyWccR42-rReZLw",
        category: "news"
      },
      {
        id: "recordnews",
        name: "Record News",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/record-news-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCuiLR4p6wQ3xLEm15pEn1Xw",
        category: "news"
      },
      {
        id: "jovempan",
        name: "Jovem Pan News",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/jovem-pan-logo-8.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCP391YRAjSOdM_bwievgaZA",
        category: "news"
      }
    ]
  },
  {
    id: "sports",
    name: "Esportes",
    channels: [
      {
        id: "sportv",
        name: "SporTV",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/sportv-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCLRvhUr_WmpLfLRWwQC6L6g",
        category: "sports"
      },
      {
        id: "espn",
        name: "ESPN Brasil",
        logo: "https://logodownload.org/wp-content/uploads/2015/05/espn-logo-4.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UC35GJ0AzEbQlxrKp5EQdgxA",
        category: "sports"
      },
      {
        id: "foxsports",
        name: "Fox Sports",
        logo: "https://logodownload.org/wp-content/uploads/2018/10/fox-sports-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCCS1c1Sw9P_j2MGx0CMcYJw",
        category: "sports"
      }
    ]
  },
  {
    id: "movies",
    name: "Filmes",
    channels: [
      {
        id: "telecine",
        name: "Telecine",
        logo: "https://logodownload.org/wp-content/uploads/2020/10/telecine-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCgxkVh4ND2wQ0lWbVj5ppjA",
        category: "movies"
      },
      {
        id: "hbo",
        name: "HBO",
        logo: "https://logodownload.org/wp-content/uploads/2020/10/hbo-logo-3.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCJ1JhlOxfKI_r8XQCrJgUZw",
        category: "movies"
      }
    ]
  },
  {
    id: "kids",
    name: "Infantil",
    channels: [
      {
        id: "cartoonnetwork",
        name: "Cartoon Network",
        logo: "https://logodownload.org/wp-content/uploads/2018/07/cartoon-network-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCaFSAaeI3O7jh0fOqfD2qgw",
        category: "kids"
      },
      {
        id: "disney",
        name: "Disney Channel",
        logo: "https://logodownload.org/wp-content/uploads/2017/11/disney-channel-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCC5H3iT9uFVOEXdX2g7Lgyw",
        category: "kids"
      },
      {
        id: "nickelodeon",
        name: "Nickelodeon",
        logo: "https://logodownload.org/wp-content/uploads/2018/11/nickelodeon-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UC2J7DGjtd0dMylnP8m3VJ9w",
        category: "kids"
      },
      {
        id: "discoverykids",
        name: "Discovery Kids",
        logo: "https://logodownload.org/wp-content/uploads/2018/04/discovery-kids-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCUFIp-6wIcZxKTcWR7vmxkA",
        category: "kids"
      }
    ]
  },
  {
    id: "documentaries",
    name: "Documentários",
    channels: [
      {
        id: "natgeo",
        name: "National Geographic",
        logo: "https://logodownload.org/wp-content/uploads/2017/04/national-geographic-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCGTVL0R-rC0jJshz8QYrFxQ",
        category: "documentaries"
      },
      {
        id: "discoverychannel",
        name: "Discovery Channel",
        logo: "https://logodownload.org/wp-content/uploads/2017/04/discovery-channel-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCC0bZ-kLCtitj7cK7rctHJw",
        category: "documentaries"
      },
      {
        id: "historychannel",
        name: "History Channel",
        logo: "https://logodownload.org/wp-content/uploads/2020/01/history-channel-logo.png",
        embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCYfdidRxbB8Qhf0Nx7ioOYw",
        category: "documentaries"
      }
    ]
  }
];
