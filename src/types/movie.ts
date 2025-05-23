export interface MediaItem {
  adult?: boolean;
  backdrop_path: string | null;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity?: number;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
  video?: boolean;
  vote_average: number;
  vote_count?: number;
  media_type?: 'movie' | 'tv';
  genres?: Genre[];
  external_ids?: {
    imdb_id?: string;
  };
  imdb_id?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie extends MediaItem {
  title: string;
  release_date: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
}

export interface Series extends MediaItem {
  name: string;
  first_air_date: string;
  seasons?: Season[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  vote_average: number;
  air_date: string;
}

export const getMediaTitle = (media: MediaItem): string => {
  return media?.title || media?.name || 'Título desconhecido';
};
