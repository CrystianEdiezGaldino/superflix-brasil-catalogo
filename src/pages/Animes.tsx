
import { useAnimes } from "@/hooks/anime/useAnimes";
import MediaView from "@/components/media/MediaView";

const AnimesPage = () => {
  const {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    specificAnimes,
    searchQuery,
    yearFilter,
    ratingFilter,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    isFiltering,
    isSearching,
    page,
    handleSearch,
    loadMoreAnimes,
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useAnimes();

  return (
    <MediaView
      title="Animes Dublados em Português"
      type="anime"
      mediaItems={animes}
      topRatedItems={topRatedAnimes}
      trendingItems={trendingAnimes}
      recentItems={recentAnimes}
      popularItems={specificAnimes}
      searchQuery={searchQuery}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={loadMoreAnimes}
      onResetFilters={resetFilters}
    />
  );
};

export default AnimesPage;
