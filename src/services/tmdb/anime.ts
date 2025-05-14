
import { API_KEY, BASE_URL, DEFAULT_LANGUAGE } from './config';
import { MediaItem } from '@/types/movie';
import { fetchFromApi, addMediaTypeToResults } from './utils';
import { animeIdsList, getCategoryAnimeIds } from '@/data/animeIds';

interface TMDBResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

// Fetch anime by batches of IDs
export const fetchAnimeByIds = async (ids: number[], limit: number = 20): Promise<MediaItem[]> => {
  try {
    const promises = ids.slice(0, limit).map(id => 
      fetchFromApi<MediaItem>(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}`)
        .then(data => ({
          ...data,
          media_type: "tv" as const
        }))
        .catch(error => {
          console.error(`Error fetching anime ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    return results.filter(item => item !== null) as MediaItem[];
  } catch (error) {
    console.error('Error fetching anime by IDs:', error);
    return [];
  }
};

// Fetch popular anime from our predefined list
export const fetchAnime = async (page: number = 1, limit: number = 20): Promise<MediaItem[]> => {
  const categories = getCategoryAnimeIds();
  const start = (page - 1) * limit;
  const ids = animeIdsList.slice(start, start + limit);
  return fetchAnimeByIds(ids, limit);
};

// Fetch top rated anime from our predefined list
export const fetchTopRatedAnime = async (limit: number = 20): Promise<MediaItem[]> => {
  const categories = getCategoryAnimeIds();
  return fetchAnimeByIds(categories.topRated, limit);
};

// Fetch trending anime from our predefined list
export const fetchTrendingAnime = async (limit: number = 20): Promise<MediaItem[]> => {
  const categories = getCategoryAnimeIds();
  return fetchAnimeByIds(categories.trending, limit);
};

// Fetch recent anime from our predefined list
export const fetchRecentAnime = async (limit: number = 20): Promise<MediaItem[]> => {
  const categories = getCategoryAnimeIds();
  return fetchAnimeByIds(categories.recent, limit);
};

// Fetch seasonal anime from our predefined list
export const fetchSeasonalAnime = async (limit: number = 20): Promise<MediaItem[]> => {
  const categories = getCategoryAnimeIds();
  return fetchAnimeByIds(categories.seasonal, limit);
};

// Function to fetch anime sections using our predefined ID list
export const fetchAnimeSections = async (): Promise<{
  featuredAnime: MediaItem[];
  popularAnime: MediaItem[];
  newReleases: MediaItem[];
  classicAnime: MediaItem[];
  actionAnime: MediaItem[];
}> => {
  // We'll split our anime list into different sections
  const featuredIds = animeIdsList.slice(0, 10);
  const popularIds = animeIdsList.slice(10, 25);
  const newReleaseIds = animeIdsList.slice(25, 40);
  const classicIds = animeIdsList.slice(40, 55);
  const actionIds = animeIdsList.slice(55, 70);

  const [featured, popular, newReleases, classics, action] = await Promise.all([
    fetchAnimeByIds(featuredIds, 10),
    fetchAnimeByIds(popularIds, 15),
    fetchAnimeByIds(newReleaseIds, 15),
    fetchAnimeByIds(classicIds, 15),
    fetchAnimeByIds(actionIds, 15)
  ]);

  return {
    featuredAnime: featured,
    popularAnime: popular,
    newReleases: newReleases,
    classicAnime: classics,
    actionAnime: action
  };
};

// Function to fetch specific batch of anime by index and batch size
export const fetchAnimeBatch = async (batchIndex: number, batchSize: number = 20): Promise<MediaItem[]> => {
  const start = batchIndex * batchSize;
  const end = start + batchSize;
  const ids = animeIdsList.slice(start, end);
  
  if (ids.length === 0) {
    return [];
  }
  
  return fetchAnimeByIds(ids, batchSize);
};
