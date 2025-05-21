
import { useState, useEffect, useCallback } from "react";
import { fetchDoramas } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "./useAccessControl";

// Define simpler interfaces to match our implementation
interface DoramaLoaderState {
  isLoading: boolean;
  error: string | null;
}

interface DoramaPaginationState {
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const useDoramas = () => {
  const { user } = useAuth();
  const { hasAccess } = useAccessControl();
  
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Simplified states that match our actual needs
  const [loading, setLoading] = useState<{isLoading: boolean, loadingState: string}>({
    isLoading: false,
    loadingState: 'idle'
  });
  
  const [pagination, setPagination] = useState<DoramaPaginationState>({
    page: 1,
    totalPages: 1,
    hasMore: true
  });
  
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredDoramas, setFilteredDoramas] = useState<MediaItem[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const loadDoramas = useCallback(async (page: number = 1) => {
    if (!hasAccess) return;
    
    setLoading({
      isLoading: true,
      loadingState: page === 1 ? 'loading' : 'loadingMore'
    });
    
    try {
      const data = await fetchDoramas(page);
      
      if (page === 1) {
        setDoramas(data);
      } else {
        setDoramas(prev => [...prev, ...data]);
      }
      
      // Assuming each page has 20 items, calculate total pages
      // This is an estimate since we don't have actual total_pages info
      setPagination(prev => ({
        ...prev,
        page,
        totalPages: Math.ceil(data.length > 0 ? 100 : 0),
        hasMore: data.length > 0
      }));
      
      setLoading({
        isLoading: false,
        loadingState: 'loaded'
      });
      
    } catch (err) {
      console.error("Error loading doramas:", err);
      setLoading({
        isLoading: false,
        loadingState: 'error'
      });
    }
  }, [hasAccess]);

  useEffect(() => {
    if (user && hasAccess) {
      loadDoramas(1);
    }
  }, [user, hasAccess, loadDoramas]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !loading.isLoading) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({...prev, page: nextPage}));
      loadDoramas(nextPage);
    }
  }, [pagination.hasMore, loading.isLoading, pagination.page, loadDoramas]);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(prev => ({...prev, ...newFilters}));
    setIsFiltering(true);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setIsFiltering(false);
    setFilteredDoramas([]);
  }, []);

  return {
    doramas: isFiltering ? filteredDoramas : doramas,
    filters,
    isLoading: loading.isLoading,
    error: loading.loadingState === 'error' ? 'Failed to load doramas' : null,
    loadingState: loading.loadingState,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    hasMorePages: pagination.hasMore,
    searchQuery,
    handleSearch,
    handleLoadMore,
    handleFilterChange: updateFilters,
    resetFilters,
    isFiltering
  };
};
