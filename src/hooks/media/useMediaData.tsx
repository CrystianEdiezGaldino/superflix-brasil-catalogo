
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMoviesData } from "./useMoviesData";
import { useSeriesData } from "./useSeriesData";
import { useAnimeData } from "./useAnimeData";
import { useDoramaData } from "./useDoramaData";

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
  
  // Ajustado para usar o tipo de retorno correto
  const { 
    doramas, 
    isLoading: doramasLoading, 
    error: doramasError 
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
    !!doramasError;

  // Return all data in a structured format
  return {
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData: doramas, // Corrigido para usar o nome correto
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
