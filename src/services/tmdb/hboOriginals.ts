import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults } from "./utils";
import { HBO_ORIGINALS } from "@/data/hboOriginals";

export async function fetchHBOOriginals(limit: number = 50): Promise<MediaItem[]> {
  try {
    // Remove duplicates from movies and series
    const uniqueMovies = Array.from(new Map(HBO_ORIGINALS.movies.map(movie => [movie.id, movie])).values());
    const uniqueSeries = Array.from(new Map(HBO_ORIGINALS.series.map(series => [series.id, series])).values());

    const results = await Promise.all([
      // Busca detalhes dos filmes
      ...uniqueMovies.map(movie =>
        fetchFromApi<MediaItem>(buildApiUrl(`/movie/${movie.id}`, '?language=pt-BR'))
          .then(data => ({ ...data, media_type: 'movie' }))
          .catch(() => null)
      ),
      
      // Busca detalhes das séries
      ...uniqueSeries.map(series =>
        fetchFromApi<MediaItem>(buildApiUrl(`/tv/${series.id}`, '?language=pt-BR'))
          .then(data => ({ ...data, media_type: 'tv' }))
          .catch(() => null)
      )
    ]);

    // Filtra resultados nulos e adiciona tipo de mídia
    const validResults = results
      .filter(Boolean)
      .map(item => addMediaTypeToResults([item], item.media_type)[0]);

    // Ordena por popularidade
    const sortedResults = validResults.sort((a, b) => 
      (b?.popularity || 0) - (a?.popularity || 0)
    );

    // Filtra apenas itens com poster
    const resultsWithPoster = sortedResults.filter(item => item?.poster_path);

    // Limita o número de resultados
    return resultsWithPoster.slice(0, limit);
  } catch (error) {
    console.error('Error fetching HBO Max originals:', error);
    return [];
  }
} 