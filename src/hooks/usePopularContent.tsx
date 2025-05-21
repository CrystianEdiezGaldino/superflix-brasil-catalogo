
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies, fetchPopularSeries } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { fetchPopularAmericanSeries } from "@/services/tmdb/series";
import { fetchRecentAnime } from "@/services/tmdb/anime";
import { useMemo } from "react";

interface ApiResponse {
  results: MediaItem[];
}

export const usePopularContent = () => {
  const { data: popularMovies, isLoading: isLoadingMovies } = useQuery<ApiResponse>({
    queryKey: ["popularMovies"],
    queryFn: async () => {
      const response = await fetchPopularMovies(1);
      return { results: response };
    },
  });

  const { data: popularSeries, isLoading: isLoadingSeries } = useQuery<ApiResponse>({
    queryKey: ["popularSeries"],
    queryFn: async () => {
      const response = await fetchPopularSeries(1);
      return { results: response };
    },
  });

  const { data: americanSeries, isLoading: isLoadingAmericanSeries } = useQuery<ApiResponse>({
    queryKey: ["americanSeries"],
    queryFn: async () => {
      const response = await fetchPopularAmericanSeries(1);
      return { results: response };
    },
  });

  const { data: recentAnimes, isLoading: isLoadingAnimes } = useQuery<MediaItem[]>({
    queryKey: ["recentAnimes"],
    queryFn: () => fetchRecentAnime(1),
  });

  // Combine todos os conteúdos populares
  const popularContent = useMemo(() => {
    const movies = popularMovies?.results || [];
    const series = popularSeries?.results || [];
    const american = americanSeries?.results || [];
    
    return [...movies, ...series, ...american];
  }, [popularMovies, popularSeries, americanSeries]);

  // Limite a 20 itens
  const limitedPopularContent = popularContent.slice(0, 20);

  const recentAnimesMemo = useMemo(() => {
    if (!recentAnimes) return [];
    return Array.isArray(recentAnimes) ? recentAnimes : [];
  }, [recentAnimes]);

  // Add isLoading property
  const isLoading = isLoadingMovies || isLoadingSeries || isLoadingAmericanSeries || isLoadingAnimes;

  return {
    popularContent: limitedPopularContent,
    recentAnimes: recentAnimesMemo,
    isLoading
  };
};
