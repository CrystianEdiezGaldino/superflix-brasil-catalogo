import { Series, Movie, MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Lista expandida de IDs de doramas e filmes coreanos populares com nomes em português
const POPULAR_DORAMA_IDS = [
  129478, // Squid Game (Round 6)
  93405,  // Vincenzo
  93740,  // It's Okay to Not Be Okay (Tudo Bem Não Ser Normal)
  94796,  // Sweet Home
  84858,  // Crash Landing on You (Pousando no Amor)
  114860, // My Name (Meu Nome)
  104877, // Love Alarm (Alarme do Amor)
  70844,  // Goblin (Dokkaebi/Goblin: O Solitário e a Grande Deusa)
  74758,  // Something in the Rain (Algo no Ar)
  86706,  // Kingdom
  79242,  // What's Wrong with Secretary Kim (O Que Há de Errado com a Secretária Kim)
  81356,  // One Spring Night (Em Uma Noite de Primavera)
  67915,  // Descendants of the Sun (Descendentes do Sol)
  84553,  // Vagabond
  94892,  // Start-Up (A Start-Up)
  96162,  // True Beauty (Beleza Verdadeira)
  101752, // Hospital Playlist (Playlist do Hospital)
  68612,  // Reply 1988 (Responda 1988)
  62560,  // Boys Over Flowers (Os Garotos São Melhores que as Flores)
  86328,  // Hotel Del Luna (Hotel da Lua)
  85020,  // The King: Eternal Monarch (O Rei: Monarca Eterno)
  61041,  // My Love from the Star (Vindo de Outro Planeta)
  67193,  // Healer
  77169,  // Strong Woman Do Bong Soon (Mulher Forte Bong-soon)
  81227,  // When the Camellia Blooms (Quando a Camélia Floresce)
  93831,  // The World of the Married (O Mundo dos Casados)
  72879,  // Oh My Ghost (Oh Meu Fantasma)
  71570,  // Prison Playbook (Manual de Sobrevivência na Prisão)
  61904,  // My Girlfriend Is a Gumiho (Minha Namorada é uma Gumiho)
  100957, // Itaewon Class (Aula Itaewon)
  109840, // Gyeongseong Creature (Criatura de Gyeongseong)
  135157, // Alchemy of Souls (Alquimia das Almas)
  214681, // Extraordinary Attorney Woo (Advogada Extraordinária Woo)
  197067, // Business Proposal (Proposta de Negócio)
  117376, // Our Beloved Summer (Nosso Querido Verão)
  154396, // Pachinko
  99966,  // All of Us Are Dead (Estamos Mortos)
  110316, // Forecasting Love and Weather (Previsão do Amor e Tempo)
  118215, // Twenty Five Twenty One (Vinte e Cinco, Vinte e Um)
  121423, // Thirty-Nine (Trinta e Nove)
  60735,  // The Heirs (Os Herdeiros)
  83869,  // Touch Your Heart (Toque Seu Coração)
  87827,  // Her Private Life (Sua Vida Privada)
  90447,  // The King's Affection (O Afeto do Rei)
  127924, // Little Women (Pequenas Mulheres)
  96391,  // Run On (Corre)
  70074,  // Moon Lovers: Scarlet Heart Ryeo (Amantes da Lua: Scarlet Heart Ryeo)
  60948,  // The Legend of the Blue Sea (A Lenda do Mar Azul)
  112888, // Sisyphus: The Myth (Sísifo: O Mito)
  158008, // Mask Girl (Garota da Máscara)
  111323, // Squid Game 2 (Round 6: Segunda Temporada)
  95483,  // Hometown Cha-Cha-Cha (Hometown Cha-Cha-Cha)
  84393,  // Mr. Sunshine (Sr. Sol)
  96256,  // Tale of the Nine-Tailed (Conto dos Nove Caudas)
  137235, // Move to Heaven (Movendo-se para o Céu)
  130392, // Vincenzo 2
  106452, // The Silent Sea (O Mar Silencioso)
  128294, // Juvenile Justice (Justiça Juvenil)
  217744, // The Glory (A Glória)
  211496, // D.P. (Desertores)
  204095, // Love and Leashes (Amor e Coleiras)
  155125, // Hellbound (Rumo ao Inferno)
  216495, // Queenmaker (Rainha do Escândalo)
  154282, // 365: Repeat the Year (365: Repita o Ano)
  199148, // The Fabulous (Os Fabulosos)
  116887, // Snowdrop (Flor de Neve)
  80506,  // Memories of the Alhambra (Memórias de Alhambra)
  134253, // Navillera (Navillera: Como Uma Borboleta)
  136282, // Mad for Each Other (Loucos um pelo Outro)
  213187, // Moving (Em Movimento)
  210206, // Café Minamdang (Café Minamdang)
  194272, // Tomorrow (Amanhã)
  85857,  // Encounter (Encontro)
  205486, // Reborn Rich (Renascido Rico)
  96724,  // Law School (Escola de Direito)
  212772, // Queen Woo (Rainha Woo)
  115327, // Beyond Evil (Além do Mal)
  196221, // Big Mouth (Boca Grande)
  172594, // Broker (O Corruptor)
  146399, // Semantic Error (Erro Semântico)
  84866,  // Signal (Sinal)
  205973, // Soundtrack #1 (Trilha Sonora #1)
  119243, // Wedding Veil (Véu de Noiva)
  231493, // The Uncanny Counter 2 (O Incrível Contador 2)
  152158, // D.P. 2 (Desertores 2)
  167556, // The Sound of Magic (O Som da Magia)
  154424, // It's Okay to Not Be Okay 2 (Tudo Bem Não Ser Normal 2)
  155476, // Taxi Driver (Motorista de Táxi)
  202558, // Physical: 100 (Físico: 100)
];

// Lista de IDs de filmes coreanos populares
const KOREAN_MOVIES_IDS = [
  496243, // Parasita
  615457, // Train to Busan (Invasão Zumbi)
  661914, // A Criada
  493922, // O Hospedeiro
  354912, // Oldboy
  661374, // Space Sweepers (Limpadores Espaciais)
  496274, // A Vilã
  422866, // O Chamado da Floresta
  703771, // Okja
  502425, // O Gangster, o Policial e o Diabo
  622855, // Memórias de Assassino
  420809, // Trem Para Busan 2: Península
  326,    // Oldboy
  635302, // Velozes e Furiosos: Hobbs & Shaw (parceria com Coreia)
  399055, // O Limite da Traição
  654028, // #Alive (#Vivo)
  527641, // Exit (Saída)
  590223, // Burning (Em Chamas)
  619264, // Along with the Gods: The Two Worlds (Junto com os Deuses: Os Dois Mundos)
  581647, // Extreme Job (Trabalho Extremo)
  448204, // The Wailing (Lamentação)
];

// Mesclar as listas para ter tanto doramas quanto filmes coreanos
const ALL_KOREAN_CONTENT_IDS = [...POPULAR_DORAMA_IDS, ...KOREAN_MOVIES_IDS];

// Fetch Korean doramas by specific IDs (popular ones)
export const fetchPopularDoramas = async (limit = 12) => {
  try {
    // Use a subset of IDs for popular doramas
    const popularIds = POPULAR_DORAMA_IDS.slice(0, limit);
    const promises = popularIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => {
          if (drama && drama.id) {
            return {...drama, media_type: "tv" as const};
          }
          return null;
        })
        .catch(error => {
          console.error(`Error fetching dorama with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(drama => drama && drama.id && (drama.poster_path || drama.backdrop_path)) as Series[];
  } catch (error) {
    console.error("Error fetching popular doramas:", error);
    return [];
  }
};

// Fetch top rated Korean doramas
export const fetchTopRatedDoramas = async (limit = 12) => {
  try {
    // Use the first few IDs from the popular list, representing top rated ones
    const topRatedIds = POPULAR_DORAMA_IDS.slice(10, 10 + limit);
    const promises = topRatedIds.map(id => 
      fetchFromApi<Series>(`${buildApiUrl(`/tv/${id}`)}`)
        .then(drama => {
          if (drama && drama.id) {
            return {...drama, media_type: "tv" as const};
          }
          return null;
        })
        .catch(error => {
          console.error(`Error fetching dorama with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(drama => drama && drama.id && (drama.poster_path || drama.backdrop_path)) as Series[];
  } catch (error) {
    console.error("Error fetching top rated doramas:", error);
    return [];
  }
};

// Fetch Korean movies
export const fetchKoreanMovies = async (limit = 12) => {
  try {
    const movieIds = KOREAN_MOVIES_IDS.slice(0, limit);
    const promises = movieIds.map(id => 
      fetchFromApi<Movie>(`${buildApiUrl(`/movie/${id}`)}`)
        .then(movie => {
          if (movie && movie.id) {
            return {...movie, media_type: "movie" as const};
          }
          return null;
        })
        .catch(error => {
          console.error(`Error fetching Korean movie with ID ${id}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(movie => movie && movie.id && (movie.poster_path || movie.backdrop_path)) as Movie[];
  } catch (error) {
    console.error("Error fetching Korean movies:", error);
    return [];
  }
};

// Generic function to fetch Korean doramas and movies
export const fetchKoreanDramas = async (page = 1, limit = 30) => {
  try {
    // Calcular o índice inicial e final com base na página e limite
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Garantir que não ultrapassamos o número de conteúdos disponíveis
    const pageIds = ALL_KOREAN_CONTENT_IDS.slice(startIndex, endIndex);
    
    if (pageIds.length === 0) {
      return [];
    }
    
    const promises = pageIds.map(async id => {
      // Determinar se é um dorama (TV) ou filme com base na presença na lista de filmes
      const isMovie = KOREAN_MOVIES_IDS.includes(id);
      const endpoint = isMovie ? `/movie/${id}` : `/tv/${id}`;
      
      return fetchFromApi(`${buildApiUrl(endpoint)}`)
        .then(content => {
          if (!content) return null;
          
          if (isMovie) {
            return {...content, media_type: "movie" as const};
          } else {
            return {...content, media_type: "tv" as const};
          }
        })
        .catch(error => {
          console.error(`Error fetching content with ID ${id}:`, error);
          return null;
        });
    });
    
    const results = await Promise.all(promises);
    // Filter out any null results from failed requests
    return results.filter(content => content && content.id && (content.poster_path || content.backdrop_path)) as MediaItem[];
  } catch (error) {
    console.error("Error fetching Korean content:", error);
    return [];
  }
};

// Fetch dorama details
export const fetchDoramaDetails = async (id: string): Promise<Series> => {
  try {
    const url = buildApiUrl(`/tv/${id}`, "&append_to_response=credits,similar,videos,external_ids");
    return await fetchFromApi<Series>(url);
  } catch (error) {
    console.error("Error fetching dorama details:", error);
    return {} as Series;
  }
};

// Fetch similar doramas
export const fetchSimilarDoramas = async (id: string, limit = 6): Promise<Series[]> => {
  try {
    const url = buildApiUrl(`/tv/${id}/similar`);
    const data = await fetchFromApi<{results: Series[]}>(url);
    const results = data.results?.map(item => ({
      ...item,
      media_type: "tv" as const
    })) || [];
    
    return limitResults(results, limit);
  } catch (error) {
    console.error("Error fetching similar doramas:", error);
    return [];
  }
};

// Fetch cast for a dorama
export const fetchDoramaCast = async (id: string, limit = 10) => {
  try {
    const url = buildApiUrl(`/tv/${id}/credits`);
    const data = await fetchFromApi<{cast?: any[]}>(url);
    return (data.cast || []).slice(0, limit);
  } catch (error) {
    console.error("Error fetching dorama cast:", error);
    return [];
  }
};

// Função para buscar doramas por gênero
export const fetchDoramasByGenre = async (genreId: number, limit = 20) => {
  try {
    const url = buildApiUrl("/discover/tv", `&with_genres=${genreId}&with_original_language=ko&sort_by=popularity.desc`);
    const data = await fetchFromApi<{results: Series[]}>(url);
    const results = data.results?.map(item => ({
      ...item,
      media_type: "tv" as const
    })) || [];
    
    return limitResults(results, limit);
  } catch (error) {
    console.error("Error fetching doramas by genre:", error);
    return [];
  }
};
