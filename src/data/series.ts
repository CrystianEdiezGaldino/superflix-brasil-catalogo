
import { MediaItem } from "@/types/movie";

export const popularSeries: MediaItem[] = [
  { 
    id: 2, 
    name: "Dois Homens e Meio", 
    title: "Dois Homens e Meio",
    overview: "Comédia sobre dois irmãos vivendo juntos.",
    poster_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg", 
    backdrop_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg",
    first_air_date: "2003-09-22",
    release_date: "2003-09-22",
    media_type: "tv",
    vote_average: 7.8,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "en"
  },
  { 
    id: 3, 
    name: "The Big Bang Theory", 
    title: "The Big Bang Theory",
    overview: "Uma série sobre físicos nerds e sua vizinha.",
    poster_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg", 
    backdrop_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg",
    first_air_date: "2007-09-24",
    release_date: "2007-09-24",
    media_type: "tv",
    vote_average: 8.1,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "en"
  },
  { 
    id: 6, 
    name: "Friends", 
    title: "Friends",
    overview: "Seis amigos, uma cafeteria e muita diversão.",
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg", 
    backdrop_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    first_air_date: "1994-09-22",
    release_date: "1994-09-22",
    media_type: "tv",
    vote_average: 8.4,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "en"
  },
  { 
    id: 10, 
    name: "Supernatural", 
    title: "Supernatural",
    overview: "Dois irmãos caçam criaturas sobrenaturais.",
    poster_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg", 
    backdrop_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg",
    first_air_date: "2005-09-13",
    release_date: "2005-09-13",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "en"
  }
];

// Função para filtrar conteúdo sem imagens
export const getFilteredSeries = () => {
  return popularSeries.filter(
    series => series.poster_path || series.backdrop_path
  );
};
