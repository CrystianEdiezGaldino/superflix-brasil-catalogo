
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMoviesByGenre
} from "@/services/tmdbApi";

// Implementação do fetchMoviesByKeyword
const fetchMoviesByKeyword = async (keywordId: number): Promise<MediaItem[]> => {
  try {
    const url = `/api/discover/movie?with_keywords=${keywordId}&language=pt-BR`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results.map((item: any) => ({
      ...item,
      media_type: "movie"
    }));
  } catch (error) {
    console.error(`Error fetching movies for keyword ${keywordId}:`, error);
    return [];
  }
};

export const useMoviesData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
    enabled: isUserAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch action movies
  const actionMoviesQuery = useQuery({
    queryKey: ["actionMovies"],
    queryFn: () => fetchMoviesByGenre(28), // 28 is action genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });
  
  // Fetch comedy movies
  const comedyMoviesQuery = useQuery({
    queryKey: ["comedyMovies"],
    queryFn: () => fetchMoviesByGenre(35), // 35 is comedy genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch adventure movies
  const adventureMoviesQuery = useQuery({
    queryKey: ["adventureMovies"],
    queryFn: () => fetchMoviesByGenre(12), // 12 is adventure genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch sci-fi movies
  const sciFiMoviesQuery = useQuery({
    queryKey: ["sciFiMovies"],
    queryFn: () => fetchMoviesByGenre(878), // 878 is sci-fi genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch Marvel movies by keyword
  const marvelMoviesQuery = useQuery({
    queryKey: ["marvelMovies"],
    queryFn: () => fetchMoviesByKeyword(180547),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch DC movies by keyword
  const dcMoviesQuery = useQuery({
    queryKey: ["dcMovies"],
    queryFn: () => fetchMoviesByKeyword(9715),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = 
    moviesQuery.isPending || 
    actionMoviesQuery.isPending || 
    comedyMoviesQuery.isPending ||
    adventureMoviesQuery.isPending ||
    sciFiMoviesQuery.isPending ||
    marvelMoviesQuery.isPending ||
    dcMoviesQuery.isPending;
    
  const hasError = 
    moviesQuery.isError || 
    actionMoviesQuery.isError || 
    comedyMoviesQuery.isError ||
    adventureMoviesQuery.isError ||
    sciFiMoviesQuery.isError ||
    marvelMoviesQuery.isError ||
    dcMoviesQuery.isError;

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
