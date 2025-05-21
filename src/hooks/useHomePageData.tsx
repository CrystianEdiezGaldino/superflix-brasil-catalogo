
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
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading, 
    checkSubscription
  } = useSubscription();
  
  const { hasAccess } = useAccessControl();

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
  
  // Get popular content
  const { 
    popularContent,
    isLoading: isLoadingPopularContent
  } = usePopularContent();
  
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

  // Memoize the subscription check logic
  const shouldCheckSubscription = useMemo(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    return timeSinceLastCheck > 300000; // Aumentado para 5 minutos (300000ms) para evitar verificações excessivas
  }, []);

  // Optimize subscription check effect - CORRIGIDO para reduzir frequência de chamadas
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
      
      checkSubscription();
      lastCheckTime.current = Date.now();
    }, 5000); // Aumentado para 5 segundos

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

    // Reduzir o número de logs e comparações profundas para evitar rerenderizações excessivas
    // Considerar apenas mudanças reais e limitar a frequência dos logs
    const dataUpdateThrottle = 10; // Apenas log a cada 10 atualizações
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
