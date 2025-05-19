
import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";

// Remove the import to prevent circular dependency
// import { useAuthRedirect } from "./useAuthRedirect";

export const useHomePageData = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading, 
    checkSubscription
  } = useSubscription();
  
  // Use the access control hook to get the hasAccess flag
  const { hasAccess } = useAccessControl();

  // Force a subscription check on mount to ensure we have the latest data
  useEffect(() => {
    let isUnmounted = false;
    
    if (user && !isUnmounted) {
      checkSubscription();
    }
    
    return () => {
      isUnmounted = true;
    };
  }, [user, checkSubscription]);
  
  // Get popular series and recent animes
  const { 
    popularSeries, 
    recentAnimes,
    isLoadingPopularSeries,
    isLoadingRecentAnimes
  } = usePopularContent(user?.id);
  
  // Import data from smaller hooks
  const { searchMedia, results, isLoading: searchLoading, hasMore, currentPage } = useMediaSearch();
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

  // Create a memoized search handler to prevent recreation on each render
  const handleSearch = useCallback((query: string, page: number = 1) => {
    return searchMedia(query, page);
  }, [searchMedia]);

  // Debug log to help track subscription state
  console.log("Home page data:", { 
    hasUser: !!user, 
    isSubscribed, 
    isAdmin, 
    hasTrialAccess, 
    hasTempAccess, 
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
    popularSeries,
    recentAnimes,
    isLoading,
    hasError,
    handleSearch,
    searchResults: results,
    isSearchLoading: searchLoading,
    hasMoreResults: hasMore,
    searchCurrentPage: currentPage
  };
};
