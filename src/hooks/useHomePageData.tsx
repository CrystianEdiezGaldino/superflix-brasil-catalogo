import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAccessControl } from './useAccessControl';
import { useMediaData } from './useMediaData';
import { useFeaturedMedia } from './useFeaturedMedia';
import { usePopularContent } from './usePopularContent';
import { useRecommendations } from './useRecommendations';
import { useSearchMedia } from './useSearchMedia';

const useHomePageData = () => {
  // Try to get auth context, handle if not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.error('Auth context not available in useHomePageData:', error);
  }

  // Try to get subscription context, handle if not available
  let subscriptionData = {
    isSubscribed: false,
    isAdmin: false,
    hasTempAccess: false,
    hasTrialAccess: false,
    subscriptionTier: null,
    isLoading: false
  };
  
  try {
    subscriptionData = useSubscription();
  } catch (error) {
    console.error('Subscription context not available in useHomePageData:', error);
  }
  
  // Use the access control hook to determine user access status
  const accessControlData = useAccessControl();
  
  // Get all media data from specialized hooks
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
    popularSeriesData,
    recentAnimesData,
    isLoading: mediaLoading,
    hasError: mediaError
  } = useMediaData();

  // Get popular content
  const { 
    popularContent, 
    recentAnimes,
    isLoading: popularLoading 
  } = usePopularContent();

  // Get recommendations
  const { recommendations } = useRecommendations();

  // Get featured media for the hero section
  const { featuredMedia } = useFeaturedMedia(
    accessControlData.hasAccess,
    user,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    recommendations
  );
  
  // Search functionality
  const search = useSearchMedia();
  
  // Section data for load more functionality
  const [sectionData, setSectionData] = useState<Record<string, any>>({});
  
  // Handle errors
  const hasError = mediaError;
  
  // Loading state
  const isLoading = 
    mediaLoading || 
    popularLoading || 
    accessControlData.isLoading;

  // Handle loading more items for a specific section
  const handleLoadMoreSection = async (sectionId: string) => {
    console.log(`Loading more items for section: ${sectionId}`);
    // Implementation would go here - fetch more data for the specified section
  };
  
  // Format the data for the Home component
  const homeData = useMemo(() => {
    // Check if the user has access based on subscription status
    const isAdmin = subscriptionData.isAdmin;
    const hasAccess = accessControlData.hasAccess;
    const hasTrialAccess = accessControlData.hasTrialAccess;
    
    // Log the home page data periodically for debugging
    console.log("Home page data:", {
      user,
      isAdmin,
      hasAccess,
      hasTrialAccess,
      featuredMedia,
      moviesData,
      seriesData,
      // Other data...
    });
    
    return {
      user,
      isAdmin,
      hasAccess,
      hasTrialAccess,
      featuredMedia,
      moviesData: moviesData || [],
      actionMoviesData: actionMoviesData || [],
      comedyMoviesData: comedyMoviesData || [],
      adventureMoviesData: adventureMoviesData || [],
      sciFiMoviesData: sciFiMoviesData || [],
      marvelMoviesData: marvelMoviesData || [],
      dcMoviesData: dcMoviesData || [],
      seriesData: seriesData || [],
      popularSeriesData: popularSeriesData || [],
      animeData: animeData || [],
      topRatedAnimeData: topRatedAnimeData || [],
      recentAnimesData: recentAnimesData || [],
      doramasData: doramasData || [],
      recommendations: recommendations || [],
      popularContent: popularContent || [],
      horrorMoviesData: [], // These will be provided by useMediaData in the future
      popularInBrazilData: [], // These will be provided by useMediaData in the future
      trilogiesData: [], // These will be provided by useMediaData in the future
      isLoading,
      hasError,
      searchResults: search.results,
      isSearchLoading: search.isLoading,
      sectionData,
      handleLoadMoreSection,
    };
  }, [
    user, 
    accessControlData.hasAccess,
    accessControlData.hasTrialAccess,
    subscriptionData.isAdmin,
    featuredMedia,
    moviesData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    recentAnimesData,
    popularSeriesData,
    recommendations,
    popularContent,
    isLoading,
    hasError,
    search.results,
    search.isLoading,
    sectionData
  ]);

  return {
    ...homeData,
    searchMedia: search.searchMedia
  };
};

export default useHomePageData;
