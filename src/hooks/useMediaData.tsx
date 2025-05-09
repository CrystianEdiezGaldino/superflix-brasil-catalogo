
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMoviesByGenre,
  fetchMoviesByKeyword,
  fetchPopularSeries, 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchKoreanDramas
} from "@/services/tmdbApi";

export const useMediaData = () => {
  const { user } = useAuth();
  const { isLoading: subscriptionLoading } = useSubscription();
  const { hasAccess } = useAccessControl();

  // Debug log user access status
  console.log("useMediaData access status:", { hasAccess, userId: user?.id });

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
  
  // Fetch top rated anime - now properly checking hasAccess
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
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch action movies
  const actionMoviesQuery = useQuery({
    queryKey: ["actionMovies"],
    queryFn: () => fetchMoviesByGenre(28), // 28 is action genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch comedy movies
  const comedyMoviesQuery = useQuery({
    queryKey: ["comedyMovies"],
    queryFn: () => fetchMoviesByGenre(35), // 35 is comedy genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch adventure movies
  const adventureMoviesQuery = useQuery({
    queryKey: ["adventureMovies"],
    queryFn: () => fetchMoviesByGenre(12), // 12 is adventure genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch sci-fi movies
  const sciFiMoviesQuery = useQuery({
    queryKey: ["sciFiMovies"],
    queryFn: () => fetchMoviesByGenre(878), // 878 is sci-fi genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch Marvel movies by keyword (Marvel is 180547 in TMDB)
  const marvelMoviesQuery = useQuery({
    queryKey: ["marvelMovies"],
    queryFn: () => fetchMoviesByKeyword(180547),
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch DC movies by keyword (DC is 9715 in TMDB)
  const dcMoviesQuery = useQuery({
    queryKey: ["dcMovies"],
    queryFn: () => fetchMoviesByKeyword(9715),
    enabled: !!user && hasAccess,
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
    actionMoviesData: actionMoviesQuery.data || [],
    comedyMoviesData: comedyMoviesQuery.data || [],
    adventureMoviesData: adventureMoviesQuery.data || [],
    sciFiMoviesData: sciFiMoviesQuery.data || [],
    marvelMoviesData: marvelMoviesQuery.data || [],
    dcMoviesData: dcMoviesQuery.data || [],
    isLoading,
    hasError
  };
};
