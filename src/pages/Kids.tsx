import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/home/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useKidsContent } from "@/hooks/kids/useKidsContent";
import MediaView from "@/components/media/MediaView";

const Kids = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, isLoading: subscriptionLoading } = useSubscription();
  const {
    kidsContent,
    trendingContent,
    topRatedContent,
    recentContent,
    popularContent,
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    yearFilter,
    ratingFilter,
    searchQuery,
    isSearching,
    isFiltering,
    handleSearchChange,
    handleYearFilterChange,
    handleRatingFilterChange,
    loadMore,
    resetFilters
  } = useKidsContent();

  // Check if user has access
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirection handling
  if (authLoading || subscriptionLoading) {
    return <LoadingState />;
  }

  if (!hasAccess) {
    return <LargeSubscriptionUpsell />;
  }

  const handleMediaClick = (media: any) => {
    if (media.media_type === "movie") {
      navigate(`/filme/${media.id}`);
    } else if (media.media_type === "tv") {
      navigate(`/serie/${media.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <Navbar />
      
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-600">
              Área Infantil
            </h1>
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <MediaView
              title="Conteúdo Infantil"
              type="movie"
              mediaItems={kidsContent}
              trendingItems={trendingContent}
              topRatedItems={topRatedContent}
              recentItems={recentContent}
              popularItems={popularContent}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              isFiltering={isFiltering}
              isSearching={isSearching}
              page={page}
              yearFilter={yearFilter}
              ratingFilter={ratingFilter}
              searchQuery={searchQuery}
              onSearch={handleSearchChange}
              onYearFilterChange={handleYearFilterChange}
              onRatingFilterChange={handleRatingFilterChange}
              onLoadMore={loadMore}
              onResetFilters={resetFilters}
              onMediaClick={handleMediaClick}
              hideNavbar={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kids;
