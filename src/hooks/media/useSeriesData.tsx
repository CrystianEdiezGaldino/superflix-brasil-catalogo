
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchPopularSeries,
  fetchPopularAmericanSeries
} from "@/services/tmdbApi";

export const useSeriesData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch popular TV series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(1, 60),
    enabled: isUserAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch popular American series
  const popularSeriesQuery = useQuery({
    queryKey: ["popularAmericanSeries"],
    queryFn: () => fetchPopularAmericanSeries(1, 60),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = seriesQuery.isPending || popularSeriesQuery.isPending;
  const hasError = seriesQuery.isError || popularSeriesQuery.isError;

  return {
    seriesData: seriesQuery.data || [],
    popularSeriesData: popularSeriesQuery.data || [],
    isLoading,
    hasError
  };
};
