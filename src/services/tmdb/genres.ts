
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Fetch content by genre ID
export const fetchContentByGenre = async (genreId: number, mediaType: 'movie' | 'tv' = 'movie', page = 1, itemsPerPage = 50) => {
  try {
    const url = buildApiUrl(`/discover/${mediaType}`, `&with_genres=${genreId}&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, mediaType);
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching ${mediaType} content for genre ${genreId}:`, error);
    return [];
  }
};

// Fetch popular content in Brazil
export const fetchPopularInBrazil = async (mediaType: 'movie' | 'tv' = 'movie', page = 1, itemsPerPage = 50) => {
  try {
    const url = buildApiUrl(`/discover/${mediaType}`, `&region=BR&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, mediaType);
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching popular ${mediaType} content in Brazil:`, error);
    return [];
  }
};

// Fetch award-winning content
export const fetchAwardWinningContent = async (mediaType: 'movie' | 'tv' = 'movie', page = 1, itemsPerPage = 50) => {
  try {
    // Using vote_average as a proxy for award-winning content
    const url = buildApiUrl(`/discover/${mediaType}`, `&vote_average.gte=8&vote_count.gte=1000&page=${page}&sort_by=vote_average.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, mediaType);
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching award-winning ${mediaType} content:`, error);
    return [];
  }
};

// Common genre IDs for TMDB
export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
  // TV Genres
  ACTION_ADVENTURE_TV: 10759,
  ANIMATION_TV: 16,
  COMEDY_TV: 35,
  CRIME_TV: 80,
  DOCUMENTARY_TV: 99,
  DRAMA_TV: 18,
  FAMILY_TV: 10751,
  KIDS_TV: 10762,
  MYSTERY_TV: 9648,
  NEWS_TV: 10763,
  REALITY_TV: 10764,
  SCI_FI_FANTASY_TV: 10765,
  SOAP_TV: 10766,
  TALK_TV: 10767,
  WAR_POLITICS_TV: 10768,
  WESTERN_TV: 37
};

// Fetch content by director
export const fetchContentByDirector = async (personId: number, page = 1, itemsPerPage = 50) => {
  try {
    const url = buildApiUrl(`/discover/movie`, `&with_crew=${personId}&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'movie');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching content for director ${personId}:`, error);
    return [];
  }
};

// Director IDs for some famous directors
export const DIRECTOR_IDS = {
  CHRISTOPHER_NOLAN: 525,
  QUENTIN_TARANTINO: 138,
  STEVEN_SPIELBERG: 488,
  MARTIN_SCORSESE: 1032,
  JAMES_CAMERON: 2710,
  STANLEY_KUBRICK: 240
};

// Fetch recently released content
export const fetchRecentReleases = async (mediaType: 'movie' | 'tv' = 'movie', daysBack = 30, page = 1, itemsPerPage = 50) => {
  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - daysBack);
    
    const toDate = today.toISOString().split('T')[0];
    const fromDate = pastDate.toISOString().split('T')[0];
    
    const releaseType = mediaType === 'movie' ? 'primary_release_date' : 'first_air_date';
    
    const url = buildApiUrl(`/discover/${mediaType}`, `&${releaseType}.gte=${fromDate}&${releaseType}.lte=${toDate}&page=${page}&sort_by=${releaseType}.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, mediaType);
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching recent ${mediaType} releases:`, error);
    return [];
  }
};

// Fetch dubbed or subtitled content
export const fetchByLanguage = async (original: boolean = false, page = 1, itemsPerPage = 50) => {
  try {
    // For original with subtitles, we look for non-Portuguese language films
    // For dubbed, we look for films available in Portuguese
    const url = original
      ? buildApiUrl('/discover/movie', `&with_original_language=!pt&page=${page}&sort_by=popularity.desc&language=pt-BR`)
      : buildApiUrl('/discover/movie', `&with_original_language=!pt&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'movie');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching ${original ? 'original' : 'dubbed'} content:`, error);
    return [];
  }
};

// Fetch content based on specific franchises
export const fetchFranchiseContent = async (franchiseKeywords: number[], page = 1, itemsPerPage = 50) => {
  try {
    const keywordParam = franchiseKeywords.join('|');
    const url = buildApiUrl('/discover/movie', `&with_keywords=${keywordParam}&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'movie');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching franchise content:`, error);
    return [];
  }
};

// Keywords for popular franchises
export const FRANCHISE_KEYWORDS = {
  STAR_WARS: [4367, 5382], // Star Wars keywords
  HARRY_POTTER: [3340, 10177], // Harry Potter keywords
  LORD_OF_THE_RINGS: [818, 4780], // Lord of the Rings keywords
  TOLKIEN: [818, 4780, 209714], // Tolkien universe keywords
  STUDIO_GHIBLI: [258104, 10090] // Studio Ghibli keywords
};

// Fetch indie films
export const fetchIndieFilms = async (page = 1, itemsPerPage = 50) => {
  try {
    // Using companies that typically produce indie films or low budget filter
    const url = buildApiUrl('/discover/movie', `&with_genres=18&vote_count.gte=100&vote_average.gte=7&page=${page}&sort_by=vote_average.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'movie');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching indie films:`, error);
    return [];
  }
};

// Fetch series with specific episode count (for short series)
export const fetchShortSeries = async (maxEpisodes = 6, page = 1, itemsPerPage = 50) => {
  try {
    // This is a limitation of the TMDB API, we can't filter by number of episodes
    // We'll use a popularity filter instead and handle filtering client-side
    const url = buildApiUrl('/discover/tv', `&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'tv');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching short series:`, error);
    return [];
  }
};

// Fetch Brazilian content
export const fetchBrazilianContent = async (mediaType: 'movie' | 'tv' = 'movie', page = 1, itemsPerPage = 50) => {
  try {
    const url = buildApiUrl(`/discover/${mediaType}`, `&with_origin_country=BR&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, mediaType);
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching Brazilian ${mediaType} content:`, error);
    return [];
  }
};

// Fetch LGBTQIA+ themed content
export const fetchLGBTQContent = async (page = 1, itemsPerPage = 50) => {
  try {
    // Using keywords related to LGBTQ topics
    const lgbtKeywords = [158714, 158718, 158712, 192218, 190707]; // LGBTQ related keywords
    const keywordParam = lgbtKeywords.join('|');
    const url = buildApiUrl('/discover/movie', `&with_keywords=${keywordParam}&page=${page}&sort_by=popularity.desc&language=pt-BR`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const contentWithType = addMediaTypeToResults(data.results, 'movie');
    return limitResults(contentWithType, itemsPerPage);
  } catch (error) {
    console.error(`Error fetching LGBTQIA+ content:`, error);
    return [];
  }
};
