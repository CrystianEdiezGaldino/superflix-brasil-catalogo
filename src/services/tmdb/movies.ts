
import { Movie } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults } from "./utils";

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
