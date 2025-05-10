
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { usePopularContent } from "./usePopularContent";
import { useAuthRedirect } from "./useAuthRedirect";

export const useHomePageData = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading, 
    trialEnd,
    checkSubscription
  } = useSubscription();
  
  // Handle auth redirects
  useAuthRedirect(user, authLoading);
  
  // Use the access control hook to get the hasAccess flag
  const { hasAccess } = useAccessControl();

  // Force a subscription check on mount to ensure we have the latest data
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);
  
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
  
  const { featuredMedia } = useFeaturedMedia(
    hasAccess,
    user,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData
  );

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
    trialEnd,
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
    handleSearch: originalHandleSearch,
  };
};
