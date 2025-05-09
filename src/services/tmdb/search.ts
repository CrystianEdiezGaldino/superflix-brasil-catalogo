
import { buildApiUrl, fetchFromApi } from "./utils";

// Search for media (movies, TV shows, etc.)
export const searchMedia = async (query: string) => {
  try {
    const url = buildApiUrl("/search/multi", `&query=${query}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    return data.results || [];
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

// Fetch recommendations based on a media ID
export const fetchRecommendations = async (mediaId: string, mediaType: string) => {
  try {
    const url = buildApiUrl(`/${mediaType}/${mediaId}/recommendations`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    
    // Add media_type to each recommended item
    const recommendationsWithType = data.results?.map((item: any) => ({
      ...item,
      media_type: mediaType === 'movie' ? 'movie' : 'tv'
    })) || [];
    
    return recommendationsWithType;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};
