
import { useDoramaFilters } from "./dorama/useDoramaFilters";
import { useDoramaLoader } from "./dorama/useDoramaLoader";
import { useDoramaPagination } from "./dorama/useDoramaPagination";
import { useDoramaSearch } from "./dorama/useDoramaSearch";
import { useDoramaFiltering } from "./dorama/useDoramaFiltering";

export const useDoramas = () => {
  // Get dorama filters
  const { filterDoramas, applyFilters } = useDoramaFilters();
  
  // Load initial, popular and top rated doramas
  const { 
    doramas, 
    setDoramas, 
    topRatedDoramas, 
    popularDoramas, 
    isLoadingInitial, 
    isLoadingPopular, 
    isLoadingTopRated 
  } = useDoramaLoader({ filterDoramas });
  
  // Setup pagination
  const { 
    page, 
    hasMore, 
    loadMoreDoramas, 
    resetPagination 
  } = useDoramaPagination({ filterDoramas, setDoramas });
  
  // Setup search
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useDoramaSearch({ filterDoramas, setDoramas, resetPagination });
  
  // Setup filtering
  const { 
    yearFilter, 
    genreFilter, 
    isFiltering, 
    setYearFilter, 
    setGenreFilter, 
    resetFilters 
  } = useDoramaFiltering({ 
    applyFilters, 
    setDoramas, 
    resetPagination, 
    isSearching, 
    isLoadingInitial 
  });
  
  // Helper function for loading more doramas (to encapsulate parameters)
  const handleLoadMoreDoramas = () => {
    loadMoreDoramas(isSearching, isFiltering);
  };

  return {
    doramas,
    topRatedDoramas,
    popularDoramas,
    page,
    hasMore,
    searchQuery,
    yearFilter,
    genreFilter,
    isSearching,
    isFiltering,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    handleSearch,
    loadMoreDoramas: handleLoadMoreDoramas,
    setYearFilter,
    setGenreFilter,
    resetFilters
  };
};
