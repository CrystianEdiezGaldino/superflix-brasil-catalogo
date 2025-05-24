
import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { buildApiUrl, fetchFromApi, addMediaTypeToResults } from '@/services/tmdb/utils';

export const usePopularTVSeries = (limit: number = 20) => {
  const [popularTVSeries, setPopularTVSeries] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const POPULAR_TV_SHOWS = [
    'Supernatural', 
    'Two and a Half Men', 
    'The Big Bang Theory',
    'Friends',
    'Breaking Bad',
    'Game of Thrones',
    'Grey\'s Anatomy',
    'The Walking Dead',
    'The Office',
    'Stranger Things'
  ];

  useEffect(() => {
    const fetchPopularShows = async () => {
      setIsLoading(true);
      try {
        // Fetch results for each show in parallel
        const results = await Promise.all(
          POPULAR_TV_SHOWS.map(show => 
            fetchFromApi<{results: any[]}>(
              buildApiUrl('/search/tv', `&query=${encodeURIComponent(show)}&language=pt-BR&include_adult=false`)
            )
            .then(data => {
              // Get the most relevant result (usually the first one)
              if (data.results && data.results.length > 0) {
                return data.results[0];
              }
              return null;
            })
            .catch(() => null)
          )
        );
        
        // Filter out any null results and add media type
        const validResults = results.filter(result => result !== null);
        const seriesWithType = addMediaTypeToResults(validResults, 'tv');
        
        // Additional fetch for popular shows in general
        const popularResponse = await fetchFromApi<{results: any[]}>(
          buildApiUrl('/tv/popular', '?language=pt-BR&page=1')
        );
        
        // Combine specific shows with popular shows
        let allShows = [...seriesWithType];
        
        if (popularResponse.results) {
          const popularSeriesWithType = addMediaTypeToResults(popularResponse.results, 'tv');
          
          // Add popular shows that aren't already in our list
          popularSeriesWithType.forEach(show => {
            if (!allShows.some(existingShow => existingShow.id === show.id)) {
              allShows.push(show);
            }
          });
        }
        
        // Sort by popularity
        allShows.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        // Limit results
        setPopularTVSeries(allShows.slice(0, limit));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };
    
    fetchPopularShows();
  }, [limit]);

  return { popularTVSeries, isLoading, error };
};
