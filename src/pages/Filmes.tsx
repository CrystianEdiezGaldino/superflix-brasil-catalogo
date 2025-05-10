import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "@/services/tmdb/movies";
import MediaView from "@/components/media/MediaView";
import { MediaItem } from "@/types/movie";

const Filmes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const ids = [299534, 299536, 299537]; // IDs dos filmes
      return Promise.all(
        ids.map(id => fetchMovieDetails(id.toString()))
      );
    },
  });

  const handleMediaClick = (media: MediaItem) => {
    navigate(`/filme/${media.id}`);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = !yearFilter || movie.release_date?.startsWith(yearFilter);
    const matchesRating = !ratingFilter || movie.vote_average >= parseFloat(ratingFilter);
    return matchesSearch && matchesYear && matchesRating;
  });

  return (
    <MediaView
      title="Filmes"
      type="movie"
      mediaItems={filteredMovies}
      isLoading={isLoading}
      isLoadingMore={false}
      hasMore={false}
      isFiltering={!!yearFilter || !!ratingFilter}
      isSearching={!!searchQuery}
      page={1}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={() => {}}
      onResetFilters={() => {
        setYearFilter("");
        setRatingFilter("");
        setSearchQuery("");
      }}
      onMediaClick={handleMediaClick}
    />
  );
};

export default Filmes; 