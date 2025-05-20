
import { useState, useCallback, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

export const useDoramaLoader = (initialLoad = true) => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadDoramas = useCallback(async (resetData = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = resetData ? 1 : page;
      const response = await fetchDoramas();
      
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setDoramas(prev => resetData ? response : [...prev, ...response]);
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doramas');
      console.error('Error loading doramas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (initialLoad) {
      loadDoramas(true);
    }
  }, [initialLoad, loadDoramas]);

  const reloadDoramas = () => {
    setPage(1);
    setHasMore(true);
    loadDoramas(true);
  };

  return {
    doramas,
    isLoading,
    error,
    hasMore,
    loadDoramas,
    reloadDoramas
  };
};

export default useDoramaLoader;
