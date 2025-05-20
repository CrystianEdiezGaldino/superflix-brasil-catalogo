
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchPopularSeries, 
  fetchTopRatedSeries,
  fetchTrendingSeries
} from "@/services/tmdbApi";

// Implementação da função ausente
const fetchPopularAmericanSeries = async (): Promise<MediaItem[]> => {
  try {
    const url = `/api/discover/tv?with_original_language=en&sort_by=popularity.desc&language=pt-BR`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching popular American series:", error);
    return [];
  }
};

export const useSeriesData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch popular series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
    enabled: isUserAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch popular American series
  const popularSeriesQuery = useQuery({
    queryKey: ["popularAmericanSeries"],
    queryFn: () => fetchPopularAmericanSeries(),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = 
    seriesQuery.isPending || 
    popularSeriesQuery.isPending;
    
  const hasError = 
    seriesQuery.isError || 
    popularSeriesQuery.isError;

  return {
    seriesData: seriesQuery.data || [],
    popularSeriesData: popularSeriesQuery.data || [],
    isLoading,
    hasError
  };
};
