
import { MediaItem } from "./movie";

export interface ContentCalendarItem extends MediaItem {
  // This is just extending MediaItem with potentially calendar-specific fields
  // Such as flags for new content
  is_new?: boolean;
}
