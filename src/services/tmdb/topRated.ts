import { Movie, Series } from "@/types/movie";
import { TMDB_API_KEY, TMDB_API_URL } from "@/config/tmdb";

export const fetchTopRated = async (): Promise<(Movie | Series)[]> => {
  try {
    const [moviesResponse, seriesResponse] = await Promise.all([
      fetch(`${TMDB_API_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR`),
      fetch(`${TMDB_API_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR`)
    ]);

    const [moviesData, seriesData] = await Promise.all([
      moviesResponse.json(),
      seriesResponse.json()
    ]);

    return [...moviesData.results, ...seriesData.results];
  } catch (error) {
    console.error("Erro ao buscar mais bem avaliados:", error);
    return [];
  }
}; 