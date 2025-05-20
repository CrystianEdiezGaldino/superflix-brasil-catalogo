import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!user) return;
    
    // Garantir que todos os dados são arrays
    const safeMovieData = Array.isArray(movieData) ? movieData : [];
    const safeSeriesData = Array.isArray(seriesData) ? seriesData : [];
    const safeAnimeData = Array.isArray(animeData) ? animeData : [];
    const safeTopRatedAnimeData = Array.isArray(topRatedAnimeData) ? topRatedAnimeData : [];
    const safeDoramasData = Array.isArray(doramasData) ? doramasData : [];
    const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];
    
    // Se houver recomendações, priorize-as
    if (hasAccess && safeRecommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * safeRecommendations.length);
      setFeaturedMedia(safeRecommendations[randomIndex]);
      return;
    }
    
    // If user has access to premium content (including trial access), include all media
    if (hasAccess) {
      const allMedia = [
        ...safeMovieData,
        ...safeSeriesData,
        ...safeAnimeData,
        ...safeTopRatedAnimeData,
        ...safeDoramasData
      ].filter(Boolean);
      
      if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        setFeaturedMedia(allMedia[randomIndex]);
      }
    } else {
      // Show preview content only
      const freeMedia = [
        ...safeMovieData.slice(0, 2),
        ...safeSeriesData.slice(0, 2),
        ...safeAnimeData.slice(0, 2)
      ].filter(Boolean);
      
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
    doramasData,
    recommendations
  ]);

  return { featuredMedia };
};
