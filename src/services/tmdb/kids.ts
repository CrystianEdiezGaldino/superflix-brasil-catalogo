
import { MediaItem, Movie, Series } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch kids animations (filmes de animação)
export const fetchKidsAnimations = async (page = 1): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl(
      "/discover/movie", 
      `&with_genres=16&certification.lte=G&certification_country=US&page=${page}`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results || [], "movie");
  } catch (error) {
    console.error("Error fetching kids animations:", error);
    return [];
  }
};

// Fetch kids movies (filmes infantis que não são animações)
export const fetchKidsMovies = async (page = 1): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl(
      "/discover/movie", 
      `&with_genres=10751&without_genres=16&certification.lte=PG&certification_country=US&page=${page}`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results || [], "movie");
  } catch (error) {
    console.error("Error fetching kids movies:", error);
    return [];
  }
};

// Fetch kids TV series (seriados infantis)
export const fetchKidsSeries = async (page = 1): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl(
      "/discover/tv", 
      `&with_genres=10762&page=${page}`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results || [], "tv");
  } catch (error) {
    console.error("Error fetching kids series:", error);
    return [];
  }
};

// Fetch kids anime (animes infantis)
export const fetchKidsAnimes = async (page = 1): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl(
      "/discover/tv", 
      `&with_genres=16,10762&page=${page}`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results || [], "tv");
  } catch (error) {
    console.error("Error fetching kids animes:", error);
    return [];
  }
};

// Fetch trending kids content
export const fetchTrendingKidsContent = async (limit = 6): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl(
      "/discover/movie", 
      `&with_genres=16,10751&certification.lte=PG&certification_country=US&sort_by=popularity.desc`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results || [], "movie");
    return limitResults(contentWithType, limit);
  } catch (error) {
    console.error("Error fetching trending kids content:", error);
    return [];
  }
};
