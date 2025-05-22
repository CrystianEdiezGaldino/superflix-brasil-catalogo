
import { useState } from 'react';
import { MediaItem } from '@/types/movie';
import { supabase } from '@/integrations/supabase/client';

export const useSearchMedia = () => {
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fixed to return Promise<MediaItem[]> instead of Promise<void>
  const searchMedia = async (query: string, page = 1): Promise<MediaItem[]> => {
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      setCurrentPage(1);
      return [];
    }
    
    setIsLoading(true);
    try {
      // This is a mockup - in a real app, you'd call your API
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}`);
      const data = await response.json();
      
      const newResults = data.results || [];
      
      if (page === 1) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }
      
      setHasMore(data.total_pages > page);
      setCurrentPage(page);
      return newResults; // Return the results
      
    } catch (error) {
      console.error('Error searching media:', error);
      return []; // Return empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  
  return { searchMedia, results, isLoading, hasMore, currentPage };
};
