import { Series, MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Função base para buscar doramas
const fetchDoramasBase = async (url: string): Promise<MediaItem[]> => {
  const data = await fetchFromApi<{results?: any[]}>(url);
  const seriesWithType = addMediaTypeToResults(data.results || [], "tv");
  return seriesWithType.filter(drama => 
    drama && 
    'original_language' in drama && 
    drama.original_language === 'ko' &&
    drama.poster_path
  );
};

// Buscar lista completa de doramas
export const fetchKoreanDramas = async (page = 1, limit = 30): Promise<MediaItem[]> => {
  try {
    // Buscar doramas populares
    const popularUrl = buildApiUrl("/discover/tv", `&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=50&page=${page}`);
    const popularDramas = await fetchDoramasBase(popularUrl);
    
    // Buscar doramas bem avaliados
    const topRatedUrl = buildApiUrl("/discover/tv", `&with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=50&page=${page}`);
    const topRatedDramas = await fetchDoramasBase(topRatedUrl);
    
    // Combinar e remover duplicatas
    const allDramas = [...popularDramas, ...topRatedDramas];
    const uniqueDramas = allDramas.filter((drama, index, self) =>
      index === self.findIndex((d) => d.id === drama.id)
    );
    
    return limitResults(uniqueDramas, limit);
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};

// Distribuir doramas para cada seção
export const fetchPopularKoreanDramas = async (limit = 10): Promise<MediaItem[]> => {
  try {
    const allDoramas = await fetchKoreanDramas(1, 30);
    // Pegar os primeiros 10 doramas (mais populares)
    return allDoramas.slice(0, limit);
  } catch (error) {
    console.error("Error fetching popular Korean dramas:", error);
    return [];
  }
};

export const fetchTopRatedKoreanDramas = async (limit = 10): Promise<MediaItem[]> => {
  try {
    const allDoramas = await fetchKoreanDramas(1, 30);
    // Pegar os próximos 10 doramas (bem avaliados)
    return allDoramas.slice(10, 20);
  } catch (error) {
    console.error("Error fetching top rated Korean dramas:", error);
    return [];
  }
};

// Fetch Korean movies
export const fetchKoreanMovies = async (limit = 10): Promise<MediaItem[]> => {
  try {
    const allDoramas = await fetchKoreanDramas(1, 30);
    // Pegar os últimos 10 doramas
    return allDoramas.slice(20, 30);
  } catch (error) {
    console.error("Error fetching Korean movies:", error);
    return [];
  }
};

// Helper function to fetch additional dorama details
export const fetchDoramaDetails = async (id: number | string): Promise<Series | null> => {
  if (!id) return null;
  
  try {
    const url = buildApiUrl(`/tv/${id}`, "&append_to_response=external_ids");
    const dorama = await fetchFromApi<Series>(url);
    
    if (!dorama || !dorama.id) {
      return null;
    }
    
    return {
      ...dorama,
      media_type: "tv"
    } as Series;
  } catch (error) {
    console.error(`Error fetching dorama details for ID ${id}:`, error);
    return null;
  }
};

// Fetch cast for a dorama
export const fetchDoramaCast = async (id: string, limit = 10): Promise<any[]> => {
  if (!id) return [];
  
  try {
    const url = buildApiUrl(`/tv/${id}/credits`);
    const data = await fetchFromApi<{cast?: any[]}>(url);
    
    if (!data.cast || data.cast.length === 0) {
      return [];
    }
    
    return limitResults(data.cast, limit);
  } catch (error) {
    console.error(`Error fetching dorama cast for ID ${id}:`, error);
    return [];
  }
};

// Fetch similar doramas
export const fetchSimilarDoramas = async (id: string | number, limit = 12): Promise<MediaItem[]> => {
  if (!id) return [];
  
  try {
    const url = buildApiUrl(`/tv/${id}/similar`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    
    if (!data.results) return [];
    
    // Filter to only get Korean dramas
    const koreanDramas = (data.results || []).filter(item => 
      item && item.original_language === 'ko'
    );
    
    const dramasWithType = addMediaTypeToResults(koreanDramas, "tv");
    return limitResults(dramasWithType, limit);
  } catch (error) {
    console.error(`Error fetching similar doramas for ID ${id}:`, error);
    return [];
  }
};
