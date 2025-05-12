
import { MediaItem } from "@/types/movie";

export const popularAnimes: MediaItem[] = [
  {
    id: 11,
    name: "Naruto",
    overview: "Jovem ninja busca reconhecimento e sonha em se tornar Hokage.",
    poster_path: "/9ptbVZpKNy5NY9D4zq4KGiYWRQY.jpg",
    backdrop_path: "/9ptbVZpKNy5NY9D4zq4KGiYWRQY.jpg",
    first_air_date: "2002-10-03",
    media_type: "tv",
    vote_average: 8.4,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 12,
    name: "One Piece",
    overview: "Piratas em busca do tesouro One Piece.",
    poster_path: "/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg",
    backdrop_path: "/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg",
    first_air_date: "1999-10-20",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 13,
    name: "Dragon Ball",
    overview: "Goku e seus amigos defendem a Terra.",
    poster_path: "/f2zhRLqwRLrKhEMeIM7Z5buJFo3.jpg",
    backdrop_path: "/f2zhRLqwRLrKhEMeIM7Z5buJFo3.jpg",
    first_air_date: "1986-02-26",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 14,
    name: "Attack on Titan",
    overview: "Humanidade luta contra titãs gigantes.",
    poster_path: "/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    backdrop_path: "/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    first_air_date: "2013-04-07",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 15,
    name: "Demon Slayer",
    overview: "Jovem caça demônios para vingar sua família.",
    poster_path: "/wrCVHdkBlBWdJUZPvnJWcBRuhSY.jpg",
    backdrop_path: "/wrCVHdkBlBWdJUZPvnJWcBRuhSY.jpg",
    first_air_date: "2019-04-06",
    media_type: "tv",
    vote_average: 8.6,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 17,
    name: "Solo Leveling",
    overview: "Caçador fraco ganha poderes únicos.",
    poster_path: "/eCD7WS9h4lCT8N4Xavc9u8R1IGk.jpg",
    backdrop_path: "/eCD7WS9h4lCT8N4Xavc9u8R1IGk.jpg",
    first_air_date: "2024-01-06",
    media_type: "tv",
    vote_average: 8.6,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
  {
    id: 19,
    name: "Fullmetal Alchemist: Brotherhood",
    overview: "Irmãos buscam a Pedra Filosofal.",
    poster_path: "/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg",
    backdrop_path: "/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg",
    first_air_date: "2009-04-05",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 0,
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: "ja"
  },
];

// Função para filtrar conteúdo sem imagens
export const getFilteredAnimes = () => {
  return popularAnimes.filter(
    anime => anime.poster_path || anime.backdrop_path
  );
};
