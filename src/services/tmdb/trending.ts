import { Movie, Series } from "@/types/movie";
import { TMDB_API_KEY, TMDB_API_URL } from "@/config/tmdb";

export const fetchTrending = async (): Promise<(Movie | Series)[]> => {
  try {
    const [moviesResponse, seriesResponse] = await Promise.all([
      fetch(`${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=pt-BR`),
      fetch(`${TMDB_API_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=pt-BR`)
    ]);

    const [moviesData, seriesData] = await Promise.all([
      moviesResponse.json(),
      seriesResponse.json()
    ]);

    const movies = moviesData.results.map((movie: any) => ({
      ...movie,
      media_type: 'movie'
    }));

    const series = seriesData.results.map((serie: any) => ({
      ...serie,
      media_type: 'tv'
    }));

    return [...movies, ...series];
  } catch (error) {
    console.error("Erro ao buscar tendências:", error);
    return [];
  }
}; 