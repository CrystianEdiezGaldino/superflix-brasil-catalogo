
import { useEffect, useCallback } from "react";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";

export const useHomePageData = () => {
  // Get authentication and subscription status from access control
  const { 
    user, 
    hasAccess, 
    authLoading, 
    subscriptionLoading 
  } = useAccessControl();
  
  // Force a subscription check on mount to ensure we have the latest data
  useEffect(() => {
    let isUnmounted = false;
    
    // The subscription check now happens in useAccessControl
    
    return () => {
      isUnmounted = true;
    };
  }, [user]);
  
  // Get popular series and recent animes
  const { 
    popularSeries, 
    recentAnimes,
    isLoadingPopularSeries,
    isLoadingRecentAnimes
  } = usePopularContent(user?.id);
  
  // Import data from smaller hooks
  const { handleSearch: originalHandleSearch } = useMediaSearch();
  const { recommendations } = useRecommendations();
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
  } = useMediaData();
  
  // Pass null if user is not available to prevent errors
  const safeUser = user || null;
  
  const { featuredMedia } = useFeaturedMedia(
    hasAccess,
    safeUser,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData
  );

  // Create a memoized search handler to prevent recreation on each render
  const handleSearch = useCallback(originalHandleSearch, [originalHandleSearch]);

  // Debug log to help track subscription state
  console.log("Home page data:", { 
    hasUser: !!user, 
    isAdmin: false, // We'll get this from useAccessControl
    hasTrialAccess: false, // We'll get this from useAccessControl
    hasTempAccess: false, // We'll get this from useAccessControl
    hasAccess,
    mediaDataLoaded: {
      movies: !!moviesData?.length,
      series: !!seriesData?.length,
      anime: !!animeData?.length
    }
  });

  // Loading state
  const isLoading = authLoading || subscriptionLoading || mediaLoading || 
                    isLoadingPopularSeries || isLoadingRecentAnimes;
  
  return {
    user: safeUser,
    isAdmin: false, // We'll get this from useAccessControl later
    hasAccess,
    hasTrialAccess: false, // We'll get this from useAccessControl later  
    trialEnd: null, // We'll get this from useAccessControl later
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
    popularSeries,
    recentAnimes,
    isLoading,
    hasError,
    handleSearch,
  };
};
