
import { MediaItem } from "./movie";

// Making ContentCalendarItem a proper extension of MediaItem to fix type errors
export interface ContentCalendarItem extends MediaItem {
  // Additional calendar-specific fields
  is_new?: boolean;
}
