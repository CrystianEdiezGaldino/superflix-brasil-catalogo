
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies, 
  fetchRecentMovies 
} from "@/services/tmdbApi";

export const useMovieLoader = () => {
  // Buscar filmes iniciais
  const { data: initialMovies, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularMovies", 1],
    queryFn: () => fetchPopularMovies(1),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Buscar filmes em tendência
  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: () => fetchTrendingMovies(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar filmes mais bem avaliados
  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => fetchTopRatedMovies(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar filmes recentes
  const { data: recentMovies, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentMovies"],
    queryFn: () => fetchRecentMovies(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    initialMovies: initialMovies || [],
    trendingMovies: trendingMovies || [],
    topRatedMovies: topRatedMovies || [],
    recentMovies: recentMovies || [],
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent
  };
};
