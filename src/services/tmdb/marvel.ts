import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Buscar filmes da Marvel
export const fetchMarvelMovies = async (limit = 30): Promise<MediaItem[]> => {
  try {
    // Buscar filmes populares da Marvel
    const popularUrl = buildApiUrl("/discover/movie", "&with_companies=420&sort_by=popularity.desc");
    const popularMovies = await fetchFromApi<{results?: any[]}>(popularUrl);
    
    // Buscar filmes bem avaliados da Marvel
    const topRatedUrl = buildApiUrl("/discover/movie", "&with_companies=420&sort_by=vote_average.desc&vote_count.gte=1000");
    const topRatedMovies = await fetchFromApi<{results?: any[]}>(topRatedUrl);
    
    // Combinar e remover duplicatas
    const allMovies = [...(popularMovies.results || []), ...(topRatedMovies.results || [])];
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );
    
    // Filtrar apenas filmes com poster
    const filteredMovies = uniqueMovies.filter(movie => movie.poster_path);
    
    // Adicionar tipo de mídia e limitar resultados
    const moviesWithType = addMediaTypeToResults(filteredMovies, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error("Erro ao buscar filmes da Marvel:", error);
    return [];
  }
}; 