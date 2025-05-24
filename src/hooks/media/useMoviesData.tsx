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
import { fetchDCMovies } from "@/services/tmdb/dc";
import { API_KEY, BASE_URL } from "@/services/tmdb/config";

// Implementação do fetchMoviesByKeyword
const fetchMoviesByKeywordId = async (keywordId: number): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_keywords=${keywordId}&language=pt-BR`
    );
    
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });

  // Fetch action movies
  const actionMoviesQuery = useQuery({
    queryKey: ["actionMovies"],
    queryFn: () => fetchMoviesByGenre(28), // 28 is action genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false
  });
  
  // Fetch comedy movies
  const comedyMoviesQuery = useQuery({
    queryKey: ["comedyMovies"],
    queryFn: () => fetchMoviesByGenre(35), // 35 is comedy genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false
  });

  // Fetch adventure movies
  const adventureMoviesQuery = useQuery({
    queryKey: ["adventureMovies"],
    queryFn: () => fetchMoviesByGenre(12), // 12 is adventure genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false
  });

  // Fetch sci-fi movies
  const sciFiMoviesQuery = useQuery({
    queryKey: ["sciFiMovies"],
    queryFn: () => fetchMoviesByGenre(878), // 878 is sci-fi genre ID
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false
  });

  // Fetch Marvel movies by keyword
  const marvelMoviesQuery = useQuery({
    queryKey: ["marvelMovies"],
    queryFn: () => fetchMoviesByKeywordId(180547),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false
  });

  // Fetch DC movies
  const dcMoviesQuery = useQuery<MediaItem[]>({
    queryKey: ['dcMovies'],
    queryFn: () => fetchDCMovies(50),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnWindowFocus: false
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
