
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  
  // Clear search when user clicks on navigation links
  useEffect(() => {
    const handleNavigation = () => {
      handleSearch("");
    };
    
    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [handleSearch]);
  
  // Handle media click to navigate to detail page
  const handleMediaClick = (media: MediaItem) => {
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
  };
  
  // Guard for loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show unauthenticated state if user is not logged in
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
