
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/home/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useKidsContent } from "@/hooks/kids/useKidsContent";
import MediaView from "@/components/media/MediaView";
import { ToyBrick, IceCreamBowl, Smile, Star, Lollipop, PartyPopper } from "lucide-react";

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

  // Icons for categories
  const categoryIcons = [
    { icon: <ToyBrick size={24} className="text-yellow-500" />, label: "Brinquedos" },
    { icon: <IceCreamBowl size={24} className="text-pink-400" />, label: "Doces" },
    { icon: <Smile size={24} className="text-green-400" />, label: "Diversão" },
    { icon: <Star size={24} className="text-purple-400" />, label: "Aventuras" },
    { icon: <Lollipop size={24} className="text-blue-400" />, label: "Magia" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-pink-100 to-purple-100">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header com animações e decorações */}
          <div className="relative mb-8">
            <div className="absolute -top-12 right-4 animate-bounce">
              <PartyPopper size={40} className="text-yellow-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent pb-2">
              Mundo das Crianças
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {categoryIcons.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-2 md:p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-xs md:text-sm font-medium mt-2 text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Content container with playful design */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-purple-200">
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

          {/* Decorative elements */}
          <div className="flex justify-between mt-6">
            <div className="hidden md:block w-20 h-20 bg-yellow-300 rounded-full transform -translate-y-6 opacity-70"></div>
            <div className="hidden md:block w-16 h-16 bg-pink-300 rounded-full transform translate-y-4 opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kids;
