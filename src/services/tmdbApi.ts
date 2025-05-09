
import { Movie, Series, Season, Episode } from "@/types/movie";

const API_KEY = "062def1aa1f84c69eb8cd943df2ccc0d";
const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "pt-BR";
const REGION = "BR";

const headers = {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjJkZWYxYWExZjg0YzY5ZWI4Y2Q5NDNkZjJjY2MwZCIsIm5iZiI6MS43NDY2NzA1MTI4NjA5OTk4ZSs5LCJzdWIiOiI2ODFjMTNiMGY2MWJlMmQ4YzY5M2FjMzMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aFl6knGX6f2YA0u0_sSYRu-CsxxAGX-rZpc3RAffRQQ",
  "Content-Type": "application/json;charset=utf-8",
};

export async function fetchPopularMovies(page = 1): Promise<Movie[]> {
  try {
    const url = `${BASE_URL}/discover/movie?with_original_language=pt&sort_by=popularity.desc&page=${page}&language=${LANGUAGE}&region=${REGION}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return data.results.map((movie: any) => ({
      ...movie,
      media_type: "movie"
    }));
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

export async function fetchPopularSeries(page = 1): Promise<Series[]> {
  try {
    const url = `${BASE_URL}/discover/tv?with_original_language=pt&sort_by=popularity.desc&page=${page}&language=${LANGUAGE}&region=${REGION}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return data.results.map((series: any) => ({
      ...series,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching popular series:", error);
    return [];
  }
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  try {
    const url = `${BASE_URL}/movie/${id}?language=${LANGUAGE}&append_to_response=external_ids`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return {
      ...data,
      imdb_id: data.imdb_id,
      media_type: "movie"
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw error;
  }
}

export async function fetchSeriesDetails(id: number): Promise<Series> {
  try {
    const url = `${BASE_URL}/tv/${id}?language=${LANGUAGE}&append_to_response=external_ids`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return {
      ...data,
      external_ids: data.external_ids,
      media_type: "tv"
    };
  } catch (error) {
    console.error(`Error fetching series details for ID ${id}:`, error);
    throw error;
  }
}

export async function fetchSeasonDetails(seriesId: number, seasonNumber: number): Promise<Season> {
  try {
    const url = `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?language=${LANGUAGE}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} details for series ${seriesId}:`, error);
    throw error;
  }
}

export async function searchMedia(query: string): Promise<(Movie | Series)[]> {
  try {
    const url = `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=${LANGUAGE}&page=1&region=${REGION}`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return data.results
      .filter((item: any) => (item.media_type === "movie" || item.media_type === "tv") && 
                            (item.original_language === "pt" || item.origin_country?.includes("BR")));
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
}
