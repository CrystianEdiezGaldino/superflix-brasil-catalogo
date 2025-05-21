import { MediaItem } from "@/types/movie";
import { fetchKidsAnimes, fetchKidsAnimations, fetchKidsMovies, fetchKidsSeries, fetchTrendingKidsContent } from "./tmdb/kids";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMovieDetails,
  searchMovies,
  fetchMoviesByGenre,
  fetchMoviesByKeyword,
  fetchActionMovies,
  fetchComedyMovies
} from "./tmdb/movies";
import {
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchTrendingSeries,
  fetchRecentSeries,
  fetchSeriesDetails,
  fetchSeriesSeasonDetails
} from "./tmdb/series";
import {
  fetchTVVideos,
  getBestTVVideoKey
} from "./tmdb/videos";
import { searchMedia } from "./tmdb/search";
import {
  fetchKoreanDramas,
  fetchPopularKoreanDramas,
  fetchTopRatedKoreanDramas,
  fetchKoreanMovies,
  fetchDoramaDetails,
  fetchSimilarDoramas,
  fetchDoramaCast
} from "./tmdb/doramas";
import { fetchMarvelMovies } from "./tmdb/marvel";
import { fetchDCMovies } from "./tmdb/dc";
import { fetchTrilogies } from "./tmdb/trilogies";

// Create recommendations function
export const fetchRecommendations = async (type: string, id: string): Promise<MediaItem[]> => {
  try {
    const url = `/api/${type}/${id}/recommendations?language=pt-BR`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e);
      return [];
    }
    
    if (!data || !Array.isArray(data.results)) {
      console.error("Dados inválidos na resposta:", data);
      return [];
    }
    
    return data.results.map((item: any) => ({
      ...item,
      media_type: type
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// Adicionar a implementação de fetchDoramas
export const fetchDoramas = async (page = 1, limit = 20): Promise<MediaItem[]> => {
  try {
    return await fetchKoreanDramas(page, limit);
  } catch (error) {
    console.error("Error in fetchDoramas:", error);
    return [];
  }
};

// Search doramas by name
export const searchDoramas = async (query: string): Promise<MediaItem[]> => {
  try {
    const url = `/api/search/tv?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false&with_original_language=ko`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    // Filter to only Korean shows
    const koreanResults = results.filter((item: any) => item.original_language === 'ko');
    
    // Add media_type property
    return koreanResults.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
  } catch (error) {
    console.error("Error searching doramas:", error);
    return [];
  }
};

// Export everything for external use
export {
  // Movies exports
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMoviesByGenre,
  fetchMoviesByKeyword,
  fetchMovieDetails,
  searchMovies,
  
  // Series exports
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchTrendingSeries,
  fetchRecentSeries,
  fetchSeriesDetails,
  fetchSeriesSeasonDetails,
  
  // Video exports
  fetchTVVideos,
  getBestTVVideoKey,
  
  // Search exports
  searchMedia,
  
  // Kids exports
  fetchKidsAnimes,
  fetchKidsAnimations,
  fetchKidsMovies,
  fetchKidsSeries,
  fetchTrendingKidsContent,
  
  // Dorama exports
  fetchKoreanDramas,
  fetchPopularKoreanDramas,
  fetchTopRatedKoreanDramas,
  fetchKoreanMovies,
  fetchDoramaDetails,
  fetchSimilarDoramas,
  fetchDoramaCast,
  fetchMarvelMovies,
  fetchDCMovies,
  fetchTrilogies,
  fetchActionMovies,
  fetchComedyMovies
};

// Utility function for components needing to fetch media by ID
export const fetchMediaById = async (id: string, type: string): Promise<MediaItem | null> => {
  if (!id || !type) return null;
  
  try {
    const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
    const url = `/api${endpoint}?language=pt-BR&append_to_response=videos,credits`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      media_type: type
    };
  } catch (error) {
    console.error(`Error fetching media details for ID ${id}:`, error);
    return null;
  }
};

// Original function for kids content
export const fetchKidsContent = async (): Promise<MediaItem[]> => {
  try {
    // Fetch from different categories
    const [animations, movies, series, animes, trending] = await Promise.all([
      fetchKidsAnimations(),
      fetchKidsMovies(),
      fetchKidsSeries(),
      fetchKidsAnimes(),
      fetchTrendingKidsContent()
    ]);
    
    // Combine and remove duplicates
    const allContent = [...trending, ...animations, ...movies, ...series, ...animes];
    const uniqueContent = allContent.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
    
    return uniqueContent;
  } catch (error) {
    console.error("Error fetching kids content:", error);
    return [];
  }
};
