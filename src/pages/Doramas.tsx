
import { useState } from "react";
import MediaView from "@/components/media/MediaView";
import { useDoramas } from "@/hooks/useDoramas";
import DoramaSection from "@/components/doramas/DoramaSection";
import { useDoramaVideos } from "@/hooks/useDoramaVideos";

const Doramas = () => {
  const {
    doramas,
    topRatedDoramas,
    popularDoramas,
    koreanMovies,
    hasMore,
    isLoadingMore,
    yearFilter,
    genreFilter,
    isSearching,
    isFiltering,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    isLoadingMovies,
    searchQuery,
    handleSearch,
    loadMoreDoramas,
    setYearFilter,
    setGenreFilter,
    resetFilters
  } = useDoramas();

  const { videoMap } = useDoramaVideos(doramas);
  
  return (
    <MediaView
      title="Conteúdo Coreano"
      type="dorama"
      mediaItems={doramas}
      topRatedItems={topRatedDoramas}
      popularItems={popularDoramas}
      searchQuery={searchQuery}
      yearFilter={yearFilter}
      ratingFilter={genreFilter}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={1}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setGenreFilter}
      onLoadMore={loadMoreDoramas}
      onResetFilters={resetFilters}
    >
      {/* Seção específica para filmes coreanos */}
      <DoramaSection 
        title="Filmes Coreanos"
        doramas={koreanMovies}
        isLoading={isLoadingMovies}
      />
    </MediaView>
  );
};

export default Doramas;
