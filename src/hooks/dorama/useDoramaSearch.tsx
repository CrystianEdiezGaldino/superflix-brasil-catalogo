
import { useState, useCallback, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { searchDoramas } from '@/services/tmdbApi';

interface UseDoramaSearchProps {
  filterDoramas?: (doramas: MediaItem[]) => MediaItem[];
  setDoramas?: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  resetPagination?: () => void;
}

export const useDoramaSearch = ({ 
  filterDoramas,
  setDoramas,
  resetPagination
}: UseDoramaSearchProps = {}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(query);

      const searchResults = await searchDoramas(query);
      
      // Apply filters if provided
      const processedResults = filterDoramas ? filterDoramas(searchResults) : searchResults;
      
      setResults(processedResults);
      
      // Update external doramas state if provided
      if (setDoramas) {
        setDoramas(processedResults);
      }
      
      // Reset pagination if provided
      if (resetPagination) {
        resetPagination();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching doramas:', err);
    } finally {
      setIsSearching(false);
    }
  }, [query, filterDoramas, setDoramas, resetPagination]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else if (setDoramas) {
        // Clear search results
        setDoramas([]);
        setSearchQuery('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch, setDoramas]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    searchQuery,
    results,
    isSearching,
    error,
    handleSearch,
    clearSearch
  };
};

export default useDoramaSearch;
