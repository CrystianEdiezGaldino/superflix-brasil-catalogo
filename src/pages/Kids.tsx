import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/home/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useKidsContent } from "@/hooks/kids/useKidsContent";
import MediaView from "@/components/media/MediaView";
import { Baby, Cat, Gift, Heart, Star, ToyBrick, Lollipop, PartyPopper } from "lucide-react";
const Kids = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    isSubscribed,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading
  } = useSubscription();
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

  // Character avatars for kids mode
  const kidsCharacters = [{
    icon: <Cat size={24} className="text-yellow-400" />,
    name: "Kitty",
    color: "bg-yellow-500/20"
  }, {
    icon: <Baby size={24} className="text-pink-400" />,
    name: "Baby",
    color: "bg-pink-500/20"
  }, {
    icon: <ToyBrick size={24} className="text-blue-400" />,
    name: "Blocks",
    color: "bg-blue-500/20"
  }, {
    icon: <Star size={24} className="text-purple-400" />,
    name: "Star",
    color: "bg-purple-500/20"
  }, {
    icon: <Gift size={24} className="text-green-400" />,
    name: "Gift",
    color: "bg-green-500/20"
  }, {
    icon: <Heart size={24} className="text-red-400" />,
    name: "Love",
    color: "bg-red-500/20"
  }, {
    icon: <Lollipop size={24} className="text-orange-400" />,
    name: "Candy",
    color: "bg-orange-500/20"
  }];
  return <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      {/* Decorative banner for kids section */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-netflix-background/70 to-netflix-background"></div>
        
        <div className="h-[180px] md:h-[220px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-yellow-500/30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-netflix-background to-transparent"></div>
          
          {/* Animated shapes */}
          <div className="absolute top-6 left-[10%] w-16 h-16 rounded-full bg-yellow-500/30 animate-bounce" style={{
          animationDelay: "0.2s",
          animationDuration: "3s"
        }}></div>
          <div className="absolute top-16 left-[30%] w-12 h-12 rounded-full bg-pink-500/30 animate-bounce" style={{
          animationDelay: "0.5s",
          animationDuration: "2.7s"
        }}></div>
          <div className="absolute top-8 left-[60%] w-10 h-10 rounded-full bg-blue-500/30 animate-bounce" style={{
          animationDelay: "0.8s",
          animationDuration: "3.2s"
        }}></div>
          <div className="absolute top-16 left-[80%] w-14 h-14 rounded-full bg-green-500/30 animate-bounce" style={{
          animationDelay: "1s",
          animationDuration: "2.5s"
        }}></div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Mundo Kids
              </h1>
              <PartyPopper className="absolute -right-12 -top-6 text-yellow-400 animate-bounce" size={32} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Character selection */}
        <div className="my-6">
          <div className="overflow-x-auto scrollbar-hide py-2">
            
          </div>
        </div>
        
        {/* Main content */}
        <div className="relative rounded-lg overflow-hidden">
          {/* Sparkle effects */}
          <div className="hidden md:block absolute top-8 right-8 w-8 h-8 bg-yellow-400/30 rounded-full animate-pulse"></div>
          <div className="hidden md:block absolute bottom-12 left-12 w-6 h-6 bg-pink-400/30 rounded-full animate-pulse" style={{
          animationDelay: "0.5s"
        }}></div>
          
          <MediaView title="Conteúdo Infantil" type="movie" mediaItems={kidsContent} trendingItems={trendingContent} topRatedItems={topRatedContent} recentItems={recentContent} popularItems={popularContent} isLoading={isLoading} isLoadingMore={isLoadingMore} hasMore={hasMore} isFiltering={isFiltering} isSearching={isSearching} page={page} yearFilter={yearFilter} ratingFilter={ratingFilter} searchQuery={searchQuery} onSearch={handleSearchChange} onYearFilterChange={handleYearFilterChange} onRatingFilterChange={handleRatingFilterChange} onLoadMore={loadMore} onResetFilters={resetFilters} onMediaClick={handleMediaClick} hideNavbar={true} />
        </div>
      </div>
    </div>;
};
export default Kids;