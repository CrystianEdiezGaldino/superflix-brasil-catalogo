import { Movie, MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";
import { TMDB_API_KEY, TMDB_API_URL } from "@/config/tmdb";
import { formatMovieData } from "@/utils/movieUtils";

// Fetch popular movies
export const fetchPopularMovies = async (page = 1): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
    );
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error("Erro ao buscar filmes populares:", error);
    return [];
  }
};

// Fetch top rated movies
export const fetchTopRatedMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error("Erro ao buscar filmes mais bem avaliados:", error);
    return [];
  }
};

// Fetch trending movies of the week
export const fetchTrendingMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error("Erro ao buscar filmes em tendência:", error);
    return [];
  }
};

// Fetch recent movies released in the last 5 years
export const fetchRecentMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    return data.results.map(formatMovieData);
  } catch (error) {
    console.error("Erro ao buscar filmes recentes:", error);
    return [];
  }
};

// Fetch movies by genre ID
export const fetchMoviesByGenre = async (genreId: number, limit = 15) => {
  try {
    const url = buildApiUrl("/discover/movie", `&with_genres=${genreId}&sort_by=popularity.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};

// Fetch movies by keyword ID
export const fetchMoviesByKeyword = async (keywordId: number, limit = 15) => {
  try {
    const url = buildApiUrl("/discover/movie", `&with_keywords=${keywordId}&sort_by=popularity.desc`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    
    if (!data || !Array.isArray(data.results)) {
      console.error("Invalid response format:", data);
      return [];
    }
    
    const moviesWithType = addMediaTypeToResults(data.results, "movie");
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error(`Error fetching movies for keyword ${keywordId}:`, error);
    return [];
  }
};

// Fetch movie details
export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  try {
    const url = buildApiUrl(`/movie/${id}`);
    return await fetchFromApi<Movie>(url);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {} as Movie;
  }
};

// Fetch movies by category
export const fetchMoviesByCategory = async (category: string, page = 1) => {
  try {
    let url = "";
    
    switch (category) {
      case "lancamentos":
        const currentYear = new Date().getFullYear();
        url = buildApiUrl("/discover/movie", `&primary_release_year=${currentYear}&sort_by=release_date.desc&page=${page}`);
        break;
      case "acao":
        url = buildApiUrl("/discover/movie", `&with_genres=28&sort_by=popularity.desc&page=${page}`);
        break;
      case "comedia":
        url = buildApiUrl("/discover/movie", `&with_genres=35&sort_by=popularity.desc&page=${page}`);
        break;
      case "drama":
        url = buildApiUrl("/discover/movie", `&with_genres=18&sort_by=popularity.desc&page=${page}`);
        break;
      case "terror":
        url = buildApiUrl("/discover/movie", `&with_genres=27&sort_by=popularity.desc&page=${page}`);
        break;
      case "romance":
        url = buildApiUrl("/discover/movie", `&with_genres=10749&sort_by=popularity.desc&page=${page}`);
        break;
      case "aventura":
        url = buildApiUrl("/discover/movie", `&with_genres=12&sort_by=popularity.desc&page=${page}`);
        break;
      case "animacao":
        url = buildApiUrl("/discover/movie", `&with_genres=16&sort_by=popularity.desc&page=${page}`);
        break;
      case "documentario":
        url = buildApiUrl("/discover/movie", `&with_genres=99&sort_by=popularity.desc&page=${page}`);
        break;
      case "ficcao":
        url = buildApiUrl("/discover/movie", `&with_genres=878&sort_by=popularity.desc&page=${page}`);
        break;
      case "fantasia":
        url = buildApiUrl("/discover/movie", `&with_genres=14&sort_by=popularity.desc&page=${page}`);
        break;
      case "suspense":
        url = buildApiUrl("/discover/movie", `&with_genres=53&sort_by=popularity.desc&page=${page}`);
        break;
      case "biografia":
        url = buildApiUrl("/discover/movie", `&with_genres=36&sort_by=popularity.desc&page=${page}`);
        break;
      case "historia":
        url = buildApiUrl("/discover/movie", `&with_genres=36&sort_by=popularity.desc&page=${page}`);
        break;
      default:
        url = buildApiUrl("/movie/popular", `&page=${page}`);
    }

    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results, "movie");
  } catch (error) {
    console.error(`Error fetching movies for category ${category}:`, error);
    return [];
  }
};

// Search movies
export const searchMovies = async (query: string, page = 1) => {
  try {
    const url = buildApiUrl("/search/movie", `&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await fetchFromApi<{results?: any[]}>(url);
    return addMediaTypeToResults(data.results, "movie");
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

// Buscar filmes de ação
export const fetchActionMovies = async (limit: number = 30): Promise<MediaItem[]> => {
  try {
    // Busca filmes de ação populares
    const popularUrl = buildApiUrl('/discover/movie', '&with_genres=28&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const popularMovies = await fetchFromApi<{results: any[]}>(popularUrl);

    // Busca filmes de aventura populares
    const adventureUrl = buildApiUrl('/discover/movie', '&with_genres=12&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const adventureMovies = await fetchFromApi<{results: any[]}>(adventureUrl);

    // Combina os resultados
    const allMovies = [
      ...(popularMovies.results || []),
      ...(adventureMovies.results || [])
    ];

    // Remove duplicatas
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    // Filtra apenas filmes com poster
    const moviesWithPoster = uniqueMovies.filter(movie => movie.poster_path);

    // Adiciona o tipo de mídia
    const moviesWithType = addMediaTypeToResults(moviesWithPoster, 'movie');

    // Ordena por popularidade
    const sortedMovies = moviesWithType.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedMovies, limit);
  } catch (error) {
    console.error('Erro ao buscar filmes de ação:', error);
    return [];
  }
};

// Buscar filmes de comédia
export const fetchComedyMovies = async (limit: number = 30): Promise<MediaItem[]> => {
  try {
    // Busca filmes de comédia populares
    const popularUrl = buildApiUrl('/discover/movie', '&with_genres=35&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const popularMovies = await fetchFromApi<{results: any[]}>(popularUrl);

    // Busca filmes de comédia bem avaliados
    const topRatedUrl = buildApiUrl('/discover/movie', '&with_genres=35&sort_by=vote_average.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const topRatedMovies = await fetchFromApi<{results: any[]}>(topRatedUrl);

    // Combina os resultados
    const allMovies = [
      ...(popularMovies.results || []),
      ...(topRatedMovies.results || [])
    ];

    // Remove duplicatas
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    // Filtra apenas filmes com poster
    const moviesWithPoster = uniqueMovies.filter(movie => movie.poster_path);

    // Adiciona o tipo de mídia
    const moviesWithType = addMediaTypeToResults(moviesWithPoster, 'movie');

    // Ordena por popularidade
    const sortedMovies = moviesWithType.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedMovies, limit);
  } catch (error) {
    console.error('Erro ao buscar filmes de comédia:', error);
    return [];
  }
};

// Buscar filmes de terror
export const fetchHorrorMovies = async (limit: number = 30): Promise<MediaItem[]> => {
  try {
    // Busca filmes de terror populares
    const popularUrl = buildApiUrl('/discover/movie', '&with_genres=27&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const popularMovies = await fetchFromApi<{results: any[]}>(popularUrl);

    // Busca filmes de terror bem avaliados
    const topRatedUrl = buildApiUrl('/discover/movie', '&with_genres=27&sort_by=vote_average.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const topRatedMovies = await fetchFromApi<{results: any[]}>(topRatedUrl);

    // Combina os resultados
    const allMovies = [
      ...(popularMovies.results || []),
      ...(topRatedMovies.results || [])
    ];

    // Remove duplicatas
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    // Filtra apenas filmes com poster
    const moviesWithPoster = uniqueMovies.filter(movie => movie.poster_path);

    // Adiciona o tipo de mídia
    const moviesWithType = addMediaTypeToResults(moviesWithPoster, 'movie');

    // Ordena por popularidade
    const sortedMovies = moviesWithType.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedMovies, limit);
  } catch (error) {
    console.error('Erro ao buscar filmes de terror:', error);
    return [];
  }
};

// Buscar conteúdo popular no Brasil
export const fetchPopularInBrazil = async (limit: number = 30): Promise<MediaItem[]> => {
  try {
    // Buscar filmes familiares
    const familyUrl = buildApiUrl('/discover/movie', '&with_genres=10751&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const familyMovies = await fetchFromApi<{results: any[]}>(familyUrl);

    // Buscar animações
    const animationUrl = buildApiUrl('/discover/movie', '&with_genres=16&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const animationMovies = await fetchFromApi<{results: any[]}>(animationUrl);

    // Buscar séries familiares
    const familyTVUrl = buildApiUrl('/discover/tv', '&with_genres=10751&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const familyTV = await fetchFromApi<{results: any[]}>(familyTVUrl);

    // Buscar animações de TV
    const animationTVUrl = buildApiUrl('/discover/tv', '&with_genres=16&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR');
    const animationTV = await fetchFromApi<{results: any[]}>(animationTVUrl);

    // Combina os resultados
    const allContent = [
      ...(familyMovies.results || []),
      ...(animationMovies.results || []),
      ...(familyTV.results || []),
      ...(animationTV.results || [])
    ];

    // Remove duplicatas
    const uniqueContent = allContent.filter((item, index, self) =>
      index === self.findIndex((i) => i.id === item.id)
    );

    // Filtra apenas itens com poster
    const contentWithPoster = uniqueContent.filter(item => item.poster_path);

    // Adiciona o tipo de mídia
    const contentWithType = contentWithPoster.map(item => ({
      ...item,
      media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
    }));

    // Filtra conteúdo adulto
    const familyContent = contentWithType.filter(item => {
      // Verifica se tem classificação indicativa
      const rating = item.content_rating || item.rating || '';
      return !rating.includes('18') && !rating.includes('R');
    });

    // Ordena por popularidade
    const sortedContent = familyContent.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedContent, limit);
  } catch (error) {
    console.error('Erro ao buscar conteúdo popular no Brasil:', error);
    return [];
  }
};

// Buscar conteúdo de terror
export const fetchHorrorContent = async (limit: number = 30): Promise<MediaItem[]> => {
  try {
    // IDs de filmes e séries de terror
    const horrorIds = [
      // Filmes
      '346', // O Exorcista
      '694', // O Iluminado
      '424', // Psicose
      '1091', // O Massacre da Serra Elétrica
      '275', // O Silêncio dos Inocentes
      '843', // O Chamado
      '19995', // Avatar
      '299534', // Vingadores: Ultimato
      '299536', // Vingadores: Guerra Infinita
      '24428', // Os Vingadores
      // Séries
      '1402', // The Walking Dead
      '66732', // Stranger Things
      '44217', // American Horror Story
      '1416', // Grey's Anatomy
      '1396', // Breaking Bad
      '1418', // The Big Bang Theory
      '1399', // Game of Thrones
      '1100', // How I Met Your Mother
      '1668', // Friends
      '2316'  // The Office
    ];

    const allContent: MediaItem[] = [];

    // Busca cada item individualmente
    for (const id of horrorIds) {
      try {
        // Verifica se é um ID de filme ou série
        const isMovie = !id.startsWith('tt');
        const endpoint = isMovie ? `/movie/${id}` : `/tv/${id}`;
        const url = buildApiUrl(endpoint, '&language=pt-BR&append_to_response=videos,credits');
        
        const data = await fetchFromApi<any>(url);
        if (data && data.id) {
          allContent.push({
            ...data,
            media_type: isMovie ? 'movie' : 'tv'
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar item ${id}:`, error);
        continue;
      }
    }

    // Filtra apenas itens com poster
    const contentWithPoster = allContent.filter(item => item.poster_path);

    // Ordena por popularidade
    const sortedContent = contentWithPoster.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedContent, limit);
  } catch (error) {
    console.error('Erro ao buscar conteúdo de terror:', error);
    return [];
  }
};
