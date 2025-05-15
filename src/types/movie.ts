export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  media_type: 'movie';
  imdb_id?: string;
  original_language?: string;
  external_ids?: {
    imdb_id?: string;
  };
  name?: string; // Add name as optional property for compatibility
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
  vote_count: number;
  media_type: 'tv';
  imdb_id?: string;
  external_ids?: {
    imdb_id?: string;
  };
  number_of_seasons?: number;
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
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
  };
  recommendations?: {
    results: Array<Series>;
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
