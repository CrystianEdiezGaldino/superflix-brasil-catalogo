
import { TMDB_API_URL, TMDB_API_KEY } from '@/config/tmdb';
import { MediaItem } from '@/types/movie';

interface AnimeResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export const fetchAnimes = async (page: number = 1, sortBy: string = 'popularity.desc'): Promise<AnimeResponse> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_origin_country=JP&sort_by=${sortBy}&page=${page}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar animes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar animes:', error);
    throw error;
  }
};

export const fetchTopRatedAnimes = async (page: number = 1): Promise<AnimeResponse> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar animes bem avaliados');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar animes bem avaliados:', error);
    throw error;
  }
};

export const fetchRecentAnimes = async (page: number = 1): Promise<AnimeResponse> => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
  
  const fromDate = sixMonthsAgo.toISOString().split('T')[0];
  const toDate = currentDate.toISOString().split('T')[0];
  
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_origin_country=JP&air_date.gte=${fromDate}&sort_by=first_air_date.desc&page=${page}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar animes recentes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar animes recentes:', error);
    throw error;
  }
};

// Function to fetch anime IDs from Superflix
export const fetchSuperflixAnimeIds = async (): Promise<string[]> => {
  try {
    // Updated domain from superflixapi.ist to superflixapi.ist
    const response = await fetch('https://superflixapi.ist/animes/export/');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar IDs de animes do Superflix');
    }
    
    const text = await response.text();
    if (!text) return [];
    
    // Parse IDs from the text response
    const animeIds = text
      .split('<br>')
      .map(id => id.trim())
      .filter(Boolean);
    
    return animeIds;
  } catch (error) {
    console.error('Erro ao buscar IDs de animes do Superflix:', error);
    return [];
  }
};

// Function to fetch anime details for a specific media_id
export const fetchAnimeDetails = async (animeId: number): Promise<MediaItem | null> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/tv/${animeId}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits,recommendations,similar,external_ids`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar detalhes do anime ${animeId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do anime ${animeId}:`, error);
    return null;
  }
};

// Helper function to categorize whether an anime is adult content
export const isAdultAnime = (anime: MediaItem): boolean => {
  const adultGenres = [10798, 9292]; // IDs for hentai/adult genres
  const adultKeywords = ['hentai', 'ecchi', 'adult'];
  
  // Check genre IDs
  const hasAdultGenre = anime.genre_ids?.some(id => adultGenres.includes(id));
  
  // Check title and overview for adult keywords
  const title = (anime.name || anime.title || '').toLowerCase();
  const overview = (anime.overview || '').toLowerCase();
  const hasAdultKeyword = adultKeywords.some(keyword => 
    title.includes(keyword) || overview.includes(keyword)
  );
  
  return !!anime.adult || hasAdultGenre || hasAdultKeyword;
};
