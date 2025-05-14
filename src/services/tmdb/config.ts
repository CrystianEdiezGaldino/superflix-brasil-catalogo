
// TMDB API Configuration
export const API_KEY = "8c247ea0b4b56ed2ff7d41c9a833aa77";
export const BASE_URL = "https://api.themoviedb.org/3";
export const DEFAULT_LANGUAGE = "pt-BR";
export const DEFAULT_REGION = "BR";

// Image URLs
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original"
};
export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original"
};
export const PROFILE_SIZES = {
  small: "w45",
  medium: "w185",
  large: "h632",
  original: "original"
};

// Helper function for image URLs
export const getImageUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}${size}${path}`;
};

// Superflix API Configuration - Use this for video players
export const SUPERFLIX_API_BASE = "https://superflixapi.fyi";

// API endpoints
export const ENDPOINTS = {
  trending: "/trending/all/week",
  popularMovies: "/movie/popular",
  topRatedMovies: "/movie/top_rated",
  upcomingMovies: "/movie/upcoming",
  movieDetails: "/movie/",
  popularSeries: "/tv/popular",
  topRatedSeries: "/tv/top_rated",
  seriesDetails: "/tv/",
  search: "/search/multi",
};

export default {
  API_KEY,
  BASE_URL,
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  IMAGE_BASE_URL,
  POSTER_SIZES,
  BACKDROP_SIZES,
  PROFILE_SIZES,
  getImageUrl,
  ENDPOINTS,
  SUPERFLIX_API_BASE
};
