
import { MediaItem } from "./movie";

export interface ContentCalendarItem extends MediaItem {
  // All properties needed are already in MediaItem
  // This is just to make the type explicit and allow for future extensions
}
