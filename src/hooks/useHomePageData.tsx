import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies, 
  fetchRecentMovies,
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchTrendingSeries,
  fetchKoreanDramas,
  fetchPopularKoreanDramas,
  fetchTopRatedKoreanDramas
} from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

const useHomePageData = () => {
  const { user } = useAuth();
  const { isAdmin, isSubscribed, hasTrialAccess } = useSubscription();

  // Fetch movies data
  const { data: moviesData = [], isLoading: moviesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeMovies'],
    queryFn: () => fetchPopularMovies(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const { data: trendingMovies = [], isLoading: trendingMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeTrendingMovies'],
    queryFn: () => fetchTrendingMovies(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: topRatedMovies = [], isLoading: topRatedMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeTopRatedMovies'],
    queryFn: () => fetchTopRatedMovies(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: recentMovies = [], isLoading: recentMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeRecentMovies'],
    queryFn: () => fetchRecentMovies(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  // Fetch series data
  const { data: seriesData = [], isLoading: seriesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeSeries'],
    queryFn: () => fetchPopularSeries(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: trendingSeries = [], isLoading: trendingSeriesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeTrendingSeries'],
    queryFn: () => fetchTrendingSeries(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: topRatedSeries = [], isLoading: topRatedSeriesLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeTopRatedSeries'],
    queryFn: () => fetchTopRatedSeries(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  // Fetch doramas data
  const { data: doramasData = [], isLoading: doramasLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeDoramas'],
    queryFn: () => fetchKoreanDramas(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: topRatedDoramasData = [], isLoading: topRatedDoramasLoading } = useQuery<MediaItem[]>({
    queryKey: ['homeTopRatedDoramas'],
    queryFn: () => fetchTopRatedKoreanDramas(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  const { data: popularDoramasData = [], isLoading: popularDoramasLoading } = useQuery<MediaItem[]>({
    queryKey: ['homePopularDoramas'],
    queryFn: () => fetchPopularKoreanDramas(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  // Memoize loading state
  const isLoading = useMemo(() => {
    return moviesLoading || 
           trendingMoviesLoading || 
           topRatedMoviesLoading || 
           recentMoviesLoading ||
           seriesLoading ||
           trendingSeriesLoading ||
           topRatedSeriesLoading ||
           doramasLoading ||
           topRatedDoramasLoading ||
           popularDoramasLoading;
  }, [
    moviesLoading,
    trendingMoviesLoading,
    topRatedMoviesLoading,
    recentMoviesLoading,
    seriesLoading,
    trendingSeriesLoading,
    topRatedSeriesLoading,
    doramasLoading,
    topRatedDoramasLoading,
    popularDoramasLoading
  ]);

  // Memoize section data
  const sectionData = useMemo(() => ({
    movies: { hasMore: true },
    series: { hasMore: true },
    actionMovies: { hasMore: true },
    comedyMovies: { hasMore: true }
  }), []);

  // Memoize load more handler
  const handleLoadMoreSection = useCallback((section: string) => {
    // Implement load more logic here
  }, []);

  return {
    user,
    isAdmin,
    hasAccess: isSubscribed,
    hasTrialAccess,
    featuredMedia: trendingMovies[0] || null,
    recommendations: trendingMovies.slice(0, 10),
    moviesData,
    seriesData,
    doramasData,
    actionMoviesData: topRatedMovies,
    comedyMoviesData: recentMovies,
    adventureMoviesData: trendingMovies,
    sciFiMoviesData: topRatedMovies,
    marvelMoviesData: topRatedMovies,
    dcMoviesData: topRatedMovies,
    popularContent: trendingSeries,
    isLoading,
    hasError: null,
    searchResults: [],
    isSearchLoading: false,
    sectionData,
    handleLoadMoreSection
  };
};

export default useHomePageData;
