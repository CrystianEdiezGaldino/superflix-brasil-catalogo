
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchKoreanDramas
} from "@/services/tmdbApi";

export const useDoramaData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch Korean dramas
  const doramasQuery = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: () => fetchKoreanDramas(1, 60),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const isLoading = doramasQuery.isPending;
  const hasError = doramasQuery.isError;

  return {
    doramasData: doramasQuery.data || [],
    isLoading,
    hasError
  };
};
