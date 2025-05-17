import { Series, Season } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch popular TV series
export const fetchPopularSeries = async (page = 1, itemsPerPage = 20) => {
  try {
    const url = buildApiUrl("/tv/popular", `&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, itemsPerPage);
  } catch (error) {
    console.error("Error fetching popular series:", error);
    return [];
  }
};

// Fetch top rated series
export const fetchTopRatedSeries = async (limit = 12) => {
  try {
    const url = buildApiUrl("/tv/top_rated");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching top rated series:", error);
    return [];
  }
};

// Fetch trending series of the week
export const fetchTrendingSeries = async (limit = 12) => {
  try {
    const url = buildApiUrl("/trending/tv/week");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching trending series:", error);
    return [];
  }
};

// Fetch recent series released in the last 5 years
export const fetchRecentSeries = async (limit = 12) => {
  try {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    const fromDate = `${fiveYearsAgo}-01-01`;
    const toDate = `${currentYear}-12-31`;
    
    const url = buildApiUrl("/discover/tv", `&first_air_date.gte=${fromDate}&first_air_date.lte=${toDate}&sort_by=first_air_date.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching recent series:", error);
    return [];
  }
};

// Fetch TV series details
export const fetchSeriesDetails = async (id: string | number, language: string = 'pt-BR', signal?: AbortSignal): Promise<Series> => {
  try {
    const url = buildApiUrl(`/tv/${id}`, `&language=${language}&append_to_response=external_ids,credits,recommendations`);
    return await fetchFromApi<Series>(url, signal);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error("Error fetching series details:", error);
    return {} as Series;
  }
};

// Fetch season details
export const fetchSeriesSeasonDetails = async (id: string, seasonNumber: number): Promise<Season> => {
  try {
    const url = buildApiUrl(`/tv/${id}/season/${seasonNumber}`);
    return await fetchFromApi<Season>(url);
  } catch (error) {
    console.error("Error fetching series season details:", error);
    return {} as Season;
  }
};

// Alias for fetchSeriesSeasonDetails
export const fetchSeasonDetails = fetchSeriesSeasonDetails;

export const fetchSeriesRecommendations = async (seriesId: string) => {
  try {
    const url = buildApiUrl(`/tv/${seriesId}/recommendations`, '&language=pt-BR');
    const data = await fetchFromApi<{results?: any[]}>(url);
    return {
      results: addMediaTypeToResults(data.results || [], "tv")
    };
  } catch (error) {
    console.error("Error fetching series recommendations:", error);
    return { results: [] };
  }
};
