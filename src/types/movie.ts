export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  media_type: 'movie';
  imdb_id?: string;
  original_language?: string;
  external_ids?: {
    imdb_id?: string;
  };
}

export interface Series {
  id: number;
  name: string;
  title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  release_date?: string;
  vote_average: number;
  original_language: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string;
  }>;
  episode_run_time: number[];
  media_type?: 'tv';
  imdb_id?: string;
  external_ids?: {
    imdb_id?: string;
  };
  number_of_seasons?: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
}

export type MediaItem = Movie | Series;

// Type guard para verificar se é um Movie
export function isMovie(media: MediaItem): media is Movie {
  return media.media_type === 'movie';
}

// Type guard para verificar se é uma Series
export function isSeries(media: MediaItem): media is Series {
  return media.media_type === 'tv';
}
