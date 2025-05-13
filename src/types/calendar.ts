import { MediaItem, Movie, Series } from "./movie";

// Making ContentCalendarItem a proper extension of MediaItem to fix type errors
export interface ContentCalendarItem {
  id: number;
  media_type: 'movie' | 'tv';
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  is_new?: boolean;
}

// Type guard to check if ContentCalendarItem is a Movie
export function isCalendarMovie(item: ContentCalendarItem): item is ContentCalendarItem & Movie {
  return item.media_type === 'movie';
}

// Type guard to check if ContentCalendarItem is a Series
export function isCalendarSeries(item: ContentCalendarItem): item is ContentCalendarItem & Series {
  return item.media_type === 'tv';
}
