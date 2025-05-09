
import { Series } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Lista de IDs de doramas populares com nomes em português
const POPULAR_DORAMA_IDS = [
  129478, // Squid Game (Round 6)
  93405,  // Vincenzo
  93740,  // It's Okay to Not Be Okay (Tudo Bem Não Ser Normal)
  94796,  // Sweet Home
  84858,  // Crash Landing on You (Pousando no Amor)
  114860, // My Name (Meu Nome)
  104877, // Love Alarm (Alarme do Amor)
  70844,  // Goblin (Dokkaebi/Goblin: O Solitário e a Grande Deusa)
  74758,  // Something in the Rain (Algo no Ar)
  86706,  // Kingdom
  79242,  // What's Wrong with Secretary Kim (O Que Há de Errado com a Secretária Kim)
  81356,  // One Spring Night (Em Uma Noite de Primavera)
  67915,  // Descendants of the Sun (Descendentes do Sol)
  84553,  // Vagabond
  94892,  // Start-Up (A Start-Up)
  96162,  // True Beauty (Beleza Verdadeira)
  101752, // Hospital Playlist (Playlist do Hospital)
  68612,  // Reply 1988 (Responda 1988)
  62560,  // Boys Over Flowers (Os Garotos São Melhores que as Flores)
  86328,  // Hotel Del Luna (Hotel da Lua)
  85020,  // The King: Eternal Monarch (O Rei: Monarca Eterno)
  61041,  // My Love from the Star (Vindo de Outro Planeta)
  67193,  // Healer
  77169,  // Strong Woman Do Bong Soon (Mulher Forte Bong-soon)
  81227,  // When the Camellia Blooms (Quando a Camélia Floresce)
  93831,  // The World of the Married (O Mundo dos Casados)
  72879,  // Oh My Ghost (Oh Meu Fantasma)
  71570,  // Prison Playbook (Manual de Sobrevivência na Prisão)
  61904,  // My Girlfriend Is a Gumiho (Minha Namorada é uma Gumiho)
  100957, // Itaewon Class (Aula Itaewon)
  109840, // Gyeongseong Creature (Criatura de Gyeongseong)
  127240, // Squid Game 2 (Round 6: Segunda Temporada)
  135157, // Alchemy of Souls (Alquimia das Almas)
];

// Fetch Korean dramas by specific IDs (popular ones)
export const fetchPopularDoramas = async (limit = 10) => {
  try {
    // Use a subset of IDs for popular doramas
    const popularIds = POPULAR_DORAMA_IDS.slice(0, limit);
    const promises = popularIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => ({...drama, media_type: "tv" as const}))
        .catch(error => {
          console.error(`Error fetching dorama with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(drama => drama && drama.id);
  } catch (error) {
    console.error("Error fetching popular doramas:", error);
    return [];
  }
};

// Fetch top rated Korean dramas
export const fetchTopRatedDoramas = async (limit = 10) => {
  try {
    // Use the first few IDs from the popular list, representing top rated ones
    const topRatedIds = POPULAR_DORAMA_IDS.slice(0, Math.min(limit, 10));
    const promises = topRatedIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => ({...drama, media_type: "tv" as const}))
        .catch(error => {
          console.error(`Error fetching dorama with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(drama => drama && drama.id);
  } catch (error) {
    console.error("Error fetching top rated doramas:", error);
    return [];
  }
};

// Generic function to fetch Korean dramas
export const fetchKoreanDramas = async (page = 1, limit = 20) => {
  try {
    // Calcular o índice inicial e final com base na página e limite
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Garantir que não ultrapassamos o número de doramas disponíveis
    const pageIds = POPULAR_DORAMA_IDS.slice(startIndex, endIndex);
    
    if (pageIds.length === 0) {
      return [];
    }
    
    const promises = pageIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => ({...drama, media_type: "tv" as const}))
        .catch(error => {
          console.error(`Error fetching dorama with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(drama => drama && drama.id);
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};

// Fetch dorama details
export const fetchDoramaDetails = async (id: string): Promise<Series> => {
  try {
    const url = buildApiUrl(`/tv/${id}`, "&append_to_response=credits,similar,videos,external_ids");
    return await fetchFromApi<Series>(url);
  } catch (error) {
    console.error("Error fetching dorama details:", error);
    return {} as Series;
  }
};

// Fetch similar doramas
export const fetchSimilarDoramas = async (id: string, limit = 6): Promise<Series[]> => {
  try {
    const url = buildApiUrl(`/tv/${id}/similar`);
    const data = await fetchFromApi<{results: Series[]}>(url);
    const results = data.results?.map(item => ({
      ...item,
      media_type: "tv" as const
    })) || [];
    
    return limitResults(results, limit);
  } catch (error) {
    console.error("Error fetching similar doramas:", error);
    return [];
  }
};

// Fetch cast for a dorama
export const fetchDoramaCast = async (id: string, limit = 10) => {
  try {
    const url = buildApiUrl(`/tv/${id}/credits`);
    const data = await fetchFromApi<{cast?: any[]}>(url);
    return (data.cast || []).slice(0, limit);
  } catch (error) {
    console.error("Error fetching dorama cast:", error);
    return [];
  }
};
