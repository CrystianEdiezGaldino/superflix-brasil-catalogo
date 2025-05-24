import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

export async function fetchDCMovies(limit: number = 50): Promise<MediaItem[]> {
  try {
    // Busca filmes da DC por palavra-chave
    const keywordUrl = buildApiUrl('/discover/movie', `&with_keywords=9715&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR`);

    // Busca filmes da DC por empresa
    const companyUrl = buildApiUrl('/discover/movie', `&with_companies=174&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR`);

    // Busca filmes da DC por gênero de super-herói
    const genreUrl = buildApiUrl('/discover/movie', `&with_genres=878&with_keywords=9715&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR`);

    // Busca filmes da DC por título
    const searchUrl = buildApiUrl('/search/movie', `&query=DC%20Comics&language=pt-BR&include_adult=false`);

    // Busca filmes específicos do Batman
    const batmanUrl = buildApiUrl('/search/movie', `&query=Batman&language=pt-BR&include_adult=false`);

    // Busca filmes específicos do Superman
    const supermanUrl = buildApiUrl('/search/movie', `&query=Superman&language=pt-BR&include_adult=false`);

    // Busca filmes específicos da Mulher-Maravilha
    const wonderWomanUrl = buildApiUrl('/search/movie', `&query=Wonder%20Woman&language=pt-BR&include_adult=false`);

    const [
      keywordResponse, 
      companyResponse, 
      genreResponse, 
      searchResponse,
      batmanResponse,
      supermanResponse,
      wonderWomanResponse
    ] = await Promise.all([
      fetchFromApi<{results?: any[]}>(keywordUrl),
      fetchFromApi<{results?: any[]}>(companyUrl),
      fetchFromApi<{results?: any[]}>(genreUrl),
      fetchFromApi<{results?: any[]}>(searchUrl),
      fetchFromApi<{results?: any[]}>(batmanUrl),
      fetchFromApi<{results?: any[]}>(supermanUrl),
      fetchFromApi<{results?: any[]}>(wonderWomanUrl)
    ]);

    // Combina os resultados
    const allMovies = [
      ...(keywordResponse.results || []),
      ...(companyResponse.results || []),
      ...(genreResponse.results || []),
      ...(searchResponse.results || []),
      ...(batmanResponse.results || []),
      ...(supermanResponse.results || []),
      ...(wonderWomanResponse.results || [])
    ];

    // Remove duplicatas
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    // Filtra apenas filmes com poster
    const moviesWithPoster = uniqueMovies.filter(movie => movie.poster_path);

    // Filtra apenas filmes da DC (verificando o título e descrição)
    const dcMovies = moviesWithPoster.filter(movie => {
      const title = movie.title?.toLowerCase() || '';
      const overview = movie.overview?.toLowerCase() || '';
      return (
        title.includes('dc') ||
        title.includes('batman') ||
        title.includes('superman') ||
        title.includes('wonder woman') ||
        title.includes('aquaman') ||
        title.includes('flash') ||
        title.includes('justice league') ||
        title.includes('shazam') ||
        title.includes('black adam') ||
        title.includes('joker') ||
        title.includes('suicide squad') ||
        title.includes('birds of prey') ||
        title.includes('peacemaker') ||
        title.includes('the batman') ||
        title.includes('the flash') ||
        title.includes('blue beetle') ||
        overview.includes('dc comics') ||
        overview.includes('dc universe') ||
        overview.includes('warner bros') ||
        overview.includes('warner brothers')
      );
    });

    // Adiciona o tipo de mídia
    const moviesWithType = addMediaTypeToResults(dcMovies, 'movie');

    // Ordena por popularidade
    const sortedMovies = moviesWithType.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedMovies, limit);
  } catch (error) {
    console.error('Erro ao buscar filmes da DC:', error);
    return [];
  }
} 