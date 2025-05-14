import { API_KEY, BASE_URL, DEFAULT_LANGUAGE } from './config';
import { MediaItem } from '@/types/movie';
import { fetchFromApi, addMediaTypeToResults } from './utils';

interface TMDBResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

// Fetch popular anime
export const fetchAnime = async (page: number = 1, limit: number = 20): Promise<MediaItem[]> => {
  try {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=popularity.desc&with_keywords=210024|222243&page=${page}`;
    const data = await fetchFromApi<TMDBResponse>(url);
    return addMediaTypeToResults(data.results?.slice(0, limit), "tv");
  } catch (error) {
    console.error('Error fetching anime:', error);
    return [];
  }
};

// Fetch top rated anime
export const fetchTopRatedAnime = async (page: number = 1, limit: number = 20): Promise<MediaItem[]> => {
  try {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=vote_average.desc&vote_count.gte=100&with_keywords=210024|222243&page=${page}`;
    const data = await fetchFromApi<TMDBResponse>(url);
    return addMediaTypeToResults(data.results?.slice(0, limit), "tv");
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    return [];
  }
};

// Fetch trending anime
export const fetchTrendingAnime = async (page: number = 1, limit: number = 20): Promise<MediaItem[]> => {
  try {
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&with_keywords=210024|222243&page=${page}`;
    const data = await fetchFromApi<TMDBResponse>(url);
    
    // Filter out results that are likely anime (typically Japanese origin)
    const animeResults = data.results?.filter(item => 
      item.original_language === "ja" &&
      !item.genre_ids?.includes(10764) && // Not reality TV
      !item.genre_ids?.includes(10767)    // Not talk show
    ) || [];
    
    return addMediaTypeToResults(animeResults.slice(0, limit), "tv");
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

// Fetch anime by specific ID list (batched requests)
export const fetchAnimeByIds = async (ids: number[], limit: number = 60): Promise<MediaItem[]> => {
  try {
    // Batch IDs in chunks of 20 to avoid making too many requests at once
    const batchSize = 20;
    let allAnime: MediaItem[] = [];
    
    // Process IDs in batches
    for (let i = 0; i < Math.min(ids.length, limit); i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      const batchPromises = batchIds.map(id => 
        fetchFromApi<any>(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`)
      );
      
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(result => result && result.id).map(item => ({
        ...item,
        media_type: "tv"
      }));
      
      allAnime = [...allAnime, ...validResults];
      
      if (allAnime.length >= limit) {
        break;
      }
    }
    
    return allAnime.slice(0, limit);
  } catch (error) {
    console.error('Error fetching anime by IDs:', error);
    return [];
  }
};

// Function to fetch specific anime recommendations from a curated list
export const fetchSpecificAnimeRecommendations = async (limit: number = 30): Promise<MediaItem[]> => {
  // This is a curated list of popular anime IDs
  const popularAnimeIds = [60625, 121787, 94693, 80713, 1988, 607, 4229, 134581, 670, 34158, 2405];
  return fetchAnimeByIds(popularAnimeIds, limit);
};

// Function to fetch recent anime (from current year)
export const fetchRecentAnime = async (limit: number = 30): Promise<MediaItem[]> => {
  const currentYear = new Date().getFullYear();
  
  try {
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=popularity.desc&first_air_date_year=${currentYear}&with_keywords=210024|222243&page=1`;
    const data = await fetchFromApi<TMDBResponse>(url);
    return addMediaTypeToResults(data.results?.slice(0, limit), "tv");
  } catch (error) {
    console.error('Error fetching recent anime:', error);
    return [];
  }
};

// Function to fetch seasonal anime (current season)
export const fetchSeasonalAnime = async (limit: number = 30): Promise<MediaItem[]> => {
  const date = new Date();
  const year = date.getFullYear();
  
  // Determine current season
  const month = date.getMonth() + 1;
  let season: string;
  
  if (month >= 3 && month <= 5) season = "spring";
  else if (month >= 6 && month <= 8) season = "summer";
  else if (month >= 9 && month <= 11) season = "fall";
  else season = "winter";
  
  try {
    // Use general anime query but sort by most recent first
    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}&sort_by=first_air_date.desc&first_air_date_year=${year}&with_keywords=210024|222243&page=1`;
    const data = await fetchFromApi<TMDBResponse>(url);
    return addMediaTypeToResults(data.results?.slice(0, limit), "tv");
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return [];
  }
};

// Parse provided anime IDs (for use with the full catalog)
export const animeIdsList = [
  60625, 121787, 94693, 80713, 1988, 607, 4229, 134581, 670, 34158, 2405, 1720,
  3611, 255, 4334, 129959, 202864, 109934, 127714, 114477, 139551, 194774,
  // ... (keeping the first portion for illustration)
];

// Function to fetch curated anime sections using specific ID ranges
export const fetchAnimeSections = async (): Promise<{
  featuredAnime: MediaItem[];
  popularAnime: MediaItem[];
  newReleases: MediaItem[];
  classicAnime: MediaItem[];
  actionAnime: MediaItem[];
}> => {
  // First 60 IDs for featured content
  const featuredIds = animeIdsList.slice(0, 60);
  // Next 60 for popular
  const popularIds = animeIdsList.slice(60, 120);
  // Next 30 for new releases
  const newReleaseIds = animeIdsList.slice(120, 150);
  // Next 30 for classics
  const classicIds = animeIdsList.slice(150, 180);
  // Next 30 for action
  const actionIds = animeIdsList.slice(180, 210);

  const [featured, popular, newReleases, classics, action] = await Promise.all([
    fetchAnimeByIds(featuredIds, 60),
    fetchAnimeByIds(popularIds, 60),
    fetchAnimeByIds(newReleaseIds, 30),
    fetchAnimeByIds(classicIds, 30),
    fetchAnimeByIds(actionIds, 30)
  ]);

  return {
    featuredAnime: featured,
    popularAnime: popular,
    newReleases: newReleases,
    classicAnime: classics,
    actionAnime: action
  };
};
