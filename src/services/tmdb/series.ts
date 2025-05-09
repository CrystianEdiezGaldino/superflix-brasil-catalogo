
import { Series, Season } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

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

// Fetch TV series details
export const fetchSeriesDetails = async (id: string): Promise<Series> => {
  try {
    const url = buildApiUrl(`/tv/${id}`, "&append_to_response=external_ids");
    return await fetchFromApi<Series>(url);
  } catch (error) {
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
