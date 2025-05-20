
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
