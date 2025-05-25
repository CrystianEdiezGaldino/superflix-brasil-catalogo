
import { MediaItem } from "@/types/movie";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults } from "./utils";

// Family-friendly genres
const FAMILY_GENRES = {
  ANIMATION: 16,
  FAMILY: 10751,
  ADVENTURE: 12,
  FANTASY: 14,
  COMEDY: 35
};

export async function fetchFamilyMovies(limit: number = 100): Promise<MediaItem[]> {
  try {
    const results = await Promise.all([
      // Family movies
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_genres=${FAMILY_GENRES.FAMILY}&sort_by=popularity.desc&language=pt-BR&vote_count.gte=50`
      )).then(data => data?.results || []).catch(() => []),

      // Animation movies
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_genres=${FAMILY_GENRES.ANIMATION}&sort_by=popularity.desc&language=pt-BR&vote_count.gte=50`
      )).then(data => data?.results || []).catch(() => []),

      // Adventure movies suitable for families
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_genres=${FAMILY_GENRES.ADVENTURE}&certification_country=US&certification.lte=PG&sort_by=popularity.desc&language=pt-BR`
      )).then(data => data?.results || []).catch(() => []),

      // Comedy movies
      fetchFromApi<{results: any[]}>(buildApiUrl('/discover/movie', 
        `&with_genres=${FAMILY_GENRES.COMEDY}&certification_country=US&certification.lte=PG&sort_by=popularity.desc&language=pt-BR`
      )).then(data => data?.results || []).catch(() => [])
    ]);

    // Combine and deduplicate results
    let allMovies = results.flat().filter(Boolean);
    
    // Remove duplicates
    const uniqueMovies = allMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m?.id === movie?.id)
    );

    // Filter for family-appropriate content
    const familyMovies = uniqueMovies.filter(movie => {
      if (!movie || movie.adult) return false;
      
      // Must have poster
      if (!movie.poster_path) return false;
      
      // Should have family-friendly genres
      const hasFamilyGenre = movie.genre_ids?.some((genreId: number) => 
        Object.values(FAMILY_GENRES).includes(genreId)
      );
      
      return hasFamilyGenre;
    });

    // Add media type and sort by popularity
    const moviesWithType = addMediaTypeToResults(familyMovies, 'movie')
      .sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));

    return moviesWithType.slice(0, limit);
  } catch (error) {
    console.error('Error fetching family movies:', error);
    return [];
  }
}
