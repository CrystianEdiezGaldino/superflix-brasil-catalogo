
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies, fetchPopularSeries } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { fetchPopularAmericanSeries } from "@/services/tmdb/series";
import { fetchRecentAnime } from "@/services/tmdb/anime";

export const usePopularContent = () => {
  // Query para filmes populares
  const { data: popularMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  // Query para séries populares
  const { data: popularSeries, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
    staleTime: 1000 * 60 * 10,
  });

  // Query para séries americanas populares
  const { data: popularAmericanSeries, isLoading: isLoadingAmericanSeries } = 
    useQuery({
      queryKey: ["popularAmericanSeries"],
      queryFn: () => fetchPopularAmericanSeries(),
      staleTime: 1000 * 60 * 10,
    });

  // Query para animes recentes
  const { data: recentAnimes, isLoading: isLoadingAnimes } = useQuery({
    queryKey: ["recentAnimes"],
    queryFn: () => fetchRecentAnime(),
    staleTime: 1000 * 60 * 10,
  });

  // Combine os resultados e filtre itens sem posters
  const popularContent: MediaItem[] = [
    ...(popularMovies || []),
    ...(popularSeries || []),
    ...(popularAmericanSeries || []),
    ...(recentAnimes || []),
  ].filter((item) => item.poster_path);

  // Ordene por popularidade
  popularContent.sort((a, b) => b.popularity - a.popularity);

  // Limite a 20 itens
  const limitedPopularContent = popularContent.slice(0, 20);

  return {
    popularContent: limitedPopularContent,
    isLoading:
      isLoadingMovies || isLoadingSeries || isLoadingAmericanSeries || isLoadingAnimes,
  };
};
