
import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

export const useDoramaData = () => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoramas = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDoramas();
        setDoramas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load doramas');
        console.error('Error loading doramas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDoramas();
  }, []);

  return {
    doramas,
    isLoading,
    error
  };
};

export default useDoramaData;
