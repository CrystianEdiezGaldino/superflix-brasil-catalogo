import { Series, Season } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch popular TV series
export const fetchPopularSeries = async (page = 1, itemsPerPage = 20) => {
  try {
    const url = buildApiUrl("/tv/popular", `&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    
    // Filtrar apenas séries que possuem imagens
    const seriesWithImages = seriesWithType.filter(series => 
      series && 
      series.poster_path && 
      series.backdrop_path &&
      series.poster_path !== null && 
      series.backdrop_path !== null
    );
    
    return limitResults(seriesWithImages, itemsPerPage);
  } catch (error) {
    console.error("Error fetching popular series:", error);
    return [];
  }
};

// Fetch popular American series - New function
export const fetchPopularAmericanSeries = async (page = 1, itemsPerPage = 20) => {
  try {
    // Using the discover endpoint with origin_country=US filter
    const url = buildApiUrl("/discover/tv", `&page=${page}&with_origin_country=US&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    
    // Filtrar apenas séries que possuem imagens
    const seriesWithImages = seriesWithType.filter(series => 
      series && 
      series.poster_path && 
      series.backdrop_path &&
      series.poster_path !== null && 
      series.backdrop_path !== null
    );
    
    return limitResults(seriesWithImages, itemsPerPage);
  } catch (error) {
    console.error("Error fetching popular American series:", error);
    return [];
  }
};

// Fetch top rated series
export const fetchTopRatedSeries = async (limit = 12) => {
  try {
    const url = buildApiUrl("/tv/top_rated");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching top rated series:", error);
    return [];
  }
};

// Fetch trending series of the week
export const fetchTrendingSeries = async (limit = 12) => {
  try {
    const url = buildApiUrl("/trending/tv/week");
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching trending series:", error);
    return [];
  }
};

// Fetch recent series released in the last 5 years
export const fetchRecentSeries = async (limit = 12) => {
  try {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    const fromDate = `${fiveYearsAgo}-01-01`;
    const toDate = `${currentYear}-12-31`;
    
    const url = buildApiUrl("/discover/tv", `&first_air_date.gte=${fromDate}&first_air_date.lte=${toDate}&sort_by=first_air_date.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(seriesWithType, limit);
  } catch (error) {
    console.error("Error fetching recent series:", error);
    return [];
  }
};

// Fetch TV series details with improved error handling
export const fetchSeriesDetails = async (id: string | number, language: string = 'pt-BR', signal?: AbortSignal): Promise<Series> => {
  try {
    console.log(`Fetching series details for ID: ${id}`);
    
    // Verificar se o ID é válido
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error(`ID inválido para buscar detalhes da série: ${id}`);
    }
    
    const url = buildApiUrl(`/tv/${id}`, `&language=${language}&append_to_response=external_ids,credits,recommendations`);
    console.log(`Series details URL: ${url}`);
    
    const series = await fetchFromApi<Series>(url, signal);
    
    // Verificar se a série retornada tem os dados necessários
    if (!series || !series.id) {
      throw new Error(`Série não encontrada ou dados incompletos para ID: ${id}`);
    }
    
    console.log(`Series details fetched successfully for: ${series.name || series.title}`);
    return series;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error(`Error fetching series details for ID ${id}:`, error);
    // Retornar um objeto série vazio mas válido para evitar crashes
    return {
      id: Number(id),
      name: "Série não encontrada",
      overview: "Esta série não pôde ser carregada. Tente novamente mais tarde.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "",
      media_type: "tv",
      vote_average: 0,
      vote_count: 0,
      original_language: "",
      original_name: "",
      popularity: 0
    } as Series;
  }
};

// Fetch season details
export const fetchSeriesSeasonDetails = async (id: string, seasonNumber: number): Promise<Season> => {
  try {
    const url = buildApiUrl(`/tv/${id}/season/${seasonNumber}`);
    return await fetchFromApi<Season>(url);
  } catch (error) {
    console.error("Error fetching series season details:", error);
    return {} as Season;
  }
};

// Alias for fetchSeriesSeasonDetails
export const fetchSeasonDetails = fetchSeriesSeasonDetails;

export const fetchSeriesRecommendations = async (seriesId: string) => {
  try {
    const url = buildApiUrl(`/tv/${seriesId}/recommendations`, '&language=pt-BR');
    const data = await fetchFromApi<{results?: any[]}>(url);
    return {
      results: addMediaTypeToResults(data.results || [], "tv")
    };
  } catch (error) {
    console.error("Error fetching series recommendations:", error);
    return { results: [] };
  }
};

// Fetch popular TV series in Brazil
export const fetchPopularTVSeriesInBrazil = async (page = 1, itemsPerPage = 20) => {
  try {
    // Exclude talk shows (genre ID 10767) and exclude shows with "Late" or "Show" in title
    const url = buildApiUrl("/discover/tv", 
      `&page=${page}&region=BR&sort_by=popularity.desc&language=pt-BR&vote_count.gte=100&without_genres=10767`
    );
    const data = await fetchFromApi<{results?: any[]}>(url);
    
    // Filter out talk shows, late night shows, and shows without Portuguese titles
    const filteredResults = data.results?.filter(show => {
      const title = (show.name || '').toLowerCase();
      const originalTitle = (show.original_name || '').toLowerCase();
      
      // Check if the title is in Portuguese (has Brazilian Portuguese characters or common Portuguese words)
      const hasPortugueseTitle = /[áàâãéèêíïóôõöúüç]/.test(title) || 
        /\b(o|a|os|as|um|uma|uns|umas|e|é|não|sim|que|como|para|por|com|sem|em|no|na|nos|nas)\b/i.test(title);

      return !title.includes('late') && 
             !title.includes('show') && 
             !title.includes('letterman') && 
             !title.includes('colbert') && 
             !title.includes('meyers') &&
             !title.includes('ferguson') &&
             hasPortugueseTitle;
    }) || [];

    const seriesWithType = addMediaTypeToResults(filteredResults, "tv");
    return limitResults(seriesWithType, itemsPerPage);
  } catch (error) {
    console.error("Error fetching popular TV series in Brazil:", error);
    return [];
  }
};

// Fetch recent releases (movies and series) for current year
export const fetchRecentReleases = async (page = 1, itemsPerPage = 100) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Fetch recent TV series
    const seriesUrl = buildApiUrl("/discover/tv", 
      `&page=${page}&region=BR&sort_by=first_air_date.desc&language=pt-BR&vote_count.gte=100&without_genres=10767&first_air_date.gte=${currentYear}-01-01&first_air_date.lte=${currentDate}`
    );
    const seriesData = await fetchFromApi<{results?: any[]}>(seriesUrl);
    
    // Filter TV series
    const filteredSeries = seriesData.results?.filter(show => {
      const title = (show.name || '').toLowerCase();
      const hasPortugueseTitle = /[áàâãéèêíïóôõöúüç]/.test(title) || 
        /\b(o|a|os|as|um|uma|uns|umas|e|é|não|sim|que|como|para|por|com|sem|em|no|na|nos|nas)\b/i.test(title);

      return !title.includes('late') && 
             !title.includes('show') && 
             !title.includes('letterman') && 
             !title.includes('colbert') && 
             !title.includes('meyers') &&
             !title.includes('ferguson') &&
             hasPortugueseTitle;
    }) || [];

    // Fetch recent movies
    const moviesUrl = buildApiUrl("/discover/movie", 
      `&page=${page}&region=BR&sort_by=release_date.desc&language=pt-BR&vote_count.gte=100&release_date.gte=${currentYear}-01-01&release_date.lte=${currentDate}`
    );
    const moviesData = await fetchFromApi<{results?: any[]}>(moviesUrl);
    
    // Filter movies
    const filteredMovies = moviesData.results?.filter(movie => {
      const title = (movie.title || '').toLowerCase();
      const hasPortugueseTitle = /[áàâãéèêíïóôõöúüç]/.test(title) || 
        /\b(o|a|os|as|um|uma|uns|umas|e|é|não|sim|que|como|para|por|com|sem|em|no|na|nos|nas)\b/i.test(title);

      return hasPortugueseTitle;
    }) || [];

    // Combine and sort by release date
    const allContent = [
      ...addMediaTypeToResults(filteredSeries, "tv"),
      ...addMediaTypeToResults(filteredMovies, "movie")
    ].sort((a, b) => {
      const dateA = a.media_type === 'tv' ? a.first_air_date : a.release_date;
      const dateB = b.media_type === 'tv' ? b.first_air_date : b.release_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return limitResults(allContent, itemsPerPage);
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    return [];
  }
};
