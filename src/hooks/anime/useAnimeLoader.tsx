
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

  // Function to fetch a specific batch of anime
  const fetchAnimeBatchById = async (batchIndex: number) => {
    return fetchAnimeBatch(batchIndex, 20);
  };

  return {
    initialAnimes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    seasonalAnimes,
    animeSections,
    fetchAnimeBatch: fetchAnimeBatchById,
    totalAnimes: animeIdsList.length,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSeasons,
    isLoadingSections
  };
};
