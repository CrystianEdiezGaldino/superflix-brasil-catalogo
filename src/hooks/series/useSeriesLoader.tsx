
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { 
  fetchPopularSeries, 
  fetchTopRatedSeries, 
  fetchTrendingSeries, 
  fetchRecentSeries
} from "@/services/tmdbApi";

export const useSeriesLoader = () => {
  // Buscar séries iniciais
  const { data: initialSeries, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularSeries", 1],
    queryFn: () => fetchPopularSeries(1, 24),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries em tendência
  const { data: trendingSeries, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingSeries"],
    queryFn: () => fetchTrendingSeries(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries mais bem avaliadas
  const { data: topRatedSeries, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedSeries"],
    queryFn: () => fetchTopRatedSeries(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries recentes
  const { data: recentSeries, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentSeries"],
    queryFn: () => fetchRecentSeries(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    initialSeries: initialSeries || [],
    trendingSeries: trendingSeries || [],
    topRatedSeries: topRatedSeries || [],
    recentSeries: recentSeries || [],
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent
  };
};
