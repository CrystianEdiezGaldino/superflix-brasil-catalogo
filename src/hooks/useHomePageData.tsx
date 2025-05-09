
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";

export const useHomePageData = () => {
  const navigate = useNavigate();
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
  
  // Use the access control hook to get the hasAccess flag
  const { hasAccess } = useAccessControl();

  // Force a subscription check on mount to ensure we have the latest data
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar o conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Import data from smaller hooks
  const { handleSearch: originalHandleSearch } = useMediaSearch();
  const { recommendations } = useRecommendations();
  const { 
    moviesData, 
    seriesData, 
    animeData, 
    topRatedAnimeData, 
    doramasData,
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
  const isLoading = authLoading || subscriptionLoading || mediaLoading;
  
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
    isLoading,
    hasError,
    handleSearch: originalHandleSearch,
  };
};
