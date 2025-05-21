
import { useEffect, useCallback, useMemo, useRef } from "react";
import { MediaItem } from "@/types/movie";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";

export const useHomePageData = () => {
  const startTimeRef = useRef(Date.now());
  const lastCheckTime = useRef<number>(0);
  const checkTimeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef<any>(null);
  const dataUpdateCount = useRef(0);

  // Use accessControl hook with safe error handling
  const accessControlData = useAccessControl();
  
  const { user, hasAccess, isLoading: accessLoading } = accessControlData;
  const isAdmin = accessControlData.user?.role === 'admin' || false;
  const hasTrialAccess = accessControlData.hasTrialAccess || false;

  // Import data from smaller hooks - wrap in try-catch for safety
  let searchData = { 
    searchMedia: (query: string, page?: number) => Promise.resolve([]),
    results: [],
    isLoading: false,
    hasMore: false,
    currentPage: 1
  };
  
  try {
    searchData = useMediaSearch();
  } catch (error) {
    console.error("Error using MediaSearch:", error);
  }
  
  const { searchMedia, results, isLoading: searchLoading, hasMore, currentPage } = searchData;
  
  // Get recommendations safely
  let recommendationsData = { recommendations: [] };
  try {
    recommendationsData = useRecommendations();
  } catch (error) {
    console.error("Error loading recommendations:", error);
  }
  const { recommendations } = recommendationsData;
  
  // Get media data safely
  let mediaData = {
    moviesData: [],
    seriesData: [],
    animeData: [],
    topRatedAnimeData: [],
    doramasData: [],
    actionMoviesData: [],
    comedyMoviesData: [],
    adventureMoviesData: [],
    sciFiMoviesData: [],
    marvelMoviesData: [],
    dcMoviesData: [],
    isLoading: false,
    hasError: null
  };
  
  try {
    mediaData = useMediaData();
  } catch (error) {
    console.error("Error loading media data:", error);
  }
  
  const { 
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
    isLoading: mediaLoading,
    hasError
  } = mediaData;
  
  // Get popular content safely
  let popularContentData = { 
    popularContent: [],
    isLoading: false
  };
  
  try {
    popularContentData = usePopularContent();
  } catch (error) {
    console.error("Error loading popular content:", error);
  }
  
  const { 
    popularContent,
    isLoading: isLoadingPopularContent
  } = popularContentData;
  
  // Get featured media safely
  let featuredMediaData = { featuredMedia: undefined };
  
  try {
    featuredMediaData = useFeaturedMedia(
      hasAccess,
      user,
      moviesData,
      seriesData,
      animeData,
      topRatedAnimeData,
      doramasData,
      recommendations
    );
  } catch (error) {
    console.error("Error loading featured media:", error);
  }
  
  const { featuredMedia } = featuredMediaData;

  // Create a memoized search handler
  const handleSearch = useCallback((query: string, page: number = 1) => {
    return searchMedia(query, page);
  }, [searchMedia]);

  // Memoize loading states
  const loadingStates = useMemo(() => ({
    accessLoading,
    mediaLoading,
    isLoadingPopularContent
  }), [
    accessLoading,
    mediaLoading,
    isLoadingPopularContent
  ]);

  // Loading state with timeout protection
  const isLoading = useMemo(() => {
    const isStillLoading = accessLoading || mediaLoading || isLoadingPopularContent;
    
    if (isStillLoading && Date.now() - startTimeRef.current > 10000) {
      console.warn('Loading timeout reached - forcing completion');
      return false;
    }
    
    return isStillLoading;
  }, [accessLoading, mediaLoading, isLoadingPopularContent]);

  // Memoize the return value with deep comparison
  const result = useMemo(() => {
    const newData = {
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
      ...loadingStates,
      sectionData: {
        movies: { hasMore: true },
        series: { hasMore: true },
        actionMovies: { hasMore: true },
        comedyMovies: { hasMore: true }
      },
      handleLoadMoreSection: (section: string) => {
        console.log(`Loading more for section: ${section}`);
      }
    };

    // Reduce the number of logs and deep comparisons to avoid excessive re-renders
    const dataUpdateThrottle = 10; // Log only every 10 updates
    dataUpdateCount.current = (dataUpdateCount.current + 1) % dataUpdateThrottle;
    
    if (dataUpdateCount.current === 0) {
      const oldDataString = JSON.stringify(lastDataRef.current || {});
      const newDataString = JSON.stringify(newData);
      
      if (oldDataString !== newDataString) {
        console.log("Home page data:", newData);
        lastDataRef.current = JSON.parse(newDataString);
      }
    }

    return newData;
  }, [
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
    results,
    searchLoading,
    hasMore,
    currentPage,
    loadingStates
  ]);
  
  return result;
};
