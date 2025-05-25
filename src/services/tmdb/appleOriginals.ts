
import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults } from "./utils";
import { APPLE_ORIGINALS } from "@/data/appleOriginals";

export async function fetchAppleOriginals(limit: number = 50): Promise<MediaItem[]> {
  try {
    // Buscar conteúdo da Apple TV+ usando a API do TMDB
    const [moviesResponse, seriesResponse] = await Promise.all([
      // Buscar filmes da Apple TV+ usando watch providers
      fetchFromApi<any>(buildApiUrl('/discover/movie', 
        '?language=pt-BR&with_watch_providers=350&watch_region=US&sort_by=popularity.desc')),
      // Buscar séries da Apple TV+ usando watch providers
      fetchFromApi<any>(buildApiUrl('/discover/tv', 
        '?language=pt-BR&with_watch_providers=350&watch_region=US&sort_by=popularity.desc'))
    ]);

    const movieResults = moviesResponse.results || [];
    const seriesResults = seriesResponse.results || [];

    // Combinar resultados e adicionar tipo de mídia
    const allResults = [
      ...addMediaTypeToResults(movieResults, 'movie'),
      ...addMediaTypeToResults(seriesResults, 'tv')
    ];

    // Buscar também conteúdo dos IDs conhecidos da Apple TV+
    const knownAppleContent = await Promise.all([
      // Buscar detalhes dos filmes conhecidos
      ...APPLE_ORIGINALS.movies.map(movie =>
        fetchFromApi<MediaItem>(buildApiUrl(`/movie/${movie.id}`, '?language=pt-BR'))
          .then(data => ({ ...data, media_type: 'movie' }))
          .catch(() => null)
      ),
      
      // Buscar detalhes das séries conhecidas  
      ...APPLE_ORIGINALS.series.map(series =>
        fetchFromApi<MediaItem>(buildApiUrl(`/tv/${series.id}`, '?language=pt-BR'))
          .then(data => ({ ...data, media_type: 'tv' }))
          .catch(() => null)
      )
    ]);

    // Filtrar resultados nulos e combinar com descoberta da API
    const validKnownContent = knownAppleContent.filter(Boolean);
    
    // Combinar e remover duplicatas
    const combinedResults = [...allResults, ...validKnownContent];
    const uniqueResults = Array.from(
      new Map(combinedResults.map(item => [`${item.media_type}-${item.id}`, item])).values()
    );

    // Filtrar apenas conteúdo com poster e ordenar por popularidade
    const resultsWithPoster = uniqueResults
      .filter(item => item?.poster_path)
      .sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));

    // Limitar o número de resultados
    return resultsWithPoster.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Apple TV+ originals:', error);
    
    // Fallback: tentar buscar apenas dos IDs conhecidos
    try {
      const fallbackResults = await Promise.all([
        ...APPLE_ORIGINALS.movies.slice(0, 5).map(movie =>
          fetchFromApi<MediaItem>(buildApiUrl(`/movie/${movie.id}`, '?language=pt-BR'))
            .then(data => ({ ...data, media_type: 'movie' }))
            .catch(() => null)
        ),
        ...APPLE_ORIGINALS.series.slice(0, 5).map(series =>
          fetchFromApi<MediaItem>(buildApiUrl(`/tv/${series.id}`, '?language=pt-BR'))
            .then(data => ({ ...data, media_type: 'tv' }))
            .catch(() => null)
        )
      ]);
      
      return fallbackResults.filter(Boolean).slice(0, limit);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return [];
    }
  }
}
