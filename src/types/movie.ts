export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: Genre[];
  runtime: number;
  status: string;
  media_type: 'movie';
  external_ids?: {
    imdb_id: string;
  };
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  recommendations?: {
    results: Movie[];
  };
}

export interface Series {
  id: number;
  name: string;
  original_name: string;
  original_language: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  media_type: 'tv';
  external_ids?: {
    imdb_id: string;
  };
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  recommendations?: {
    results: Series[];
  };
  seasons: Season[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  air_date: string;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  air_date: string;
  vote_average: number;
  vote_count: number;
  season_number: number;
}

export type MediaItem = Movie | Series;

// Type guard to verify if it's a Movie
export function isMovie(media: MediaItem): media is Movie {
  return media.media_type === 'movie';
}

// Type guard to verify if it's a Series
export function isSeries(media: MediaItem): media is Series {
  return media.media_type === 'tv';
}

// Helper function to get the title or name from a MediaItem
export function getMediaTitle(media: MediaItem): string {
  return isMovie(media) ? media.title : media.name;
}

// Helper function to get the release date or first air date from a MediaItem
export function getMediaReleaseDate(media: MediaItem): string | undefined {
  return isMovie(media) ? media.release_date : media.first_air_date;
}
