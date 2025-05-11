
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import { useHomePageData } from "@/hooks/useHomePageData";
import { MediaItem } from "@/types/movie";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import TrialNotification from "@/components/home/TrialNotification";
import SubscriptionUpsell from "@/components/home/SubscriptionUpsell";
import AdminIndicator from "@/components/home/AdminIndicator";
import ContentPreview from "@/components/home/ContentPreview";
import FullContent from "@/components/home/FullContent";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import SearchResults from "@/components/home/SearchResults";
import ContentCalendar from "@/components/calendar/ContentCalendar";
import { useMovies } from "@/hooks/movies/useMovies";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("movies");
  
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
    isLoading,
    hasError,
    handleSearch: originalHandleSearch,
  } = useHomePageData();

  // Adicionar hook de filmes para paginação
  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

  // Enhanced search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (!query || query.trim() === "") {
      // If query is empty, clear search results but don't show loader
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    try {
      const results = await originalHandleSearch(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Clear search when user clicks on navigation links
  useEffect(() => {
    const handleNavigation = () => {
      setSearchQuery("");
      setSearchResults([]);
    };
    
    // Add event listener for navigation
    window.addEventListener("popstate", handleNavigation);
    
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  // Handle loading more content for a specific section
  const handleLoadMoreSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    console.log(`Loading more content for section: ${sectionId}`);
    loadMoreMovies();
  };
  
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
  
  // Guard for loading state with more debugging
  if (isLoading) {
    console.log("Home page is loading:", { 
      authLoading: user === undefined,
      subscriptionData: { hasAccess, isAdmin, hasTrialAccess },
      mediaLoaded: !!(moviesData && seriesData && animeData)
    });
    return <LoadingState />;
  }
  
  // Show unauthenticated state if user is not logged in
  if (!user) {
    console.log("No user found, showing unauthenticated state");
    return <UnauthenticatedState />;
  }
  
  // Show error state if there was an error loading data
  if (hasError) {
    console.log("Error occurred loading media data");
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar onSearch={handleSearch} />
      
      {/* Show Banner only when not searching */}
      {!searchQuery && featuredMedia && (
        <Banner media={featuredMedia} />
      )}
      
      {/* Trial notification for users with trial access */}
      {hasTrialAccess && <TrialNotification trialEnd={trialEnd} />}
      
      {/* Upsell for non-subscribers */}
      {!hasAccess && <SubscriptionUpsell />}
      
      <main className={`container max-w-full pt-4 pb-20 ${
        searchQuery ? 'pt-24' : ''
      }`}>
        {/* Search results section */}
        {searchQuery ? (
          <SearchResults results={searchResults} isSearching={isSearching} />
        ) : (
          <>
            {/* Admin indicator */}
            {isAdmin && <AdminIndicator />}
            
            {/* Calendar Section */}
            {hasAccess && (
              <div className="mb-8 px-4 md:px-8">
                <ContentCalendar compact />
              </div>
            )}
            
            {/* Content sections */}
            {!hasAccess ? (
              <ContentPreview 
                movies={moviesData || []} 
                series={seriesData || []} 
                anime={animeData || []} 
              />
            ) : (
              <FullContent 
                movies={movies}
                actionMovies={actionMoviesData || []}
                comedyMovies={comedyMoviesData || []}
                adventureMovies={adventureMoviesData || []}
                sciFiMovies={sciFiMoviesData || []}
                marvelMovies={marvelMoviesData || []}
                dcMovies={dcMoviesData || []}
                horrorMovies={[]}
                romanceMovies={[]}
                dramaMovies={[]}
                thrillerMovies={[]}
                familyMovies={[]}
                animationMovies={[]}
                documentaryMovies={[]}
                awardWinningMovies={[]}
                popularMovies={[]}
                trendingMovies={[]}
                series={seriesData || []}
                anime={animeData || []}
                topRatedAnime={topRatedAnimeData || []}
                recommendations={recommendations || []}
                doramas={doramasData || []}
                onLoadMore={handleLoadMoreSection}
                onMediaClick={handleMediaClick}
                isLoading={isLoadingMore}
                hasMore={hasMore}
              />
            )}
            
            {/* Subscription upsell section */}
            {!hasAccess && <LargeSubscriptionUpsell />}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
