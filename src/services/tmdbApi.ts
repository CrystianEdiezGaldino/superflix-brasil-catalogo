
// Re-export services from subdirectories
export * from './tmdb/movies';
export * from './tmdb/series';
export * from './tmdb/search';
export * from './tmdb/doramas';
export * from './tmdb/anime';
export * from './tmdb/videos';
export * from './tmdb/utils';

import { MediaItem } from "@/types/movie";

// Fetch popular American series (sitcoms, dramas, etc.)
export const fetchPopularAmericanSeries = async (page: number = 1, limit: number = 60): Promise<MediaItem[]> => {
  try {
    // To get more results, fetch multiple pages and combine them
    const pages = Math.ceil(limit / 20); // TMDB returns 20 items per page
    let allSeries: any[] = [];
    
    for (let i = 0; i < pages; i++) {
      const currentPage = page + i;
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=3e12a7e85d7a29a86a227c7a9743f556&language=pt-BR&sort_by=popularity.desc&with_origin_country=US&with_original_language=en&page=${currentPage}`
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
        `https://api.themoviedb.org/3/discover/tv?api_key=3e12a7e85d7a29a86a227c7a9743f556&language=pt-BR&sort_by=popularity.desc&with_keywords=210024|222243&first_air_date_year=${currentYear}&page=${currentPage}`
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
