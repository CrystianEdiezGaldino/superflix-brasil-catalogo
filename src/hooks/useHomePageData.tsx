
import { useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
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
  
  // Wrap useAuth in a try-catch to handle case where AuthProvider doesn't exist
  let authData = { 
    user: null, 
    loading: true,
    session: null,
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
    resetPassword: async () => {},
    login: async () => {},
    register: async () => {},
    refreshSession: async () => {}
  };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error("Error using AuthContext:", error);
    // Use default values defined above
  }
  
  const { user, loading: authLoading } = authData;
  
  // Same for subscription
  let subscriptionData = {
    isSubscribed: false,
    isAdmin: false,
    hasTempAccess: false,
    hasTrialAccess: false,
    isLoading: true,
    checkSubscription: () => {}
  };
  
  try {
    subscriptionData = useSubscription();
  } catch (error) {
    console.error("Error using SubscriptionContext:", error);
    // Use default values defined above
  }
  
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading, 
    checkSubscription
  } = subscriptionData;
  
  // Use accessControl with safe defaults
  let accessControlData = { 
    user: null, 
    hasAccess: false, 
    isLoading: true 
  };
  
  try {
    accessControlData = useAccessControl();
  } catch (error) {
    console.error("Error using AccessControl:", error);
    // Use default values defined above
  }
  
  const { hasAccess } = accessControlData;

  // Import data from smaller hooks - wrap in try-catch for safety
  let searchData = { 
    searchMedia: () => Promise.resolve([]),
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

  // Memoize the subscription check logic
  const shouldCheckSubscription = useMemo(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    return timeSinceLastCheck > 300000; // 5 minutes (300000ms) to avoid excessive checks
  }, []);

  // Optimize subscription check effect - reduced frequency of calls
  useEffect(() => {
    if (!user || !shouldCheckSubscription) return;

    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    checkTimeoutRef.current = setTimeout(() => {
      if (isSubscribed && isAdmin) {
        // Skip check if user is already subscribed and admin
        lastCheckTime.current = Date.now();
        return;
      }

      console.log("Subscription check triggered:", {
        hasUser: !!user,
        isSubscribed,
        hasTrialAccess,
        hasTempAccess,
        isLoading: subscriptionLoading
      });
      
      if (typeof checkSubscription === 'function') {
        checkSubscription();
      }
      
      lastCheckTime.current = Date.now();
    }, 5000); // 5 seconds

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [user, shouldCheckSubscription, checkSubscription, isSubscribed, isAdmin]);

  // Memoize loading states
  const loadingStates = useMemo(() => ({
    authLoading,
    subscriptionLoading,
    mediaLoading,
    isLoadingPopularContent
  }), [
    authLoading,
    subscriptionLoading,
    mediaLoading,
    isLoadingPopularContent
  ]);

  // Loading state with timeout protection
  const isLoading = useMemo(() => {
    const isStillLoading = authLoading || subscriptionLoading || mediaLoading || 
                           isLoadingPopularContent;
    
    if (isStillLoading && Date.now() - startTimeRef.current > 10000) {
      console.warn('Loading timeout reached - forcing completion');
      return false;
    }
    
    return isStillLoading;
  }, [authLoading, subscriptionLoading, mediaLoading, isLoadingPopularContent]);

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
      ...loadingStates
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
