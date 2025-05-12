
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "../services/tmdb/trending";
import { fetchTopRated } from "../services/tmdb/topRated";
import { fetchUpcoming } from "../services/tmdb/upcoming";
import MediaView from "../components/media/MediaView";
import type { MediaItem } from "../types/movie";
import { useMovies } from "../hooks/movies/useMovies";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

  const { data: trending = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrending()
  });

  const { data: topRated = [], isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRated"],
    queryFn: () => fetchTopRated()
  });

  const { data: upcoming = [], isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => fetchUpcoming()
  });

  const handleMediaClick = (media: MediaItem) => {
    if (!media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };

  // Update handleLoadMore to make it compatible with expected signature
  const handleLoadMore = () => {
    console.log(`Loading more content`);
    loadMoreMovies();
  };

  return (
    <MediaView
      title="Bem-vindo ao SuperFlix"
      type="movie"
      mediaItems={[]}
      trendingItems={trending}
      topRatedItems={topRated}
      recentItems={upcoming}
      isLoading={isLoadingTrending || isLoadingTopRated || isLoadingUpcoming}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={!!yearFilter || !!ratingFilter}
      isSearching={!!searchQuery}
      page={1}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={handleLoadMore}
      onResetFilters={() => {
        setYearFilter("");
        setRatingFilter("");
        setSearchQuery("");
      }}
      onMediaClick={handleMediaClick}
    />
  );
};

export default Home;
