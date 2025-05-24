import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "./utils";

// Keywords and franchise IDs for better targeting
const FRANCHISE_DATA = {
  STAR_WARS: {
    keyword: 'Star Wars',
    keywordId: '4367',
    franchiseId: '10',
    searchTerms: ['star wars', 'skywalker', 'mandalorian', 'jedi', 'sith']
  },
  HARRY_POTTER: {
    keyword: 'Harry Potter',
    keywordId: '9715',
    franchiseId: '1241',
    searchTerms: ['harry potter', 'fantastic beasts', 'wizarding world', 'hogwarts']
  },
  LORD_OF_THE_RINGS: {
    keyword: 'The Lord of the Rings',
    keywordId: '818',
    franchiseId: '119',
    searchTerms: ['lord of the rings', 'hobbit', 'middle earth', 'tolkien']
  },
  MATRIX: {
    keyword: 'The Matrix',
    keywordId: '2866',
    franchiseId: '2344',
    searchTerms: ['matrix', 'neo']
  },
  PIRATES: {
    keyword: 'Pirates of the Caribbean',
    keywordId: '270',
    franchiseId: '295',
    searchTerms: ['pirates of the caribbean', 'jack sparrow']
  },
  HUNGER_GAMES: {
    keyword: 'The Hunger Games',
    keywordId: '6017',
    franchiseId: '131635',
    searchTerms: ['hunger games', 'mockingjay']
  },
  JURASSIC_PARK: {
    keyword: 'Jurassic Park',
    keywordId: '156',
    franchiseId: '328',
    searchTerms: ['jurassic park', 'jurassic world', 'dinosaur park']
  },
  BACK_TO_FUTURE: {
    keyword: 'Back to the Future',
    keywordId: '2154',
    franchiseId: '264',
    searchTerms: ['back to the future', 'delorean', 'marty mcfly']
  },
  TOY_STORY: {
    keyword: 'Toy Story',
    keywordId: '11813',
    franchiseId: '10194',
    searchTerms: ['toy story', 'woody', 'buzz lightyear']
  }
};

// Function to fetch specific franchise content
export async function fetchFranchise(franchiseName: string, limit: number = 20): Promise<MediaItem[]> {
  const franchise = FRANCHISE_DATA[franchiseName as keyof typeof FRANCHISE_DATA];
  if (!franchise) {
    console.error(`Franchise ${franchiseName} not found`);
    return [];
  }
  
  try {
    const results = await Promise.all([
      // Search by collection/franchise ID (most reliable)
      fetchFromApi<{results: any[], parts?: any[]}>(buildApiUrl('/collection/' + franchise.franchiseId, '?language=pt-BR'))
        .then(data => {
          // Collection endpoint might return 'parts' array instead of results
          return data.parts || data.results || [];
        })
        .catch(() => []),
      
      // Search by keyword
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', `&with_keywords=${franchise.keywordId}&sort_by=popularity.desc&include_adult=false&language=pt-BR`))
        .then(data => data.results || [])
        .catch(() => []),
      
      // Direct search by name
      fetchFromApi<{results: any[]}>(buildApiUrl('/search/movie', `&query=${encodeURIComponent(franchise.keyword)}&language=pt-BR&include_adult=false`))
        .then(data => data.results || [])
        .catch(() => [])
    ]);
    
    // Combine and filter results
    let allMovies = [...results[0], ...results[1], ...results[2]];
    
    // Remove duplicates
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );
    
    // Filter for relevance using search terms and Portuguese content
    const relevantMovies = uniqueMovies.filter(movie => {
      const title = (movie.title || '').toLowerCase();
      const overview = (movie.overview || '').toLowerCase();
      
      // Check for Portuguese content
      const hasPortugueseTitle = /[áàâãéèêíïóôõöúüç]/.test(title) || 
        /\b(o|a|os|as|um|uma|uns|umas|e|é|não|sim|que|como|para|por|com|sem|em|no|na|nos|nas)\b/i.test(title);
      
      // Check for franchise relevance
      const isRelevant = franchise.searchTerms.some(term => 
        title.includes(term) || overview.includes(term)
      );
      
      return isRelevant && hasPortugueseTitle;
    });
    
    // Add media type and sort by popularity
    const moviesWithType = addMediaTypeToResults(relevantMovies, 'movie')
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    return limitResults(moviesWithType, limit);
  } catch (error) {
    console.error(`Error fetching ${franchiseName} franchise:`, error);
    return [];
  }
}

// Main function to fetch all trilogies
export async function fetchTrilogies(limit: number = 30): Promise<MediaItem[]> {
  try {
    // Fetch multiple franchises in parallel
    const [starWars, harryPotter, lotr, matrix, pirates, hungerGames, jurassicPark, backToFuture, toyStory] = 
      await Promise.all([
        fetchFranchise('STAR_WARS', limit),
        fetchFranchise('HARRY_POTTER', limit),
        fetchFranchise('LORD_OF_THE_RINGS', limit),
        fetchFranchise('MATRIX', limit),
        fetchFranchise('PIRATES', limit),
        fetchFranchise('HUNGER_GAMES', limit),
        fetchFranchise('JURASSIC_PARK', limit),
        fetchFranchise('BACK_TO_FUTURE', limit),
        fetchFranchise('TOY_STORY', limit)
      ]);
    
    // Combine all movies
    const allMovies = [
      ...starWars.map(m => ({ ...m, franchise: 'Star Wars' })),
      ...harryPotter.map(m => ({ ...m, franchise: 'Harry Potter' })),
      ...lotr.map(m => ({ ...m, franchise: 'Lord of the Rings' })),
      ...matrix.map(m => ({ ...m, franchise: 'Matrix' })),
      ...pirates.map(m => ({ ...m, franchise: 'Pirates of the Caribbean' })),
      ...hungerGames.map(m => ({ ...m, franchise: 'The Hunger Games' })),
      ...jurassicPark.map(m => ({ ...m, franchise: 'Jurassic Park' })),
      ...backToFuture.map(m => ({ ...m, franchise: 'Back to the Future' })),
      ...toyStory.map(m => ({ ...m, franchise: 'Toy Story' }))
    ];
    
    // Only include movies with posters
    const moviesWithPoster = allMovies.filter(movie => movie.poster_path);
    
    return limitResults(moviesWithPoster, limit * 3);
  } catch (error) {
    console.error('Error fetching trilogies:', error);
    return [];
  }
}

// Specific functions for each franchise
export async function fetchStarWarsMovies(limit: number = 20): Promise<MediaItem[]> {
  return fetchFranchise('STAR_WARS', limit);
}

export async function fetchHarryPotterMovies(limit: number = 20): Promise<MediaItem[]> {
  return fetchFranchise('HARRY_POTTER', limit);
}

export async function fetchLordOfTheRingsMovies(limit: number = 20): Promise<MediaItem[]> {
  return fetchFranchise('LORD_OF_THE_RINGS', limit);
}
