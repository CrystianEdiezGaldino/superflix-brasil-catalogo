import { useEffect, useCallback, useMemo } from "react";
import { MediaItem } from "@/types/movie";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";

const useHomePageData = () => {
  // Use accessControl hook
  const { user, hasAccess, isLoading: accessLoading, hasTrialAccess } = useAccessControl();
  const isAdmin = user?.role === 'admin' || false;

  // Get media data
  const { 
    moviesData = [], 
    seriesData = [], 
    animeData = [], 
    topRatedAnimeData = [], 
    doramasData = [],
    actionMoviesData = [],
    comedyMoviesData = [],
    adventureMoviesData = [],
    sciFiMoviesData = [],
    marvelMoviesData = [],
    dcMoviesData = [],
    isLoading: mediaLoading,
    hasError
  } = useMediaData();

  // Get search functionality
  const { 
    searchMedia, 
    results = [], 
    isLoading: searchLoading, 
    hasMore, 
    currentPage 
  } = useMediaSearch();

  // Get recommendations
  const { recommendations = [] } = useRecommendations();

  // Get popular content
  const { 
    popularContent = [],
    isLoading: isLoadingPopularContent
  } = usePopularContent();

  // Get featured media
  const { featuredMedia } = useFeaturedMedia(
    hasAccess,
    user,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    recommendations
  );

  // Create a memoized search handler
  const handleSearch = useCallback((query: string, page: number = 1) => {
    return searchMedia(query, page);
  }, [searchMedia]);

  // Memoize loading state
  const isLoading = useMemo(() => {
    return accessLoading || mediaLoading || isLoadingPopularContent;
  }, [accessLoading, mediaLoading, isLoadingPopularContent]);

  // Memoize section data
  const sectionData = useMemo(() => ({
    movies: { hasMore: true },
    series: { hasMore: true },
    actionMovies: { hasMore: true },
    comedyMovies: { hasMore: true }
  }), []);

  // Memoize load more handler
  const handleLoadMoreSection = useCallback((section: string) => {
    // Implement load more logic here
  }, []);

  return {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    featuredMedia,
    recommendations,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    popularContent,
    isLoading,
    hasError,
    handleSearch,
    searchResults: results,
    isSearchLoading: searchLoading,
    hasMoreResults: hasMore,
    searchCurrentPage: currentPage,
    sectionData,
    handleLoadMoreSection
  };
};

export default useHomePageData;
