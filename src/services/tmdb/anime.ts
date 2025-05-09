
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch anime using keywords
export const fetchAnime = async (page = 1, itemsPerPage = 20) => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_keywords=210024&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(animeWithType, itemsPerPage);
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};

// Fetch top rated anime
export const fetchTopRatedAnime = async () => {
  try {
    const url = buildApiUrl("/discover/tv", "&with_genres=16&sort_by=vote_average.desc&vote_count.gte=10");
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results, "tv");
  } catch (error) {
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

// Fetch anime recommendations
export const fetchSpecificAnimeRecommendations = async () => {
  try {
    const url = buildApiUrl("/discover/tv", "&with_keywords=210024&sort_by=popularity.desc");
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results, "tv");
  } catch (error) {
    console.error("Error fetching specific anime recommendations:", error);
    return [];
  }
};

// Fetch Korean dramas
export const fetchKoreanDramas = async (page = 1, itemsPerPage = 20) => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_original_language=ko&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const doramaWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(doramaWithType, itemsPerPage);
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};
