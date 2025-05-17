
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

// Default parameters
export const DEFAULT_PARAMS = {
  language: DEFAULT_LANGUAGE,
  region: DEFAULT_REGION,
  include_adult: false,
};
