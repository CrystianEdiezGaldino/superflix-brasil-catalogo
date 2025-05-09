import { Movie, Series, Season, Episode, MediaItem } from "@/types/movie";

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
    const url = `${BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&language=${LANGUAGE}&region=${REGION}&include_video=true&vote_count.gte=100`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
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
    const url = `${BASE_URL}/discover/tv?sort_by=popularity.desc&page=${page}&language=${LANGUAGE}&region=${REGION}&vote_count.gte=50`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
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
    const url = `${BASE_URL}/movie/${id}?language=${LANGUAGE}&append_to_response=external_ids,credits,similar,videos`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
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
    const url = `${BASE_URL}/tv/${id}?language=${LANGUAGE}&append_to_response=external_ids,credits,similar,videos`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
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
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} details for series ${seriesId}:`, error);
    throw error;
  }
}

export async function searchMedia(query: string): Promise<(Movie | Series)[]> {
  try {
    const url = `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=${LANGUAGE}&page=1&region=${REGION}&include_adult=false`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.status_message || 'Erro desconhecido'}`);
    }
    
    return data.results.filter((item: any) => 
      item.media_type === "movie" || item.media_type === "tv"
    );
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
}

// Fetch popular anime
export const fetchAnime = async (): Promise<Series[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_keywords=210024&language=${LANGUAGE}&sort_by=popularity.desc&vote_count.gte=100`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch anime");
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};

// Fetch top rated anime
export const fetchTopRatedAnime = async (): Promise<Series[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_keywords=210024&language=${LANGUAGE}&sort_by=vote_average.desc&vote_count.gte=200`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch top rated anime");
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

// Get specific anime recommendations like Solo Leveling
export const fetchSpecificAnimeRecommendations = async (): Promise<Series[]> => {
  try {
    // Solo Leveling ID
    const soloLevelingId = 156680;
    
    const response = await fetch(
      `${BASE_URL}/tv/${soloLevelingId}/recommendations?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch anime recommendations");
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching anime recommendations:", error);
    return [];
  }
};

// Fetch Korean dramas (doramas)
export const fetchKoreanDramas = async (): Promise<Series[]> => {
  try {
    // Korean drama keyword ID (K-drama)
    const koreanDramaKeywordId = 10735;
    
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_keywords=${koreanDramaKeywordId}&language=${LANGUAGE}&sort_by=popularity.desc&vote_count.gte=50`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch Korean dramas");
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};

// Add function to fetch recommendations
export const fetchRecommendations = async (mediaIds: number[], mediaType: "movie" | "tv"): Promise<MediaItem[]> => {
  try {
    // If no mediaIds provided, return empty array
    if (!mediaIds.length) return [];
    
    // Take one random ID from the list to get recommendations
    const randomIndex = Math.floor(Math.random() * mediaIds.length);
    const randomId = mediaIds[randomIndex];
    
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${randomId}/recommendations?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    
    const data = await response.json();
    
    // Ensure we correctly type the media items
    if (mediaType === "movie") {
      return data.results.map((item: any) => ({
        ...item,
        media_type: "movie"
      })) as Movie[];
    } else {
      return data.results.map((item: any) => ({
        ...item,
        media_type: "tv"
      })) as Series[];
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};
