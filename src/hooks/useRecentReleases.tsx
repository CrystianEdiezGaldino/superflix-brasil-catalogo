import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchRecentReleases } from '@/services/tmdb/series';

export const useRecentReleases = (limit: number = 100) => {
  const [recentReleases, setRecentReleases] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoading(true);
      try {
        const releases = await fetchRecentReleases(1, limit);
        setRecentReleases(releases);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };
    
    fetchReleases();
  }, [limit]);

  return { recentReleases, isLoading, error };
}; 