
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
import { fetchKoreanDramas } from "@/services/tmdbApi";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
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
    isLoading: homeDataLoading,
    hasError,
    handleSearch: originalHandleSearch,
  } = useHomePageData();
  
  // Fetch Korean dramas (doramas)
  const { data: doramasData, isLoading: doramasLoading } = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: fetchKoreanDramas,
    enabled: !!user && hasAccess
  });
  
  const isLoading = homeDataLoading || doramasLoading;
  
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
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!user) {
    return <UnauthenticatedState />;
  }
  
  if (hasError) {
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
            
            {/* Content sections */}
            {!hasAccess ? (
              <ContentPreview 
                movies={moviesData} 
                series={seriesData} 
                anime={animeData} 
              />
            ) : (
              <FullContent 
                movies={moviesData}
                series={seriesData}
                anime={animeData}
                topRatedAnime={topRatedAnimeData}
                recommendations={recommendations}
                doramas={doramasData}
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
