
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { useAnimeLoader } from "./useAnimeLoader";
import { useAnimePagination } from "./useAnimePagination";
import { useAnimeSearch } from "./useAnimeSearch";
import { useAnimeFilters } from "./useAnimeFilters";

export const useAnimes = () => {
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  
  // Load all anime data
  const { 
    initialAnimes, 
    topRatedAnimes, 
    trendingAnimes,
    recentAnimes,
    specificAnimes,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSpecific 
  } = useAnimeLoader();
  
  // Configure pagination
  const { 
    page, 
    hasMore, 
    isLoadingMore, 
    loadMoreAnimes, 
    resetPagination 
  } = useAnimePagination({ setAnimes });
  
  // Configure search
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useAnimeSearch({ 
    setAnimes, 
    initialAnimes, 
    resetPagination 
  });
  
  // Configure filters
  const { 
    yearFilter, 
    ratingFilter, 
    isFiltering, 
    setYearFilter, 
    setRatingFilter, 
    resetFilters 
  } = useAnimeFilters({ 
    initialAnimes, 
    setAnimes, 
    isSearching 
  });
  
  // Set initial animes when loaded
  useEffect(() => {
    if (initialAnimes.length > 0 && !isSearching && !isFiltering) {
      setAnimes(initialAnimes);
    }
  }, [initialAnimes, isSearching, isFiltering]);

  return {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    specificAnimes,
    searchQuery,
    yearFilter,
    ratingFilter,
    page,
    hasMore,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSpecific,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreAnimes: () => loadMoreAnimes(isSearching, isFiltering),
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
