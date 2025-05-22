
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { useAnimeLoader } from "@/hooks/anime/useAnimeLoader";
import { useMediaData } from "@/hooks/media/useMediaData";

interface SectionRecommendations {
  movies: MediaItem[];
  series: MediaItem[];
  animes: MediaItem[];
  doramas: MediaItem[];
  kids: MediaItem[];
}

export const useSectionRecommendations = (maxItems: number = 5) => {
  const [recommendations, setRecommendations] = useState<SectionRecommendations>({
    movies: [],
    series: [],
    animes: [],
    doramas: [],
    kids: []
  });

  const { 
    recommendedAnimes, 
    topRatedAnimes, 
    trendingAnimes
  } = useAnimeLoader();

  const { 
    moviesData,
    seriesData,
    doramasData
  } = useMediaData();

  // Filter content that has backdrop images (for better visuals in the carousel)
  const filterWithBackdrops = (items: MediaItem[] = []): MediaItem[] => {
    return items
      .filter(item => item && item.backdrop_path)
      .slice(0, maxItems);
  };

  // Get kids content based on some criteria (genre, rating, etc)
  const getKidsContent = (): MediaItem[] => {
    const kidsMovies = (moviesData || [])
      .filter(movie => {
        // Filter by kids-friendly genres (animation, family)
        const genres = movie.genre_ids || [];
        const isKidsFriendly = genres.some(id => 
          [16, 10751].includes(id) // 16 = Animation, 10751 = Family
        );
        
        // Filter by rating (PG, G)
        const isLowRating = (movie.vote_average || 0) < 7.5;
        
        return isKidsFriendly && isLowRating && movie.backdrop_path;
      })
      .slice(0, maxItems);
      
    return kidsMovies;
  };

  useEffect(() => {
    // Update recommendations when data changes
    setRecommendations({
      movies: filterWithBackdrops(moviesData),
      series: filterWithBackdrops(seriesData),
      animes: filterWithBackdrops(recommendedAnimes || trendingAnimes || topRatedAnimes),
      doramas: filterWithBackdrops(doramasData),
      kids: getKidsContent()
    });
  }, [
    moviesData, 
    seriesData, 
    recommendedAnimes,
    topRatedAnimes,
    trendingAnimes,
    doramasData
  ]);

  return recommendations;
};
