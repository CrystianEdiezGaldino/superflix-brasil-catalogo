import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Gêneros familiares e infantis
const FAMILY_GENRES = {
  ANIMATION: 16,
  FAMILY: 10751,
  ADVENTURE: 12,
  FANTASY: 14,
  COMEDY: 35
};

// Palavras-chave para conteúdo infantil e familiar
const FAMILY_KEYWORDS = {
  DISNEY: '420',
  PIXAR: '287501',
  DREAMWORKS: '287502',
  CHILDREN: '287503',
  FAMILY_FRIENDLY: '287504',
  CLASSIC: '287505',
  ANIMATION: '287506'
};

// IDs de coleções específicas de filmes clássicos
const CLASSIC_COLLECTIONS = {
  DISNEY_CLASSICS: '338',
  HANNA_BARBERA: '339',
  LOONEY_TUNES: '340',
  CLASSIC_ANIMATION: '341'
};

// Termos de busca para filmes clássicos
const CLASSIC_SEARCH_TERMS = [
  'pestinha',
  'riquinho rico',
  'casa monstro',
  'tom e jerry',
  'pica-pau',
  'popeye',
  'flintstones',
  'jetsons',
  'scooby doo',
  'smurfs',
  'he-man',
  'thundercats',
  'transformers',
  'g.i. joe',
  'ducktales',
  'chip e dale',
  'patolino',
  'pernalonga',
  'taz',
  'papa-léguas'
];

export async function fetchFamilyContent(limit: number = 50): Promise<MediaItem[]> {
  try {
    const results = await Promise.all([
      // Busca por gêneros familiares e animação
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_genres=${FAMILY_GENRES.FAMILY},${FAMILY_GENRES.ANIMATION}&sort_by=popularity.desc&language=pt-BR&region=BR&vote_count.gte=100&certification_country=BR&certification.lte=G`
      )).then(data => data?.results || []).catch(() => []),

      // Busca por filmes da Disney
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_keywords=${FAMILY_KEYWORDS.DISNEY}&sort_by=popularity.desc&language=pt-BR&region=BR&certification_country=BR&certification.lte=G`
      )).then(data => data?.results || []).catch(() => []),

      // Busca por filmes da Pixar
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_keywords=${FAMILY_KEYWORDS.PIXAR}&sort_by=popularity.desc&language=pt-BR&region=BR&certification_country=BR&certification.lte=G`
      )).then(data => data?.results || []).catch(() => []),

      // Busca por filmes clássicos
      ...CLASSIC_SEARCH_TERMS.map(term => 
        fetchFromApi<{results: any[]}>(buildApiUrl('/search/movie', 
          `&query=${encodeURIComponent(term)}&language=pt-BR&region=BR&certification_country=BR&certification.lte=G`
        )).then(data => data?.results || []).catch(() => [])
      ),

      // Busca por coleções clássicas
      ...Object.values(CLASSIC_COLLECTIONS).map(collectionId =>
        fetchFromApi<{parts: any[]}>(buildApiUrl(`/collection/${collectionId}`, '?language=pt-BR'))
          .then(data => data?.parts || []).catch(() => [])
      )
    ]);

    // Combina todos os resultados
    let allContent = results.flat().filter(Boolean);

    // Remove duplicatas
    const uniqueContent = allContent.filter((item, index, self) =>
      index === self.findIndex((i) => i?.id === item?.id)
    );

    // Filtra por conteúdo em português e adequado para família
    const filteredContent = uniqueContent.filter(item => {
      if (!item) return false;
      
      const title = (item.title || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();

      // Verifica se o título está em português
      const hasPortugueseTitle = /[áàâãéèêíïóôõöúüç]/.test(title) || 
        /\b(o|a|os|as|um|uma|uns|umas|e|é|não|sim|que|como|para|por|com|sem|em|no|na|nos|nas)\b/i.test(title);

      // Verifica se é conteúdo adequado para família
      const isFamilyFriendly = !item.adult && 
        (item.genre_ids?.includes(FAMILY_GENRES.FAMILY) || 
         item.genre_ids?.includes(FAMILY_GENRES.ANIMATION) ||
         item.genre_ids?.includes(FAMILY_GENRES.ADVENTURE) ||
         item.genre_ids?.includes(FAMILY_GENRES.FANTASY) ||
         item.genre_ids?.includes(FAMILY_GENRES.COMEDY));

      // Verifica se é um filme clássico ou animação
      const isClassicOrAnimation = CLASSIC_SEARCH_TERMS.some(term => 
        title.includes(term) || overview.includes(term)
      ) || item.genre_ids?.includes(FAMILY_GENRES.ANIMATION);

      // Exclui conteúdo não apropriado
      const isAppropriate = !title.includes('terror') && 
        !title.includes('horror') && 
        !title.includes('suspense') &&
        !title.includes('thriller') &&
        !overview.includes('violência') &&
        !overview.includes('morte') &&
        !overview.includes('sangue');

      return hasPortugueseTitle && isFamilyFriendly && isAppropriate && isClassicOrAnimation;
    });

    // Adiciona tipo de mídia e ordena por popularidade
    const contentWithType = addMediaTypeToResults(filteredContent, 'movie')
      .sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));

    // Filtra apenas itens com poster
    const contentWithPoster = contentWithType.filter(item => item?.poster_path);

    return limitResults(contentWithPoster, limit);
  } catch (error) {
    console.error('Error fetching family content:', error);
    return [];
  }
} 