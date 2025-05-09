
import { MediaItem } from "@/types/movie";

export const popularSeries: MediaItem[] = [
  { 
    id: 1, 
    name: "Eu, a Patroa e as Crianças", 
    overview: "Uma sitcom sobre uma família moderna.",
    poster_path: "/tXcJrFrSFVcpXTLcHAzU3AvlkUV.jpg", 
    backdrop_path: "/tXcJrFrSFVcpXTLcHAzU3AvlkUV.jpg",
    first_air_date: "2001-03-28",
    media_type: "tv",
    vote_average: 8.3,
    original_language: "en"
  },
  { 
    id: 2, 
    name: "Dois Homens e Meio", 
    overview: "Comédia sobre dois irmãos vivendo juntos.",
    poster_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg", 
    backdrop_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg",
    first_air_date: "2003-09-22",
    media_type: "tv",
    vote_average: 7.8,
    original_language: "en"
  },
  { 
    id: 3, 
    name: "The Big Bang Theory", 
    overview: "Uma série sobre físicos nerds e sua vizinha.",
    poster_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg", 
    backdrop_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg",
    first_air_date: "2007-09-24",
    media_type: "tv",
    vote_average: 8.1,
    original_language: "en"
  },
  { 
    id: 4, 
    name: "Chaves", 
    overview: "Série mexicana sobre um garoto que vive em uma vila.",
    poster_path: "/8D83nX7YFhR8YcvrJcnJ2PDgah5.jpg", 
    backdrop_path: "/8D83nX7YFhR8YcvrJcnJ2PDgah5.jpg",
    first_air_date: "1973-02-26",
    media_type: "tv",
    vote_average: 8.5,
    original_language: "es"
  },
  { 
    id: 5, 
    name: "Todo Mundo Odeia o Chris", 
    overview: "Baseada na adolescência de Chris Rock.",
    poster_path: "/3NbGsr4VgwugmZ7QA7k3SVIUeCo.jpg", 
    backdrop_path: "/3NbGsr4VgwugmZ7QA7k3SVIUeCo.jpg",
    first_air_date: "2005-09-22",
    media_type: "tv",
    vote_average: 8.4,
    original_language: "en"
  },
  { 
    id: 6, 
    name: "Friends", 
    overview: "Seis amigos, uma cafeteria e muita diversão.",
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg", 
    backdrop_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    first_air_date: "1994-09-22",
    media_type: "tv",
    vote_average: 8.4,
    original_language: "en"
  },
  { 
    id: 7, 
    name: "Um Maluco no Pedaço", 
    overview: "Will Smith se muda para Bel-Air.",
    poster_path: "/1BmrF4J9fj2tT2zgfXrRnLQ1wWi.jpg", 
    backdrop_path: "/1BmrF4J9fj2tT2zgfXrRnLQ1wWi.jpg",
    first_air_date: "1990-09-10",
    media_type: "tv",
    vote_average: 8.2,
    original_language: "en"
  },
  { 
    id: 8, 
    name: "How I Met Your Mother", 
    overview: "Ted conta aos seus filhos como conheceu a mãe deles.",
    poster_path: "/izncB6dCLV7LBQ5JcdNnUZt3vc9.jpg", 
    backdrop_path: "/izncB6dCLV7LBQ5JcdNnUZt3vc9.jpg",
    first_air_date: "2005-09-19",
    media_type: "tv",
    vote_average: 8.0,
    original_language: "en"
  },
  { 
    id: 9, 
    name: "That '70s Show", 
    overview: "Adolescentes nos anos 70.",
    poster_path: "/k2RjYOJ7nj68PwPJUzNueW6qGX5.jpg", 
    backdrop_path: "/k2RjYOJ7nj68PwPJUzNueW6qGX5.jpg",
    first_air_date: "1998-08-23",
    media_type: "tv",
    vote_average: 7.9,
    original_language: "en"
  },
  { 
    id: 10, 
    name: "Supernatural", 
    overview: "Dois irmãos caçam criaturas sobrenaturais.",
    poster_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg", 
    backdrop_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg",
    first_air_date: "2005-09-13",
    media_type: "tv",
    vote_average: 8.3,
    original_language: "en"
  }
];

// Função para filtrar conteúdo sem imagens
export const getFilteredSeries = () => {
  return popularSeries.filter(
    series => series.poster_path || series.backdrop_path
  );
};
