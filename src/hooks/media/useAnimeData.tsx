
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";

// Implementação das funções ausentes
const fetchAnime = async (): Promise<MediaItem[]> => {
  try {
    const url = `/api/discover/tv?with_genres=16&language=pt-BR&with_original_language=ja`;
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
    console.error("Error fetching anime:", error);
    return [];
  }
};

const fetchTopRatedAnime = async (): Promise<MediaItem[]> => {
  try {
    const url = `/api/discover/tv?with_genres=16&sort_by=vote_average.desc&vote_count.gte=200&language=pt-BR&with_original_language=ja`;
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
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

const fetchRecentAnime = async (): Promise<MediaItem[]> => {
  try {
    const url = `/api/discover/tv?with_genres=16&sort_by=first_air_date.desc&language=pt-BR&with_original_language=ja`;
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
    console.error("Error fetching recent anime:", error);
    return [];
  }
};

export const useAnimeData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Fetch anime data
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
    enabled: isUserAuthenticated && hasAccess,
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
    queryKey: ["recentAnime"],
    queryFn: () => fetchRecentAnime(),
    enabled: isUserAuthenticated && hasAccess,
    staleTime: 1000 * 60 * 5
  });

  const isLoading = 
    animeQuery.isPending || 
    topRatedAnimeQuery.isPending || 
    recentAnimesQuery.isPending;
    
  const hasError = 
    animeQuery.isError || 
    topRatedAnimeQuery.isError || 
    recentAnimesQuery.isError;

  return {
    animeData: animeQuery.data || [],
    topRatedAnimeData: topRatedAnimeQuery.data || [],
    recentAnimesData: recentAnimesQuery.data || [],
    isLoading,
    hasError
  };
};
