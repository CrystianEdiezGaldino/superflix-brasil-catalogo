import { MediaItem } from "@/types/movie";

export const formatMovieData = (movie: any): MediaItem => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    media_type: "movie",
    genre_ids: movie.genre_ids || [],
  };
}; 