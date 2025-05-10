import { useNavigate } from "react-router-dom";
import MediaView from "@/components/media/MediaView";
import { useMovies } from "@/hooks/movies/useMovies";
import type { Movie } from "@/types/movie";

const Movies = () => {
  const navigate = useNavigate();
  const {
    movies,
    trendingMovies,
    topRatedMovies,
    recentMovies,
    searchQuery,
    yearFilter,
    ratingFilter,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreMovies,
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useMovies();

  const handleMediaClick = (media: Movie) => {
    navigate(`/filme/${media.id}`);
  };

  return (
    <MediaView
      title="Filmes Dublados em Português"
      type="movie"
      mediaItems={movies}
      trendingItems={trendingMovies}
      topRatedItems={topRatedMovies}
      recentItems={recentMovies}
      searchQuery={searchQuery}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={1}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={loadMoreMovies}
      onResetFilters={resetFilters}
      onMediaClick={handleMediaClick}
    />
  );
};

export default Movies;
