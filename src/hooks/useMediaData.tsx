
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { 
  fetchPopularMovies, 
  fetchPopularSeries, 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchKoreanDramas
} from "@/services/tmdbApi";

export const useMediaData = () => {
  const { user } = useAuth();
  const { isLoading: subscriptionLoading } = useSubscription();
  const { hasAccess } = useAccessControl();

  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch popular TV series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch popular anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch top rated anime
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(),
    enabled: !!user && hasAccess, // Only fetch if user has access
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch Korean dramas
  const doramasQuery = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: () => fetchKoreanDramas(),
    enabled: !!user && hasAccess, // Only fetch if user has access
    staleTime: 1000 * 60 * 5
  });

  const isLoading = 
    subscriptionLoading || 
    moviesQuery.isPending || 
    seriesQuery.isPending || 
    animeQuery.isPending;
    
  const hasError = 
    moviesQuery.isError || 
    seriesQuery.isError || 
    animeQuery.isError;

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
