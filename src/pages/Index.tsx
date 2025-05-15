
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MediaItem } from "@/types/movie";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import SearchResults from "@/components/home/SearchResults";
import { useContentSections } from "@/hooks/home/useContentSections";
import HomeHeader from "@/components/home/HomeHeader";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
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
    movies,
    isLoading,
    isLoadingMore,
    hasMore,
    hasError,
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    handleLoadMoreSection
  } = useContentSections();
  
  // Store if initial load is complete to prevent flicker
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Set initial load complete after first render cycle
  useEffect(() => {
    if (!isLoading) {
      setInitialLoadComplete(true);
    }
  }, [isLoading]);
  
  // Clear search when user clicks on navigation links - with useCallback to prevent recreation
  const handleNavigation = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);
  
  useEffect(() => {
    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [handleNavigation]);
  
  // Handle media click to navigate to detail page
  const handleMediaClick = useCallback((media: MediaItem) => {
    if (!media || !media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
        console.log(`Navigating to anime with ID: ${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  }, [navigate]);
  
  // Don't show loading during transition from logged out to logged in
  // Only show loading state on initial page load
  if (isLoading && !initialLoadComplete) {
    return <LoadingState />;
  }
  
  // Don't force authentication for home page - show unauthenticated preview instead
  // This prevents the auth loop when redirecting
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
          <SearchResults results={searchResults} isSearching={isSearching} />
        ) : (
          <MainContent 
            hasAccess={hasAccess}
            movies={movies}
            series={seriesData || []}
            anime={animeData || []}
            recommendations={recommendations || []}
            topRatedAnime={topRatedAnimeData || []}
            doramas={doramasData || []}
            actionMovies={actionMoviesData || []}
            comedyMovies={comedyMoviesData || []}
            adventureMovies={adventureMoviesData || []}
            sciFiMovies={sciFiMoviesData || []}
            marvelMovies={marvelMoviesData || []}
            dcMovies={dcMoviesData || []}
            popularSeries={popularSeries}
            recentAnimes={recentAnimes}
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
