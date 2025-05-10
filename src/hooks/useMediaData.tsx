
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

  // Fetch popular movies - increased limit to 40
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(1, 40),
    enabled: !!user,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch popular TV series - increased limit to 40
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(1, 40),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch popular anime - increased limit to 40
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(1, 40),
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch top rated anime - now properly checking hasAccess - increased limit to 40
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(1, 40),
    enabled: !!user && hasAccess, // Only fetch if user has access
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch Korean dramas - increased limit to 40
  const doramasQuery = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: () => fetchKoreanDramas(1, 40),
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch action movies - increased limit to 40
  const actionMoviesQuery = useQuery({
    queryKey: ["actionMovies"],
    queryFn: () => fetchMoviesByGenre(28, 1, 40), // 28 is action genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch comedy movies - increased limit to 40
  const comedyMoviesQuery = useQuery({
    queryKey: ["comedyMovies"],
    queryFn: () => fetchMoviesByGenre(35, 1, 40), // 35 is comedy genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch adventure movies - increased limit to 40
  const adventureMoviesQuery = useQuery({
    queryKey: ["adventureMovies"],
    queryFn: () => fetchMoviesByGenre(12, 1, 40), // 12 is adventure genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch sci-fi movies - increased limit to 40
  const sciFiMoviesQuery = useQuery({
    queryKey: ["sciFiMovies"],
    queryFn: () => fetchMoviesByGenre(878, 1, 40), // 878 is sci-fi genre ID
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch Marvel movies by keyword (Marvel is 180547 in TMDB) - increased limit to 40
  const marvelMoviesQuery = useQuery({
    queryKey: ["marvelMovies"],
    queryFn: () => fetchMoviesByKeyword(180547, 1, 40),
    enabled: !!user && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch DC movies by keyword (DC is 9715 in TMDB) - increased limit to 40
  const dcMoviesQuery = useQuery({
    queryKey: ["dcMovies"],
    queryFn: () => fetchMoviesByKeyword(9715, 1, 40),
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
