
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { 
  fetchAnime, 
  fetchTopRatedAnime, 
  fetchTrendingAnime,
  fetchRecentAnime,
  fetchSpecificAnimeRecommendations
} from "@/services/tmdbApi";

export const useAnimeLoader = () => {
  // Fetch initial anime content
  const { data: initialAnimes, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularAnimes", 1],
    queryFn: () => fetchAnime(1, 24),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top rated anime
  const { data: topRatedAnimes, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedAnimes"],
    queryFn: () => fetchTopRatedAnime(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch trending anime
  const { data: trendingAnimes, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingAnimes"],
    queryFn: () => fetchTrendingAnime(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recent anime
  const { data: recentAnimes, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentAnimes"],
    queryFn: () => fetchRecentAnime(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch specific anime recommendations
  const { data: specificAnimes, isLoading: isLoadingSpecific } = useQuery({
    queryKey: ["specificAnimes"],
    queryFn: () => fetchSpecificAnimeRecommendations(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    initialAnimes: initialAnimes || [],
    topRatedAnimes: topRatedAnimes || [],
    trendingAnimes: trendingAnimes || [],
    recentAnimes: recentAnimes || [],
    specificAnimes: specificAnimes || [],
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSpecific
  };
};
