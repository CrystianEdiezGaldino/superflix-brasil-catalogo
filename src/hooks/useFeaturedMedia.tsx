
import { useState, useEffect, useMemo } from "react";
import { MediaItem } from "@/types/movie";

export const useFeaturedMedia = (
  hasAccess: boolean,
  user: any,
  movieData: MediaItem[] = [],
  seriesData: MediaItem[] = [],
  animeData: MediaItem[] = [],
  topRatedAnimeData: MediaItem[] = [],
  doramasData: MediaItem[] = [],
  recommendations: MediaItem[] = []
) => {
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);

  // Memoize the media arrays to prevent unnecessary recalculations
  const safeMediaArrays = useMemo(() => ({
    movieData: Array.isArray(movieData) ? movieData : [],
    seriesData: Array.isArray(seriesData) ? seriesData : [],
    animeData: Array.isArray(animeData) ? animeData : [],
    topRatedAnimeData: Array.isArray(topRatedAnimeData) ? topRatedAnimeData : [],
    doramasData: Array.isArray(doramasData) ? doramasData : [],
    recommendations: Array.isArray(recommendations) ? recommendations : []
  }), [movieData, seriesData, animeData, topRatedAnimeData, doramasData, recommendations]);

  useEffect(() => {
    if (!user) return;
    
    // Se houver recomendações, priorize-as
    if (hasAccess && safeMediaArrays.recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * safeMediaArrays.recommendations.length);
      setFeaturedMedia(safeMediaArrays.recommendations[randomIndex]);
      return;
    }
    
    // If user has access to premium content (including trial access), include all media
    if (hasAccess) {
      const allMedia = [
        ...safeMediaArrays.movieData,
        ...safeMediaArrays.seriesData,
        ...safeMediaArrays.animeData,
        ...safeMediaArrays.topRatedAnimeData,
        ...safeMediaArrays.doramasData
      ].filter(Boolean);
      
      if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        setFeaturedMedia(allMedia[randomIndex]);
      }
    } else {
      // Show preview content only
      const freeMedia = [
        ...safeMediaArrays.movieData.slice(0, 2),
        ...safeMediaArrays.seriesData.slice(0, 2),
        ...safeMediaArrays.animeData.slice(0, 2)
      ].filter(Boolean);
      
      if (freeMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * freeMedia.length);
        setFeaturedMedia(freeMedia[randomIndex]);
      }
    }
  }, [user, hasAccess, safeMediaArrays]);

  return { featuredMedia };
};
