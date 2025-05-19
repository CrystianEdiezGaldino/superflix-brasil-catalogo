
import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";
import { cacheManager } from "@/utils/cacheManager";

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

  // Force a subscription check on mount to ensure we have the latest data,
  // but only if we don't have subscription data in cache
  useEffect(() => {
    if (!user || subscriptionLoading) {
      return;
    }
    
    // Verificar cache antes de chamar checkSubscription
    const subscriptionCacheKey = `sub_data_${user.id}`;
    const cachedSubscriptionData = cacheManager.get(subscriptionCacheKey);
    
    if (!cachedSubscriptionData) {
      checkSubscription();
      
      // Cache por 5 minutos
      const subData = { isSubscribed, isAdmin, hasTrialAccess, hasTempAccess };
      cacheManager.set(subscriptionCacheKey, subData, 5 * 60 * 1000);
    }
  }, [user, checkSubscription, subscriptionLoading]);
  
  // Get popular series and recent animes with limit to reduce API calls
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
    // Usar cache para consultas de pesquisa
    const searchCacheKey = `search_${query.toLowerCase()}_${page}`;
    const cachedResults = cacheManager.get(searchCacheKey);
    
    if (cachedResults) {
      return Promise.resolve(cachedResults);
    }
    
    return searchMedia(query, page).then(results => {
      // Cache por 10 minutos
      cacheManager.set(searchCacheKey, results, 10 * 60 * 1000);
      return results;
    });
  }, [searchMedia]);

  // Debug log para desenvolvimento apenas
  if (import.meta.env.DEV) {
    console.log("Home page data:", { 
      hasUser: !!user, 
      isSubscribed, 
      isAdmin, 
      hasTrialAccess, 
      hasTempAccess, 
      hasAccess,
      cacheSize: cacheManager.getCacheSize(),
      mediaDataLoaded: {
        movies: !!moviesData?.length,
        series: !!seriesData?.length,
        anime: !!animeData?.length
      }
    });
  }

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
