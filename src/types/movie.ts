
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

export interface BaseMedia {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: Genre[];
  genre_ids: number[];
}

export interface Movie extends BaseMedia {
  title: string;
  release_date: string;
  media_type: "movie";
  original_title: string;
  vote_count?: number;
  popularity?: number;
  runtime: number;
  status: string;
  imdb_id?: string;
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

export interface Series extends BaseMedia {
  name: string;
  first_air_date: string;
  media_type: "tv";
  original_name: string;
  original_language: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  title?: string;
  imdb_id?: string;
  release_date?: string;
  vote_count?: number;
  popularity?: number;
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
export function isMovie(item: MediaItem): item is Movie {
  return item.media_type === "movie";
}

// Type guard to verify if it's a Series
export function isSeries(item: MediaItem): item is Series {
  return item.media_type === "tv";
}

// Helper function to get the title of a media item
export function getMediaTitle(item: MediaItem): string {
  return isMovie(item) ? item.title : item.name;
}

// Helper function to get the release date of a media item
export function getMediaReleaseDate(item: MediaItem): string {
  return isMovie(item) ? item.release_date : item.first_air_date;
}
