
import { MediaItem } from "@/types/movie";
import { isValidAnime } from "@/utils/animeUtils";

/**
 * Fetches anime data from multiple TMDB endpoints
 */
export const fetchAnimeData = async (page: number = 1): Promise<{
  animes: MediaItem[];
  totalPages: number;
}> => {
  try {
    const promises = [
      // Popular animes
      fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${page}`),
      // Top rated animes
      fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${page}`),
      // On the air animes
      fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${page}`),
      // Discover animes
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=16&language=pt-BR&page=${page}&sort_by=popularity.desc`)
    ];

    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map(r => r.json()));

    const filterValidAnimes = (results: any[]) => {
      if (!results || !Array.isArray(results)) return [];
      
      return results.filter((anime: any) => {
        const isJapanese = anime.origin_country?.includes('JP') || 
                          anime.original_language === 'ja' ||
                          (anime.title?.toLowerCase().includes('anime') || anime.name?.toLowerCase().includes('anime'));
        return isJapanese && isValidAnime(anime);
      });
    };

    const popularAnimes = filterValidAnimes(data[0]?.results || []);
    const topRatedAnimes = filterValidAnimes(data[1]?.results || []);
    const onTheAirAnimes = filterValidAnimes(data[2]?.results || []);
    const discoverAnimes = filterValidAnimes(data[3]?.results || []);

    // Combine and remove duplicates
    const allResults = [...popularAnimes, ...topRatedAnimes, ...onTheAirAnimes, ...discoverAnimes];
    const uniqueAnimes = allResults.filter((anime, index, self) => 
      index === self.findIndex((a) => a.id === anime.id)
    );

    return {
      animes: uniqueAnimes,
      totalPages: Math.max(
        data[0]?.total_pages || 1, 
        data[1]?.total_pages || 1, 
        data[2]?.total_pages || 1, 
        data[3]?.total_pages || 1
      )
    };
  } catch (error) {
    console.error('Error fetching animes:', error);
    return { animes: [], totalPages: 0 };
  }
};

/**
 * Fetches anime IDs from Superflix API
 */
export const fetchSuperflixAnimeIds = async (): Promise<string[]> => {
  try {
    // Updated domain from superflixapi.ist to superflixapi.ist
    const response = await fetch('/api/animes');
    if (!response.ok) throw new Error('Error fetching animes from Superflix');
    
    const text = await response.text();
    if (!text) return [];
    
    const ids = text.split('<br>').map(id => id.trim()).filter(Boolean);
    return ids;
  } catch (error) {
    console.error('Error fetching animes from Superflix:', error);
    return [];
  }
};
