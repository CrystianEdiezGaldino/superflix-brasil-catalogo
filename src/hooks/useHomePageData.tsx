import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '@/types/movie';
import { useFetch } from './useFetch';
import { useSearchMedia } from './useSearchMedia';
import { useAccessControl } from './useAccessControl';

const useHomePageData = () => {
  const navigate = useNavigate();
  
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
  
  // Media data fetching
  const {
    data: moviesData = [],
    isLoading: moviesLoading,
    error: moviesError
  } = useFetch<MediaItem[]>('/api/movies/trending');
  
  const {
    data: seriesData = [],
    isLoading: seriesLoading,
    error: seriesError
  } = useFetch<MediaItem[]>('/api/series/popular');

  // Additional media sections
  const {
    data: actionMoviesData = [],
    isLoading: actionLoading
  } = useFetch<MediaItem[]>('/api/movies/genre/action');
  
  const {
    data: comedyMoviesData = [],
    isLoading: comedyLoading
  } = useFetch<MediaItem[]>('/api/movies/genre/comedy');

  const {
    data: adventureMoviesData = [],
    isLoading: adventureLoading
  } = useFetch<MediaItem[]>('/api/movies/genre/adventure');
  
  const {
    data: sciFiMoviesData = [],
    isLoading: sciFiLoading
  } = useFetch<MediaItem[]>('/api/movies/genre/sci-fi');

  const {
    data: marvelMoviesData = [],
    isLoading: marvelLoading
  } = useFetch<MediaItem[]>('/api/movies/studio/marvel');

  const {
    data: dcMoviesData = [],
    isLoading: dcLoading
  } = useFetch<MediaItem[]>('/api/movies/studio/dc');

  const {
    data: doramasData = [],
    isLoading: doramasLoading
  } = useFetch<MediaItem[]>('/api/doramas');

  const {
    data: popularContent = [],
    isLoading: popularLoading
  } = useFetch<MediaItem[]>('/api/popular');

  const {
    data: recommendations = [],
    isLoading: recommendationsLoading
  } = useFetch<MediaItem[]>('/api/recommendations');
  
  const {
    data: horrorMoviesData = [],
    isLoading: horrorLoading
  } = useFetch<MediaItem[]>('/api/movies/genre/horror');

  const {
    data: popularInBrazilData = [],
    isLoading: popularInBrazilLoading
  } = useFetch<MediaItem[]>('/api/popular/brazil');

  const {
    data: trilogiesData = [],
    isLoading: trilogiesLoading
  } = useFetch<MediaItem[]>('/api/movies/collections');

  // Get featured media for the hero section
  const featuredMedia = useMemo(() => {
    if (moviesData && moviesData.length > 0) {
      // Return a random featured item from the first 5 movies
      const randomIndex = Math.floor(Math.random() * Math.min(5, moviesData.length));
      return moviesData[randomIndex];
    }
    return null;
  }, [moviesData]);
  
  // Search functionality
  const search = useSearchMedia();
  
  // Section data for load more functionality
  const [sectionData, setSectionData] = useState<Record<string, MediaItem[]>>({});
  
  // Handle errors
  const hasError = moviesError || seriesError;
  
  // Loading state
  const isLoading = 
    moviesLoading || 
    seriesLoading || 
    actionLoading ||
    recommendationsLoading ||
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
      popularSeriesData: seriesData?.slice(0, 10) || [],
      animeData: [], // This would need implementation
      topRatedAnimeData: [], // This would need implementation
      recentAnimesData: [], // This would need implementation
      doramasData: doramasData || [],
      recommendations: recommendations || [],
      popularContent: popularContent || [],
      horrorMoviesData: horrorMoviesData || [],
      popularInBrazilData: popularInBrazilData || [],
      trilogiesData: trilogiesData || [],
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
    doramasData,
    recommendations,
    popularContent,
    horrorMoviesData,
    popularInBrazilData,
    trilogiesData,
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
