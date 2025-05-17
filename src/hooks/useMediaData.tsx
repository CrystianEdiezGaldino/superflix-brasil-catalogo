
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMoviesData } from "./media/useMoviesData";
import { useSeriesData } from "./media/useSeriesData";
import { useAnimeData } from "./media/useAnimeData";
import { useDoramaData } from "./media/useDoramaData";

export const useMediaData = () => {
  const { isLoading: subscriptionLoading } = useSubscription();
  
  // Import data from specialized hooks
  const { 
    moviesData, 
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    isLoading: moviesLoading, 
    hasError: moviesError 
  } = useMoviesData();
  
  const { 
    seriesData, 
    popularSeriesData,
    isLoading: seriesLoading, 
    hasError: seriesError 
  } = useSeriesData();
  
  const { 
    animeData, 
    topRatedAnimeData,
    recentAnimesData,
    isLoading: animeLoading, 
    hasError: animeError 
  } = useAnimeData();
  
  const { 
    doramasData, 
    isLoading: doramasLoading, 
    hasError: doramasError 
  } = useDoramaData();

  // Combined loading and error states
  const isLoading = 
    subscriptionLoading || 
    moviesLoading || 
    seriesLoading || 
    animeLoading ||
    doramasLoading;
    
  const hasError = 
    moviesError || 
    seriesError || 
    animeError ||
    doramasError;

  // Return all data in a structured format
  return {
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    popularSeriesData,
    recentAnimesData,
    isLoading,
    hasError
  };
};
