
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";

export const useFeaturedMedia = (
  hasAccess: boolean,
  user: any,
  movieData: MediaItem[],
  seriesData: MediaItem[],
  animeData: MediaItem[],
  topRatedAnimeData: MediaItem[],
  doramasData: MediaItem[]
) => {
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);

  // Select a random item for the banner
  useEffect(() => {
    if (!user) return;
    
    // If user has access to premium content, include all media
    if (hasAccess) {
      const allMedia = [
        ...(movieData || []),
        ...(seriesData || []),
        ...(animeData || []),
        ...(topRatedAnimeData || []),
        ...(doramasData || [])
      ];
      
      if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        setFeaturedMedia(allMedia[randomIndex]);
      }
    } else {
      // Show preview content only
      const freeMedia = [
        ...(movieData || []).slice(0, 2),
        ...(seriesData || []).slice(0, 2),
        ...(animeData || []).slice(0, 2)
      ];
      
      if (freeMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * freeMedia.length);
        setFeaturedMedia(freeMedia[randomIndex]);
      }
    }
  }, [
    user,
    hasAccess,
    movieData, 
    seriesData, 
    animeData, 
    topRatedAnimeData, 
    doramasData
  ]);

  return { featuredMedia };
};
