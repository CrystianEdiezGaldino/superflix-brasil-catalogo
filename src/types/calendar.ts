
import { MediaItem, Movie, Series } from "./movie";

// Define ContentCalendarItem interface as an extension of MediaItem
export interface ContentCalendarItem extends MediaItem {
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
