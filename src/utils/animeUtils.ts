
import { MediaItem } from "@/types/movie";

/**
 * Validates if an anime object has the required properties
 */
export const isValidAnime = (anime: any): boolean => {
  return (
    anime &&
    anime.id &&
    (anime.poster_path || anime.backdrop_path) &&
    (anime.title || anime.name) &&
    anime.overview 
  );
};

/**
 * Checks if content is adult based on genres and keywords
 */
export const isAdultContent = (anime: MediaItem): boolean => {
  const adultGenres = ['hentai', 'ecchi', 'adult'];
  // Safe access to name/title
  const animeTitle = anime.title || anime.name || '';
  const overview = (anime.overview || '').toLowerCase();

  // Safe access to adult property with optional chaining
  return (anime.adult === true) ||
         (anime.genres?.some(genre => 
           adultGenres.some(ag => genre.name.toLowerCase().includes(ag))) || false) ||
         adultGenres.some(ag => animeTitle.toLowerCase().includes(ag) || overview.includes(ag));
};

/**
 * Organize animes into categorized sections
 */
export const organizeSections = (animes: MediaItem[]) => {
  if (!animes || !Array.isArray(animes)) {
    console.error("Invalid animes data for organizing sections:", animes);
    return {
      featured: [],
      trending: [],
      topRated: [],
      recent: [],
      adult: []
    };
  }
  
  // Separate adult content
  const regularAnimes = animes.filter(anime => !isAdultContent(anime));
  const adultAnimes = animes.filter(anime => isAdultContent(anime));
  
  // Featured animes (high popularity and rating)
  const featuredAnimes = regularAnimes
    .filter(anime => anime.vote_average >= 7.5 && (anime.popularity || 0) > 50)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6);
  
  // Trending (by popularity)
  const trendingAnimes = regularAnimes
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);
  
  // Top rated
  const topRatedAnimes = regularAnimes
    .filter(anime => anime.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 30);
  
  // Recent releases
  const recentAnimes = regularAnimes
    .filter(anime => anime.first_air_date || anime.release_date)
    .sort((a, b) => {
      const dateA = new Date(a.first_air_date || a.release_date || "");
      const dateB = new Date(b.first_air_date || b.release_date || "");
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10);

  return {
    featured: featuredAnimes,
    trending: trendingAnimes,
    topRated: topRatedAnimes,
    recent: recentAnimes,
    adult: adultAnimes
  };
};
