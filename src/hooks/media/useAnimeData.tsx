
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchRecentAnime
} from "@/services/tmdbApi";

export const useAnimeData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch popular anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
    enabled: isUserAuthenticated,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Fetch top rated anime
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  // Fetch recent anime
  const recentAnimesQuery = useQuery({
    queryKey: ["recentAnimes"],
    queryFn: () => fetchRecentAnime(),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = animeQuery.isPending || topRatedAnimeQuery.isPending || recentAnimesQuery.isPending;
  const hasError = animeQuery.isError || topRatedAnimeQuery.isError || recentAnimesQuery.isError;

  return {
    animeData: animeQuery.data || [],
    topRatedAnimeData: topRatedAnimeQuery.data || [],
    recentAnimesData: recentAnimesQuery.data || [],
    isLoading,
    hasError
  };
};
