
import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch anime
export const fetchAnime = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_genres=16&language=pt-BR&with_original_language=ja&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results || [], "tv");
    return limitResults(animeWithType, limit);
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};

// Fetch top rated anime
export const fetchTopRatedAnime = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_genres=16&sort_by=vote_average.desc&vote_count.gte=200&language=pt-BR&with_original_language=ja&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results || [], "tv");
    return limitResults(animeWithType, limit);
  } catch (error) {
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

// Fetch recent anime
export const fetchRecentAnime = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_genres=16&sort_by=first_air_date.desc&language=pt-BR&with_original_language=ja&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results || [], "tv");
    return limitResults(animeWithType, limit);
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
};

// Adicionar as funções que estão faltando para resolver erros de importação
export const fetchTrendingAnime = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/trending/tv/week", `&with_genres=16&language=pt-BR&with_original_language=ja&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results || [], "tv");
    return limitResults(animeWithType, limit);
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return [];
  }
};

export const fetchSeasonalAnime = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  // Obter a data atual para determinar a temporada
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  // Determinar a temporada atual
  let season = "winter";
  if (month >= 3 && month <= 5) season = "spring";
  else if (month >= 6 && month <= 8) season = "summer";
  else if (month >= 9 && month <= 11) season = "fall";
  
  try {
    const url = buildApiUrl("/discover/tv", `&with_genres=16&language=pt-BR&with_original_language=ja&first_air_date.gte=${year}-${month.toString().padStart(2, '0')}-01&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results || [], "tv");
    return limitResults(animeWithType, limit);
  } catch (error) {
    console.error("Error fetching seasonal anime:", error);
    return [];
  }
};

export const fetchAnimeSections = async (): Promise<{
  trending: MediaItem[];
  topRated: MediaItem[];
  recent: MediaItem[];
  seasonal: MediaItem[];
}> => {
  try {
    const [trending, topRated, recent, seasonal] = await Promise.all([
      fetchTrendingAnime(),
      fetchTopRatedAnime(),
      fetchRecentAnime(),
      fetchSeasonalAnime(),
    ]);
    
    return {
      trending,
      topRated,
      recent,
      seasonal,
    };
  } catch (error) {
    console.error("Error fetching anime sections:", error);
    return {
      trending: [],
      topRated: [],
      recent: [],
      seasonal: [],
    };
  }
};

// Alias para fetchAnime para resolver o erro de importação
export const fetchAnimeBatch = fetchAnime;
