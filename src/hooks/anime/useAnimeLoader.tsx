
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchTrendingAnime,
  fetchRecentAnime,
  fetchSeasonalAnime,
  fetchAnimeSections,
  fetchAnimeBatch
} from "@/services/tmdb/anime";
import { animeIdsList } from "@/data/animeIds";

export const useAnimeLoader = () => {
  // Fetch initial anime content
  const { data: initialAnimes = [], isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularAnimes", 1],
    queryFn: () => fetchAnime(1, 30),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch top rated anime
  const { data: topRatedAnimes = [], isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedAnimes"],
    queryFn: () => fetchTopRatedAnime(1, 20),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch trending anime
  const { data: trendingAnimes = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingAnimes"],
    queryFn: () => fetchTrendingAnime(1, 20),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recent anime
  const { data: recentAnimes = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentAnimes"],
    queryFn: () => fetchRecentAnime(1, 20),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch seasonal anime
  const { data: seasonalAnimes = [], isLoading: isLoadingSeasons } = useQuery({
    queryKey: ["seasonalAnimes"],
    queryFn: () => fetchSeasonalAnime(1, 20),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch curated anime sections with default empty values
  const { data: animeSections = {
    trending: [],
    topRated: [],
    recent: [],
    seasonal: []
  }, isLoading: isLoadingSections } = useQuery({
    queryKey: ["animeSections"],
    queryFn: () => fetchAnimeSections(),
    staleTime: 1000 * 60 * 5,
  });

  // Get recommended animes (max 5) based on popularity and rating
  const getRecommendedAnimes = (): MediaItem[] => {
    // First prioritize trending content
    if (trendingAnimes && Array.isArray(trendingAnimes) && trendingAnimes.length > 0) {
      // Filter content with good backdrop images
      const withBackdrops = trendingAnimes.filter(anime => anime && anime.backdrop_path);
      if (withBackdrops.length > 0) {
        return withBackdrops.slice(0, 5);
      }
    }
    
    // If no trending, use top rated
    if (topRatedAnimes && Array.isArray(topRatedAnimes) && topRatedAnimes.length > 0) {
      const withBackdrops = topRatedAnimes.filter(anime => anime && anime.backdrop_path);
      if (withBackdrops.length > 0) {
        return withBackdrops.slice(0, 5);
      }
    }
    
    // If no top rated, fallback to initial animes
    if (initialAnimes && Array.isArray(initialAnimes) && initialAnimes.length > 0) {
      const withBackdrops = initialAnimes.filter(anime => anime && anime.backdrop_path);
      if (withBackdrops.length > 0) {
        return withBackdrops.slice(0, 5);
      }
    }
    
    return [];
  };

  // Function to fetch a specific batch of anime
  const fetchAnimeBatchById = async (batchIndex: number) => {
    return fetchAnimeBatch(batchIndex, 20);
  };

  return {
    initialAnimes: Array.isArray(initialAnimes) ? initialAnimes.filter(Boolean) : [],
    topRatedAnimes: Array.isArray(topRatedAnimes) ? topRatedAnimes.filter(Boolean) : [],
    trendingAnimes: Array.isArray(trendingAnimes) ? trendingAnimes.filter(Boolean) : [],
    recentAnimes: Array.isArray(recentAnimes) ? recentAnimes.filter(Boolean) : [],
    seasonalAnimes: Array.isArray(seasonalAnimes) ? seasonalAnimes.filter(Boolean) : [],
    animeSections,
    recommendedAnimes: getRecommendedAnimes(),
    fetchAnimeBatch: fetchAnimeBatchById,
    totalAnimes: animeIdsList ? animeIdsList.length : 0,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSeasons,
    isLoadingSections
  };
};
