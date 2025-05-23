
import { TMDB_API_URL, TMDB_API_KEY } from '@/config/tmdb';

interface AnimeResponse {
  page: number;
  results: any[];
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

// Function to fetch anime IDs from Superflix
export const fetchSuperflixAnimeIds = async (): Promise<string[]> => {
  try {
    // Updated domain from superflixapi.fyi to superflixapi.ist
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
