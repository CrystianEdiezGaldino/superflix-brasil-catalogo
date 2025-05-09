
import React from "react";
import MediaView from "@/components/media/MediaView";
import { useKidsContent } from "@/hooks/kids/useKidsContent";
import { Baby } from "lucide-react";

const Kids = () => {
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

  return (
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
    >
      <div className="mb-8 bg-gradient-to-b from-purple-900/70 to-black/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Baby size={32} className="text-pink-400" />
          <h2 className="text-2xl font-bold text-white">Espaço Infantil</h2>
        </div>
        <p className="text-gray-200 mb-4">
          Um mundo de diversão e aprendizado para os pequenos! Aqui você encontra conteúdos 
          educativos e divertidos para toda a família, com classificação indicativa adequada para crianças.
        </p>
      </div>
    </MediaView>
  );
};

export default Kids;
