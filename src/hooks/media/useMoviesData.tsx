
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMoviesByGenre,
  fetchMoviesByKeyword
} from "@/services/tmdbApi";

export const useMoviesData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(1, 60),
    enabled: isUserAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch action movies
  const actionMoviesQuery = useQuery({
    queryKey: ["actionMovies"],
    queryFn: () => fetchMoviesByGenre(28, 1, 60), // 28 is action genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch comedy movies
  const comedyMoviesQuery = useQuery({
    queryKey: ["comedyMovies"],
    queryFn: () => fetchMoviesByGenre(35, 1, 60), // 35 is comedy genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch adventure movies
  const adventureMoviesQuery = useQuery({
    queryKey: ["adventureMovies"],
    queryFn: () => fetchMoviesByGenre(12, 1, 60), // 12 is adventure genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch sci-fi movies
  const sciFiMoviesQuery = useQuery({
    queryKey: ["sciFiMovies"],
    queryFn: () => fetchMoviesByGenre(878, 1, 60), // 878 is sci-fi genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch Marvel movies by keyword
  const marvelMoviesQuery = useQuery({
    queryKey: ["marvelMovies"],
    queryFn: () => fetchMoviesByKeyword(180547, 1, 60),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch DC movies by keyword
  const dcMoviesQuery = useQuery({
    queryKey: ["dcMovies"],
    queryFn: () => fetchMoviesByKeyword(9715, 1, 60),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = 
    moviesQuery.isPending || 
    actionMoviesQuery.isPending || 
    comedyMoviesQuery.isPending;
    
  const hasError = 
    moviesQuery.isError || 
    actionMoviesQuery.isError || 
    comedyMoviesQuery.isError;

  return {
    moviesData: moviesQuery.data || [],
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
