
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  fetchPopularMovies, 
  fetchPopularSeries, 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchKoreanDramas
} from "@/services/tmdbApi";

export const useMediaData = () => {
  const { user } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading
  } = useSubscription();
  
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
    enabled: !!user,
  });

  // Fetch popular TV series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
    enabled: !!user,
  });
  
  // Fetch popular anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
    enabled: !!user,
  });
  
  // Fetch top rated anime
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(),
    enabled: !!user && hasAccess, // Only fetch if user has access
  });
  
  // Fetch Korean dramas
  const doramasQuery = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: () => fetchKoreanDramas(),
    enabled: !!user && hasAccess, // Only fetch if user has access
  });

  const isLoading = 
    subscriptionLoading || 
    moviesQuery.isPending || 
    seriesQuery.isPending || 
    animeQuery.isPending || 
    doramasQuery.isPending;
    
  const hasError = 
    moviesQuery.isError || 
    seriesQuery.isError || 
    animeQuery.isError || 
    doramasQuery.isError;

  return {
    moviesData: moviesQuery.data || [],
    seriesData: seriesQuery.data || [],
    animeData: animeQuery.data || [],
    topRatedAnimeData: topRatedAnimeQuery.data || [],
    doramasData: doramasQuery.data || [],
    isLoading,
    hasError
  };
};
