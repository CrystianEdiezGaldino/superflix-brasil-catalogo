
import { useState, useEffect, useCallback } from "react";
import { fetchDoramas } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { useDoramaLoader } from "./dorama/useDoramaLoader";
import { useDoramaPagination } from "./dorama/useDoramaPagination";
import { useDoramaFiltering } from "./dorama/useDoramaFiltering";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "./useAccessControl";

export const useDoramas = () => {
  const { user } = useAuth();
  const { hasAccess } = useAccessControl();
  
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    isLoading, 
    error, 
    loadingState, 
    setLoadingState
  } = useDoramaLoader();
  
  const {
    currentPage,
    totalPages,
    hasMorePages,
    setTotalPages,
    loadNextPage
  } = useDoramaPagination();
  
  const {
    filters,
    filteredDoramas,
    isFiltering,
    updateFilters,
    resetFilters
  } = useDoramaFiltering(doramas);

  const loadDoramas = useCallback(async (page: number = 1) => {
    if (!hasAccess) return;
    
    setLoadingState(page === 1 ? 'loading' : 'loadingMore');
    
    try {
      const data = await fetchDoramas(page);
      
      if (page === 1) {
        setDoramas(data);
      } else {
        setDoramas(prev => [...prev, ...data]);
      }
      
      // Assuming each page has 20 items, calculate total pages
      // This is an estimate since we don't have actual total_pages info
      setTotalPages(Math.ceil(data.length > 0 ? 100 : 0));
      setLoadingState('loaded');
      
    } catch (err) {
      console.error("Error loading doramas:", err);
      setLoadingState('error');
    }
  }, [hasAccess, setLoadingState, setTotalPages]);

  useEffect(() => {
    if (user && hasAccess) {
      loadDoramas(1);
    }
  }, [user, hasAccess, loadDoramas]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMorePages && !isLoading) {
      loadNextPage();
      loadDoramas(currentPage + 1);
    }
  }, [hasMorePages, isLoading, loadNextPage, currentPage, loadDoramas]);

  const handleFilterChange = useCallback((filterType: string, value: string | string[] | number[]) => {
    updateFilters({ [filterType]: value });
  }, [updateFilters]);

  return {
    doramas: isFiltering ? filteredDoramas : doramas,
    filters,
    isLoading,
    error,
    loadingState,
    currentPage,
    totalPages,
    hasMorePages,
    searchQuery,
    handleSearch,
    handleLoadMore,
    handleFilterChange,
    resetFilters,
    isFiltering
  };
};
