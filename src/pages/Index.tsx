
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import { useHomePageData } from "@/hooks/useHomePageData";
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

const Index = () => {
  const {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    trialEnd,
    searchResults,
    isSearching,
    featuredMedia,
    recommendations,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    specificAnimeData,
    isLoading,
    hasError,
    handleSearch,
  } = useHomePageData();
  
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
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      {/* Banner principal */}
      <Banner media={featuredMedia} />
      
      {/* Trial notification for users with trial access */}
      {hasTrialAccess && <TrialNotification trialEnd={trialEnd} />}
      
      {/* Upsell for non-subscribers */}
      {!hasAccess && <SubscriptionUpsell />}
      
      <main className="container max-w-full pt-4 pb-20">
        {isSearching || searchResults.length > 0 ? (
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
                specificAnimeRecommendations={specificAnimeData}
                recommendations={recommendations}
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
