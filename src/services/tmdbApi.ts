
// Re-export services from subdirectories
export * from './tmdb/movies';
export * from './tmdb/series';
export * from './tmdb/search';
export * from './tmdb/doramas';
export * from './tmdb/anime';
export * from './tmdb/videos';
export * from './tmdb/utils';

import { API_KEY, BASE_URL, DEFAULT_LANGUAGE } from './tmdb/config';
import { MediaItem } from "@/types/movie";

// Fetch media item by ID - detects whether it's a movie or TV series
export const fetchMediaById = async (id: number): Promise<MediaItem | null> => {
  try {
    // Try fetching as a movie first
    const movieUrl = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
    let response = await fetch(movieUrl);
    
    if (response.ok) {
      const data = await response.json();
      return { ...data, media_type: 'movie' };
    }
    
    // If not a movie, try as a TV series
    const tvUrl = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
    response = await fetch(tvUrl);
    
    if (response.ok) {
      const data = await response.json();
      return { ...data, media_type: 'tv' };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching media by ID:', error);
    return null;
  }
};

// Fetch popular American series (sitcoms, dramas, etc.)
export const fetchPopularAmericanSeries = async (page: number = 1, limit: number = 60): Promise<MediaItem[]> => {
  try {
    // To get more results, fetch multiple pages and combine them
    const pages = Math.ceil(limit / 20); // TMDB returns 20 items per page
    let allSeries: any[] = [];
    
    for (let i = 0; i < pages; i++) {
      const currentPage = page + i;
      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=popularity.desc&with_origin_country=US&with_original_language=en&page=${currentPage}`
      );
      const data = await response.json();
      allSeries = [...allSeries, ...data.results];
      
      if (allSeries.length >= limit || !data.results.length) break;
    }
    
    // Transform the results into MediaItems
    const americanSeries = allSeries.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
    
    return americanSeries.slice(0, limit);
  } catch (error) {
    console.error("Error fetching popular American series:", error);
    return [];
  }
};

// Function to fetch trending anime of the current year
export const fetchRecentAnime = async (page: number = 1, limit: number = 60): Promise<MediaItem[]> => {
  const currentYear = new Date().getFullYear();
  
  try {
    // To get more results, fetch multiple pages and combine them
    const pages = Math.ceil(limit / 20); // TMDB returns 20 items per page
    let allAnimes: any[] = [];
    
    for (let i = 0; i < pages; i++) {
      const currentPage = page + i;
      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=popularity.desc&with_keywords=210024|222243&first_air_date_year=${currentYear}&page=${currentPage}`
      );
      const data = await response.json();
      allAnimes = [...allAnimes, ...data.results];
      
      if (allAnimes.length >= limit || !data.results.length) break;
    }
    
    // Transform the results into MediaItems
    const recentAnime = allAnimes.map((item: any) => ({
      ...item,
      media_type: "tv"
    }));
    
    return recentAnime.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
};
