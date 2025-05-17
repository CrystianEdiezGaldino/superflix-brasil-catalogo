
import { useDoramaFilters } from "./dorama/useDoramaFilters";
import { useDoramaLoader } from "./dorama/useDoramaLoader";
import { useDoramaPagination } from "./dorama/useDoramaPagination";
import { useDoramaSearch } from "./dorama/useDoramaSearch";
import { useDoramaFiltering } from "./dorama/useDoramaFiltering";

export const useDoramas = () => {
  // Get dorama filters
  const { filterDoramas, applyFilters } = useDoramaFilters();
  
  // Load initial, popular, top rated doramas and Korean movies
  const { 
    doramas, 
    setDoramas, 
    topRatedDoramas, 
    popularDoramas, 
    koreanMovies,
    isLoadingInitial, 
    isLoadingPopular, 
    isLoadingTopRated, 
    isLoadingMovies
  } = useDoramaLoader({ filterDoramas });
  
  // Setup pagination
  const { 
    page, 
    hasMore, 
    isLoadingMore,
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
    koreanMovies,
    page,
    hasMore,
    isLoadingMore,
    searchQuery,
    yearFilter,
    genreFilter,
    isSearching,
    isFiltering,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    isLoadingMovies,
    handleSearch,
    loadMoreDoramas: handleLoadMoreDoramas,
    setYearFilter,
    setGenreFilter,
    resetFilters
  };
};
