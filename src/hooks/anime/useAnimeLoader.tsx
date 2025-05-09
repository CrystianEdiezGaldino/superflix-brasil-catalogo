
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { 
  fetchAnime, 
  fetchTopRatedAnime, 
  fetchSpecificAnimeRecommendations
} from "@/services/tmdbApi";

export const useAnimeLoader = () => {
  // Buscar animes iniciais
  const { data: initialAnimes, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularAnimes", 1],
    queryFn: () => fetchAnime(1, 24),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar animes mais bem avaliados
  const { data: topRatedAnimes, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedAnimes"],
    queryFn: () => fetchTopRatedAnime(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar recomendações específicas
  const { data: specificAnimes, isLoading: isLoadingSpecific } = useQuery({
    queryKey: ["specificAnimes"],
    queryFn: () => fetchSpecificAnimeRecommendations(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    initialAnimes: initialAnimes || [],
    topRatedAnimes: topRatedAnimes || [],
    specificAnimes: specificAnimes || [],
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingSpecific
  };
};
