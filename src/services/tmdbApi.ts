
import { MediaItem } from "@/types/movie";
import { fetchKidsAnimes, fetchKidsAnimations, fetchKidsMovies, fetchKidsSeries, fetchTrendingKidsContent } from "./tmdb/kids";
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies,
  fetchRecentMovies,
  fetchMoviesByGenre,
  fetchMoviesByKeyword,
  fetchMovieDetails,
  searchMovies
} from "./tmdb/movies";
import {
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchTrendingSeries,
  fetchRecentSeries,
  fetchSeriesDetails,
  fetchSeriesSeasonDetails,
  fetchPopularAmericanSeries
} from "./tmdb/series";
import {
  fetchTVVideos,
  getBestTVVideoKey
} from "./tmdb/videos";
import {
  fetchRecommendations
} from "./tmdb/trending";
import { searchMedia } from "./tmdb/search";

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
  fetchPopularAmericanSeries,
  
  // Video exports
  fetchTVVideos,
  getBestTVVideoKey,
  
  // Search exports
  searchMedia,
  
  // Trending/recommendations exports
  fetchRecommendations
};

// Create placeholder functions for missing exports that are being imported
// These will prevent build errors while we implement the actual functionality later

// Anime placeholder exports
export const fetchAnime = async (): Promise<MediaItem[]> => {
  console.warn("fetchAnime not fully implemented");
  return [];
};

export const fetchTopRatedAnime = async (): Promise<MediaItem[]> => {
  console.warn("fetchTopRatedAnime not fully implemented");
  return [];
};

export const fetchRecentAnime = async (): Promise<MediaItem[]> => {
  console.warn("fetchRecentAnime not fully implemented");
  return [];
};

// Dorama placeholder exports
export const fetchKoreanDramas = async (): Promise<MediaItem[]> => {
  console.warn("fetchKoreanDramas not fully implemented");
  return [];
};

export const fetchPopularKoreanDramas = async (): Promise<MediaItem[]> => {
  console.warn("fetchPopularKoreanDramas not fully implemented");
  return [];
};

export const fetchTopRatedKoreanDramas = async (): Promise<MediaItem[]> => {
  console.warn("fetchTopRatedKoreanDramas not fully implemented");
  return [];
};

export const fetchKoreanMovies = async (): Promise<MediaItem[]> => {
  console.warn("fetchKoreanMovies not fully implemented");
  return [];
};

export const fetchDoramaDetails = async (id: string): Promise<any> => {
  console.warn("fetchDoramaDetails not fully implemented");
  return {};
};

export const fetchSimilarDoramas = async (id: string): Promise<MediaItem[]> => {
  console.warn("fetchSimilarDoramas not fully implemented");
  return [];
};

// Utility function for components needing to fetch media by ID
export const fetchMediaById = async (id: string, type: string): Promise<MediaItem | null> => {
  console.warn("fetchMediaById not fully implemented");
  return null;
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
}
