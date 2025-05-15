
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MediaItem } from "@/types/movie";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import SearchResults from "@/components/home/SearchResults";
import HomeHeader from "@/components/home/HomeHeader";
import MainContent from "@/components/home/MainContent";
import { useAccessControl } from "@/hooks/useAccessControl";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // First check if user is authenticated without causing circular dependencies
  const { user, isLoading: accessControlLoading } = useAccessControl();
  
  // Only import content hooks if we have a user
  const [contentData, setContentData] = useState<any>({
    isLoading: true,
    hasError: false,
    movies: [],
    series: [],
    anime: [],
    recommendations: [],
    featuredMedia: null
  });

  // Dynamic import of content hooks only after authentication is confirmed
  useEffect(() => {
    if (user) {
      // Dynamically import the content hooks
      const loadContentData = async () => {
        try {
          const { useContentSections } = await import("@/hooks/home/useContentSections");
          const contentSections = useContentSections();
          setContentData(contentSections);
        } catch (error) {
          console.error("Error loading content sections:", error);
          setContentData(prev => ({ ...prev, hasError: true, isLoading: false }));
        }
      };
      
      loadContentData();
    } else if (!accessControlLoading) {
      // If not loading and no user, update loading state
      setContentData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, accessControlLoading]);
  
  // Extract values from content data  
  const {
    isLoading,
    hasError,
    featuredMedia,
    isAdmin = false,
    hasAccess = false,
    hasTrialAccess = false,
    trialEnd = null,
    movies = [],
    series = [],
    anime = [],
    recommendations = [],
    topRatedAnime = [],
    doramas = [],
    actionMovies = [],
    comedyMovies = [],
    adventureMovies = [],
    sciFiMovies = [],
    marvelMovies = [],
    dcMovies = [],
    popularSeries = [],
    recentAnimes = [],
    isLoadingMore = false,
    hasMore = false,
  } = contentData;
  
  // Store if initial load is complete to prevent flicker
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Set initial load complete after first render cycle
  useEffect(() => {
    if (!isLoading) {
      setInitialLoadComplete(true);
    }
  }, [isLoading]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Simple search implementation until content data is available
    if (contentData.handleSearch) {
      contentData.handleSearch(query);
    }
  };
  
  // Handle media click to navigate to detail page
  const handleMediaClick = useCallback((media: MediaItem) => {
    if (!media || !media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  }, [navigate]);
  
  // Handle loading more content
  const handleLoadMoreSection = (sectionId: string) => {
    if (contentData.handleLoadMoreSection) {
      contentData.handleLoadMoreSection(sectionId);
    }
  };
  
  // Don't show loading during transition from logged out to logged in
  // Only show loading state on initial page load
  if ((isLoading || accessControlLoading) && !initialLoadComplete) {
    return <LoadingState />;
  }
  
  // Don't force authentication for home page - show unauthenticated preview instead
  if (!user) {
    return <UnauthenticatedState />;
  }
  
  // Show error state if there was an error loading data
  if (hasError) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar onSearch={handleSearch} />
      
      <HomeHeader 
        featuredMedia={featuredMedia}
        isAdmin={isAdmin}
        hasAccess={hasAccess}
        hasTrialAccess={hasTrialAccess}
        trialEnd={trialEnd}
        searchQuery={searchQuery}
      />
      
      <main className={`container max-w-full pt-4 pb-20 ${
        searchQuery ? 'pt-24' : ''
      }`}>
        {searchQuery ? (
          <SearchResults results={searchResults || []} isSearching={isSearching} />
        ) : (
          <MainContent 
            hasAccess={hasAccess}
            movies={movies}
            series={series || []}
            anime={anime || []}
            recommendations={recommendations || []}
            topRatedAnime={topRatedAnime || []}
            doramas={doramas || []}
            actionMovies={actionMovies || []}
            comedyMovies={comedyMovies || []}
            adventureMovies={adventureMovies || []}
            sciFiMovies={sciFiMovies || []}
            marvelMovies={marvelMovies || []}
            dcMovies={dcMovies || []}
            popularSeries={popularSeries || []}
            recentAnimes={recentAnimes || []}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMoreSection={handleLoadMoreSection}
            onMediaClick={handleMediaClick}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
