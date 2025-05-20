
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

export const useDoramaPagination = () => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetchDoramas();
      setDoramas(response);
      setTotalPages(10); // Assuming we have 10 pages max for doramas
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doramas');
      console.error('Error loading doramas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  useEffect(() => {
    loadPage();
  }, [page, loadPage]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  }, [totalPages]);

  return {
    doramas,
    page,
    totalPages,
    isLoading,
    error,
    nextPage,
    prevPage,
    goToPage
  };
};

export default useDoramaPagination;
