
import { useSeries } from "@/hooks/series/useSeries";
import MediaView from "@/components/media/MediaView";

const SeriesPage = () => {
  const {
    series,
    trendingSeries,
    topRatedSeries,
    recentSeries,
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
    loadMoreSeries,
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useSeries();

  return (
    <MediaView
      title="Séries Dubladas em Português"
      type="tv"
      mediaItems={series}
      trendingItems={trendingSeries}
      topRatedItems={topRatedSeries}
      recentItems={recentSeries}
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
      onLoadMore={loadMoreSeries}
      onResetFilters={resetFilters}
    />
  );
};

export default SeriesPage;
