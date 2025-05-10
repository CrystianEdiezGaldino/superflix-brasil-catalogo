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
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  media_type: 'tv';
  imdb_id?: string;
  original_language?: string;
  number_of_seasons?: number;
  external_ids?: {
    imdb_id?: string;
  };
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
