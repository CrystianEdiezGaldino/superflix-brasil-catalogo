
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch anime using keywords and excluding kids content
export const fetchAnime = async (page = 1, itemsPerPage = 20) => {
  try {
    // Keywords 210024 is for anime, we exclude family content (10751)
    const url = buildApiUrl(
      "/discover/tv", 
      `&with_keywords=210024&without_genres=10751&sort_by=popularity.desc&page=${page}`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const animeWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(animeWithType, itemsPerPage);
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};

// Fetch top rated anime
export const fetchTopRatedAnime = async (limit = 15) => {
  try {
    // Using anime keywords and sorting by rating, excluding family/kids content
    const url = buildApiUrl(
      "/discover/tv", 
      "&with_keywords=210024&without_genres=10751&sort_by=vote_average.desc&vote_count.gte=100"
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const topRated = addMediaTypeToResults(data.results, "tv");
    return limitResults(topRated, limit);
  } catch (error) {
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

// Fetch trending anime (popular this week)
export const fetchTrendingAnime = async (limit = 15) => {
  try {
    // Use discover with anime keywords and sort by popularity
    const url = buildApiUrl(
      "/discover/tv", 
      "&with_keywords=210024&without_genres=10751&sort_by=popularity.desc"
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const trending = addMediaTypeToResults(data.results, "tv");
    return limitResults(trending, limit);
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return [];
  }
};

// Fetch recent anime (aired in the last 2 years)
export const fetchRecentAnime = async (limit = 15) => {
  try {
    const currentYear = new Date().getFullYear();
    const twoYearsAgo = currentYear - 2;
    const fromDate = `${twoYearsAgo}-01-01`;
    
    const url = buildApiUrl(
      "/discover/tv", 
      `&with_keywords=210024&without_genres=10751&first_air_date.gte=${fromDate}&sort_by=first_air_date.desc`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const recent = addMediaTypeToResults(data.results, "tv");
    return limitResults(recent, limit);
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
};

// Updated specific anime recommendations to include more anime titles
export const fetchSpecificAnimeRecommendations = async (limit = 15) => {
  try {
    // Use specific anime-related keywords to get better recommendations
    const url = buildApiUrl(
      "/discover/tv", 
      "&with_keywords=210024,4344,171035&without_genres=10751&sort_by=popularity.desc"
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    const recommendations = addMediaTypeToResults(data.results, "tv");
    return limitResults(recommendations, limit);
  } catch (error) {
    console.error("Error fetching specific anime recommendations:", error);
    return [];
  }
};
