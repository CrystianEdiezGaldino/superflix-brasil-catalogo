
import { Series, MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch Korean dramas (doramas)
export const fetchKoreanDramas = async (limit = 20): Promise<MediaItem[]> => {
  const baseFetchAndProcess = async (url: string): Promise<MediaItem[]> => {
    const data = await fetchFromApi<{results?: any[]}>(url);
    const seriesWithType = addMediaTypeToResults(data.results || [], "tv");
    return seriesWithType;
  };

  try {
    const koreaUrl = buildApiUrl("/discover/tv", "&with_original_language=ko&sort_by=popularity.desc");
    const koreanDramas = await baseFetchAndProcess(koreaUrl);
    
    // Filter to get only Korean dramas (you could add more specific filters here)
    const filteredDramas = koreanDramas.filter(drama => {
      return drama && 'original_language' in drama && drama.original_language === 'ko';
    });
    
    return limitResults(filteredDramas, limit);
  } catch (error) {
    console.error("Error fetching Korean dramas:", error);
    return [];
  }
};

// Fetch popular doramas
export const fetchPopularKoreanDramas = async (limit = 12): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/tv", "&with_original_language=ko&sort_by=popularity.desc");
    const data = await fetchFromApi<{results?: any[]}>(url);
    if (!data.results) return [];
    
    const dramasWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(dramasWithType, limit);
  } catch (error) {
    console.error("Error fetching popular Korean dramas:", error);
    return [];
  }
};

// Fetch top-rated doramas
export const fetchTopRatedKoreanDramas = async (limit = 12): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/tv", "&with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=100");
    const data = await fetchFromApi<{results?: any[]}>(url);
    if (!data.results) return [];
    
    const dramasWithType = addMediaTypeToResults(data.results, "tv");
    return limitResults(dramasWithType, limit);
  } catch (error) {
    console.error("Error fetching top rated Korean dramas:", error);
    return [];
  }
};

// Fetch Korean movies
export const fetchKoreanMovies = async (limit = 12): Promise<MediaItem[]> => {
  try {
    const url = buildApiUrl("/discover/movie", "&with_original_language=ko&sort_by=popularity.desc");
    const data = await fetchFromApi<{results?: any[]}>(url);
    if (!data.results) return [];
    
    const moviesWithType = data.results.map(item => ({
      ...item,
      media_type: "movie"
    }));
    
    return limitResults(moviesWithType, limit);
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
    };
  } catch (error) {
    console.error(`Error fetching dorama details for ID ${id}:`, error);
    return null;
  }
};
