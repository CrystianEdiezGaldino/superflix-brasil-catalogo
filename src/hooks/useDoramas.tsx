
import { useState } from "react";
import { MediaItem } from "@/types/movie";
import { useDoramaFilters } from "./dorama/useDoramaFilters";
import { useDoramaLoader } from "./dorama/useDoramaLoader";
import { useDoramaPagination } from "./dorama/useDoramaPagination";
import { useDoramaSearch } from "./dorama/useDoramaSearch";
import { useDoramaFiltering } from "./dorama/useDoramaFiltering";

export const useDoramas = () => {
  const [allDoramas, setAllDoramas] = useState<MediaItem[]>([]);
  
  // Get dorama filters
  const { filterDoramas } = useDoramaFilters();
  
  // Load initial doramas
  const { 
    doramas, 
    setDoramas,
    popularDoramas, 
    topRatedDoramas,
    koreanMovies,
    isLoadingInitial, 
    isLoadingPopular, 
    isLoadingTopRated, 
    isLoadingMovies,
    hasMore,
    reloadDoramas
  } = useDoramaLoader();
  
  // Setup pagination
  const { 
    page, 
    isLoadingMore,
    loadMoreDoramas, 
    resetPagination 
  } = useDoramaPagination({ 
    filterDoramas,
    setDoramas: setAllDoramas
  });
  
  // Setup search
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useDoramaSearch({ 
    filterDoramas,
    setDoramas: setAllDoramas,
    resetPagination
  });
  
  // Setup filtering
  const { 
    yearFilter, 
    genreFilter,
    isFiltering,
    setYearFilter, 
    setGenreFilter, 
    resetFilters 
  } = useDoramaFiltering();
  
  // Helper function for loading more doramas
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

export default useDoramas;
