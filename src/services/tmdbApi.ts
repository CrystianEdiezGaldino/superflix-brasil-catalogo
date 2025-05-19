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
import { cacheManager } from "@/utils/cacheManager";

// Fetch media item by ID - detects whether it's a movie or TV series
export const fetchMediaById = async (id: number, mediaType?: 'movie' | 'tv'): Promise<MediaItem | null> => {
  // Usar cache para consultas de mídia por ID
  const cacheKey = `media_${mediaType || 'unknown'}_${id}`;
  const cachedItem = cacheManager.get<MediaItem>(cacheKey);
  
  if (cachedItem) {
    return cachedItem;
  }
  
  try {
    if (mediaType === 'movie') {
      const movieUrl = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
      const response = await fetch(movieUrl);
      
      if (response.ok) {
        const data = await response.json();
        const result = { ...data, media_type: 'movie' };
        cacheManager.set(cacheKey, result, 60 * 60 * 1000); // Cache por 1 hora
        return result;
      }
    } else if (mediaType === 'tv') {
      const tvUrl = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
      const response = await fetch(tvUrl);
      
      if (response.ok) {
        const data = await response.json();
        const result = { ...data, media_type: 'tv' };
        cacheManager.set(cacheKey, result, 60 * 60 * 1000); // Cache por 1 hora
        return result;
      }
    } else {
      // Try fetching as a movie first
      const movieUrl = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
      let response = await fetch(movieUrl);
      
      if (response.ok) {
        const data = await response.json();
        const result = { ...data, media_type: 'movie' };
        cacheManager.set(cacheKey, result, 60 * 60 * 1000); // Cache por 1 hora
        return result;
      }
      
      // If not a movie, try as a TV series
      const tvUrl = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`;
      response = await fetch(tvUrl);
      
      if (response.ok) {
        const data = await response.json();
        const result = { ...data, media_type: 'tv' };
        cacheManager.set(cacheKey, result, 60 * 60 * 1000); // Cache por 1 hora
        return result;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching media by ID:', error);
    return null;
  }
};

// Fetch popular movies with optional limit parameter
export const fetchPopularMovies = async (page: number = 1, limit: number = 20): Promise<MediaItem[]> => {
  // Usar cache com chave específica para reduzir requisições
  const cacheKey = `popular_movies_p${page}_l${limit}`;
  const cachedMovies = cacheManager.get<MediaItem[]>(cacheKey);
  
  if (cachedMovies) {
    return cachedMovies;
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&page=${page}`
    );
    const data = await response.json();
    
    // Transformar resultados e limitar ao número solicitado
    const movies = data.results.map((movie: any) => ({
      ...movie,
      media_type: "movie",
    })).slice(0, limit);
    
    // Cache por 15 minutos
    cacheManager.set(cacheKey, movies, 15 * 60 * 1000);
    
    return movies;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
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
