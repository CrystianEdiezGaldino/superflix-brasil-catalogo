import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Palavras-chave e títulos das trilogias
const TRILOGY_KEYWORDS = {
  STAR_WARS: {
    keyword: 'Star Wars',
    keywordId: '180547'
  },
  HARRY_POTTER: {
    keyword: 'Harry Potter',
    keywordId: '9715'
  },
  LORD_OF_THE_RINGS: {
    keyword: 'The Lord of the Rings',
    keywordId: '180547'
  },
  MATRIX: {
    keyword: 'The Matrix',
    keywordId: '180547'
  },
  PIRATES: {
    keyword: 'Pirates of the Caribbean',
    keywordId: '180547'
  },
  HUNGER_GAMES: {
    keyword: 'The Hunger Games',
    keywordId: '180547'
  },
  TWILIGHT: {
    keyword: 'Twilight',
    keywordId: '180547'
  },
  JURASSIC_PARK: {
    keyword: 'Jurassic Park',
    keywordId: '180547'
  },
  BACK_TO_FUTURE: {
    keyword: 'Back to the Future',
    keywordId: '180547'
  },
  TOY_STORY: {
    keyword: 'Toy Story',
    keywordId: '180547'
  }
};

export async function fetchTrilogies(limit: number = 30): Promise<MediaItem[]> {
  try {
    const allMovies: MediaItem[] = [];

    // Busca filmes de cada trilogia
    for (const [name, { keyword, keywordId }] of Object.entries(TRILOGY_KEYWORDS)) {
      try {
        // Busca por palavra-chave
        const keywordUrl = buildApiUrl('/discover/movie', `&with_keywords=${keywordId}&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=pt-BR`);

        // Busca por título
        const searchUrl = buildApiUrl('/search/movie', `&query=${encodeURIComponent(keyword)}&language=pt-BR&include_adult=false`);

        const [keywordResponse, searchResponse] = await Promise.all([
          fetchFromApi<{results: any[]}>(keywordUrl),
          fetchFromApi<{results: any[]}>(searchUrl)
        ]);

        if (keywordResponse.results) {
          const moviesWithType = addMediaTypeToResults(keywordResponse.results, 'movie')
            .map(movie => ({
              ...movie,
              trilogy_name: name,
              media_type: 'movie'
            }));
          allMovies.push(...moviesWithType);
        }

        if (searchResponse.results) {
          const moviesWithType = addMediaTypeToResults(searchResponse.results, 'movie')
            .map(movie => ({
              ...movie,
              trilogy_name: name,
              media_type: 'movie'
            }));
          allMovies.push(...moviesWithType);
        }
      } catch (error) {
        console.error(`Erro ao buscar trilogia ${name}:`, error);
        continue;
      }
    }

    // Remove duplicatas
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    // Filtra apenas filmes com poster
    const moviesWithPoster = uniqueMovies.filter(movie => movie.poster_path);

    // Filtra apenas filmes que fazem parte de trilogias conhecidas
    const trilogyMovies = moviesWithPoster.filter(movie => {
      const title = movie.title?.toLowerCase() || '';
      const overview = movie.overview?.toLowerCase() || '';
      return (
        title.includes('star wars') ||
        title.includes('harry potter') ||
        title.includes('lord of the rings') ||
        title.includes('matrix') ||
        title.includes('pirates of the caribbean') ||
        title.includes('hunger games') ||
        title.includes('twilight') ||
        title.includes('jurassic park') ||
        title.includes('back to the future') ||
        title.includes('toy story') ||
        overview.includes('star wars') ||
        overview.includes('harry potter') ||
        overview.includes('lord of the rings') ||
        overview.includes('matrix') ||
        overview.includes('pirates of the caribbean') ||
        overview.includes('hunger games') ||
        overview.includes('twilight') ||
        overview.includes('jurassic park') ||
        overview.includes('back to the future') ||
        overview.includes('toy story')
      );
    });

    // Ordena por popularidade
    const sortedMovies = trilogyMovies.sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );

    // Limita o número de resultados
    return limitResults(sortedMovies, limit);
  } catch (error) {
    console.error('Erro ao buscar trilogias:', error);
    return [];
  }
}