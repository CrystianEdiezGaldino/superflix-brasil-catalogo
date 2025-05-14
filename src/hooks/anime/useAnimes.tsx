
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
    seasonalAnimes,
    animeSections,
    fetchAnimeBatch,
    totalAnimes,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSeasons,
    isLoadingSections
  } = useAnimeLoader();
  
  // Configure pagination
  const { 
    page, 
    hasMore, 
    isLoadingMore, 
    loadMoreAnimes, 
    resetPagination 
  } = useAnimePagination({ 
    setAnimes,
    fetchAnimeBatch,
    totalAnimes
  });
  
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

  // Function to handle loading more items for a specific section
  const handleLoadMoreForSection = async (sectionId: string) => {
    // This would be implemented to load more items for a specific section
    console.log(`Loading more items for section: ${sectionId}`);
    // The implementation depends on how you want to handle pagination for each section
  };

  return {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    seasonalAnimes,
    specificAnimes: animeSections.popularAnime,
    animeSections,
    searchQuery,
    yearFilter,
    ratingFilter,
    page,
    hasMore,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingTrending,
    isLoadingRecent,
    isLoadingSeasons,
    isLoadingSections,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreAnimes: () => loadMoreAnimes(isSearching, isFiltering),
    loadMoreForSection: handleLoadMoreForSection,
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
