
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useMediaData } from "./useMediaData";
import { useMediaSearch } from "./useMediaSearch";
import { useRecommendations } from "./useRecommendations";
import { useFeaturedMedia } from "./useFeaturedMedia";
import { useAccessControl } from "./useAccessControl";
import { MediaItem } from "@/types/movie";
import { fetchPopularAmericanSeries, fetchRecentAnime } from "@/services/tmdbApi";

// List of popular sitcoms and American series IDs
const POPULAR_SERIES_IDS = [
  1668,   // Friends
  2316,   // The Office (US)
  4556,   // How I Met Your Mother
  1402,   // The Walking Dead
  1396,   // Breaking Bad
  46952,  // Stranger Things
  60735,  // The Flash
  60625,  // Rick and Morty
  1412,   // Arrow
  1399,   // Game of Thrones
  1434,   // Family Guy
  66732,  // Stranger Things
  2734,   // Law & Order: Special Victims Unit
  1418,   // The Big Bang Theory
  2190,   // South Park
  1438,   // The Wire
  1416,   // Grey's Anatomy
  1622,   // Supernatural
  63174,  // Lucifer
  60573   // Silicon Valley
];

export const useHomePageData = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [popularSeries, setPopularSeries] = useState<MediaItem[]>([]);
  const [recentAnimes, setRecentAnimes] = useState<MediaItem[]>([]);
  const [isLoadingPopularSeries, setIsLoadingPopularSeries] = useState(false);
  const [isLoadingRecentAnimes, setIsLoadingRecentAnimes] = useState(false);
  
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
  }, [user, checkSubscription]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar o conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Fetch popular American series
  useEffect(() => {
    const loadPopularSeries = async () => {
      if (!user) return;
      
      setIsLoadingPopularSeries(true);
      try {
        // Fetch 40 items to have enough content for load more
        const series = await fetchPopularAmericanSeries(1, 40);
        
        // Prioritize our list of popular series
        const prioritizedSeries = [...series];
        prioritizedSeries.sort((a, b) => {
          const aIndex = POPULAR_SERIES_IDS.indexOf(a.id);
          const bIndex = POPULAR_SERIES_IDS.indexOf(b.id);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          } else if (aIndex !== -1) {
            return -1;
          } else if (bIndex !== -1) {
            return 1;
          }
          
          return (b.vote_average || 0) - (a.vote_average || 0);
        });
        
        setPopularSeries(prioritizedSeries);
      } catch (error) {
        console.error("Error loading popular series:", error);
      } finally {
        setIsLoadingPopularSeries(false);
      }
    };
    
    loadPopularSeries();
  }, [user]);
  
  // Fetch recent anime
  useEffect(() => {
    const loadRecentAnimes = async () => {
      if (!user) return;
      
      setIsLoadingRecentAnimes(true);
      try {
        // Fetch 40 items for load more functionality
        const animes = await fetchRecentAnime(1, 40);
        setRecentAnimes(animes);
      } catch (error) {
        console.error("Error loading recent animes:", error);
      } finally {
        setIsLoadingRecentAnimes(false);
      }
    };
    
    loadRecentAnimes();
  }, [user]);
  
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
