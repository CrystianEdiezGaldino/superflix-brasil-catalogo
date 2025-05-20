
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

interface UseDoramaPaginationProps {
  filterDoramas?: (doramas: MediaItem[]) => MediaItem[];
  setDoramas?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useDoramaPagination = ({ filterDoramas, setDoramas }: UseDoramaPaginationProps = {}) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Assuming 10 pages max for doramas
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetchDoramas(page);
      
      if (setDoramas) {
        // Apply filters if provided
        const processedDoramas = filterDoramas ? filterDoramas(response) : response;
        setDoramas(prev => page === 1 ? processedDoramas : [...prev, ...processedDoramas]);
      }
      
      setHasMore(response.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doramas');
      console.error('Error loading doramas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, filterDoramas, setDoramas]);

  useEffect(() => {
    loadPage();
  }, [page, loadPage]);

  const loadMoreDoramas = useCallback((isSearching = false, isFiltering = false) => {
    if (!hasMore || isLoading || isSearching || isFiltering) return;
    
    setIsLoadingMore(true);
    setPage(prevPage => prevPage + 1);
    setIsLoadingMore(false);
  }, [hasMore, isLoading]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    page,
    totalPages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMoreDoramas,
    resetPagination
  };
};

export default useDoramaPagination;
