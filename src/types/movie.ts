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
  recommendations?: {
    results: MediaItem[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
  original_name?: string;
  
  // Add these missing properties used in series and animes data
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  origin_country?: string[];
  seasons?: Season[];
  
  // Add production companies and networks for streaming service filtering
  production_companies?: {
    id: number;
    name: string;
    logo_path?: string | null;
    origin_country?: string;
  }[];
  networks?: {
    id: number;
    name: string;
    logo_path?: string | null;
    origin_country?: string;
  }[];
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
  origin_country?: string[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes?: Episode[];
  air_date?: string;
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

// Add type guards for movie and series
export const isMovie = (media: MediaItem): media is Movie => {
  return media?.media_type === 'movie' || (!!media?.title && !!media?.release_date);
};

export const isSeries = (media: MediaItem): media is Series => {
  return media?.media_type === 'tv' || (!!media?.name && !!media?.first_air_date);
};

// Add helper function to check if it's an anime (Japanese series)
export const isAnime = (media: MediaItem): boolean => {
  return isSeries(media) && (media.original_language === 'ja' || 
    (media.origin_country && media.origin_country.includes('JP')));
};

// Add helper function to check if it's a dorama (Korean series)
export const isDorama = (media: MediaItem): boolean => {
  return isSeries(media) && (media.original_language === 'ko' || 
    (media.origin_country && media.origin_country.includes('KR')));
};
