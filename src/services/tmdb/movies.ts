
import { Movie } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch popular movies
export const fetchPopularMovies = async (page = 1) => {
  try {
    const url = buildApiUrl("/movie/popular", `&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results, "movie");
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (limit = 12) => {
  try {
    const url = buildApiUrl("/movie/top_rated");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
};

// Fetch trending movies of the week
export const fetchTrendingMovies = async (limit = 12) => {
  try {
    const url = buildApiUrl("/trending/movie/week");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Fetch recent movies released in the last 5 years
export const fetchRecentMovies = async (limit = 12) => {
  try {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    const fromDate = `${fiveYearsAgo}-01-01`;
    const toDate = `${currentYear}-12-31`;
    
    const url = buildApiUrl("/discover/movie", `&primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&sort_by=primary_release_date.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error("Error fetching recent movies:", error);
    return [];
  }
};

// Fetch movies by genre ID
export const fetchMoviesByGenre = async (genreId: number, limit = 15) => {
  try {
    const url = buildApiUrl("/discover/movie", `&with_genres=${genreId}&sort_by=popularity.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};

// Fetch movies by keyword ID
export const fetchMoviesByKeyword = async (keywordId: number, limit = 15) => {
  try {
    const url = buildApiUrl("/discover/movie", `&with_keywords=${keywordId}&sort_by=popularity.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error(`Error fetching movies for keyword ${keywordId}:`, error);
    return [];
  }
};

// Fetch movie details
export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  try {
    const url = buildApiUrl(`/movie/${id}`);
    return await fetchFromApi<Movie>(url);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {} as Movie;
  }
};
