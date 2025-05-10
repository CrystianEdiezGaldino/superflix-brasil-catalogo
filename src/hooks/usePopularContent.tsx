
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { fetchPopularAmericanSeries, fetchRecentAnime } from "@/services/tmdbApi";

export const usePopularContent = (userId: string | undefined) => {
  const [popularSeries, setPopularSeries] = useState<MediaItem[]>([]);
  const [recentAnimes, setRecentAnimes] = useState<MediaItem[]>([]);
  const [isLoadingPopularSeries, setIsLoadingPopularSeries] = useState(false);
  const [isLoadingRecentAnimes, setIsLoadingRecentAnimes] = useState(false);
  
  // List of popular sitcoms and American series IDs
  const POPULAR_SERIES_IDS = [
    1668,   // Friends
    2316,   // The Office (US)
    4556,   // How I Met Your Mother
    1402,   // The Walking Dead
    1396,   // Breaking Bad
    46952,  // Stranger Things
    60735,  // The Flash
    60625,  // Rick and Morty
    1412,   // Arrow
    1399,   // Game of Thrones
    1434,   // Family Guy
    66732,  // Stranger Things
    2734,   // Law & Order: Special Victims Unit
    1418,   // The Big Bang Theory
    2190,   // South Park
    1438,   // The Wire
    1416,   // Grey's Anatomy
    1622,   // Supernatural
    63174,  // Lucifer
    60573   // Silicon Valley
  ];

  // Fetch popular American series
  useEffect(() => {
    const loadPopularSeries = async () => {
      if (!userId) return;
      
      setIsLoadingPopularSeries(true);
      try {
        // Fetch 60 items to have enough content
        const series = await fetchPopularAmericanSeries(1, 60);
        
        // Prioritize our list of popular series
        const prioritizedSeries = [...series];
        prioritizedSeries.sort((a, b) => {
          const aIndex = POPULAR_SERIES_IDS.indexOf(a.id);
          const bIndex = POPULAR_SERIES_IDS.indexOf(b.id);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          } else if (aIndex !== -1) {
            return -1;
          } else if (bIndex !== -1) {
            return 1;
          }
          
          return (b.vote_average || 0) - (a.vote_average || 0);
        });
        
        setPopularSeries(prioritizedSeries);
      } catch (error) {
        console.error("Error loading popular series:", error);
      } finally {
        setIsLoadingPopularSeries(false);
      }
    };
    
    loadPopularSeries();
  }, [userId]);
  
  // Fetch recent anime
  useEffect(() => {
    const loadRecentAnimes = async () => {
      if (!userId) return;
      
      setIsLoadingRecentAnimes(true);
      try {
        // Fetch 60 items for initial load
        const animes = await fetchRecentAnime(1, 60);
        setRecentAnimes(animes);
      } catch (error) {
        console.error("Error loading recent animes:", error);
      } finally {
        setIsLoadingRecentAnimes(false);
      }
    };
    
    loadRecentAnimes();
  }, [userId]);
  
  return {
    popularSeries,
    recentAnimes,
    isLoadingPopularSeries,
    isLoadingRecentAnimes,
  };
};
