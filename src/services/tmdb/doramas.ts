
import { Series } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Lista de IDs de doramas populares
const POPULAR_DORAMA_IDS = [
  209576, // Queen of Tears
  236462, // Lovely Runner
  216523, // Família por Escolha
  203588, // O Que Vem Depois do Amor
  225701, // Meu Mafioso Predileto
  218188, // Doctor Slump
  213131, // Mr. Plankton
  213330, // A Lenda de Shen Li
  202225, // Floresce na Adversidade
  208930, // The Spirealm
  225475, // Jogo da Morte - Parte 2
  224655, // The Double
  216634, // Amor Pelo Amor
  213183, // Judge From Hell
  215437, // Begins ≠ Youth
  217744, // Flex x Cop
  213891, // Anjos Caem Às Vezes
  201873, // Parasyte: The Grey
  109840, // Gyeongseong Creature
  127240, // O Jogo da Pirâmide
  135157  // Alquimia das Almas
];

// Fetch Korean dramas by specific IDs (popular ones)
export const fetchPopularDoramas = async (limit = 10) => {
  try {
    // Use a subset of IDs for popular doramas
    const popularIds = POPULAR_DORAMA_IDS.slice(0, limit);
    const promises = popularIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => ({...drama, media_type: "tv" as const}))
    );
    
    const results = await Promise.all(promises);
    return results.filter(drama => !!drama.id);
  } catch (error) {
    console.error("Error fetching popular doramas:", error);
    return [];
  }
};

// Fetch top rated Korean dramas
export const fetchTopRatedDoramas = async (limit = 10) => {
  try {
    // Use the first few IDs from the popular list, representing top rated ones
    const topRatedIds = POPULAR_DORAMA_IDS.slice(0, Math.min(limit, 6));
    const promises = topRatedIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => ({...drama, media_type: "tv" as const}))
    );
    
    const results = await Promise.all(promises);
    return results.filter(drama => !!drama.id);
  } catch (error) {
    console.error("Error fetching top rated doramas:", error);
    return [];
  }
};

// Generic function to fetch Korean dramas
export const fetchKoreanDramas = async (page = 1, limit = 20) => {
  try {
    // For a real implementation, we would use a proper API endpoint for doramas
    // Since TMDB doesn't have a specific endpoint for Korean dramas, we're using popular IDs
    if (page === 1) {
      return fetchPopularDoramas(limit);
    } else {
      // For pagination, we'd return different sets of dramas
      const offset = (page - 1) * limit;
      const pageIds = POPULAR_DORAMA_IDS.slice(offset, offset + limit);
      
      const promises = pageIds.map(id => 
        fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
          .then(drama => ({...drama, media_type: "tv" as const}))
      );
      
      const results = await Promise.all(promises);
      return results.filter(drama => !!drama.id);
    }
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};

// Fetch dorama details
export const fetchDoramaDetails = async (id: string): Promise<Series> => {
  try {
    const url = buildApiUrl(`/tv/${id}`, "&append_to_response=external_ids");
    return await fetchFromApi<Series>(url);
  } catch (error) {
    console.error("Error fetching dorama details:", error);
    return {} as Series;
  }
};
