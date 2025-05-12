
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSeries } from "@/services/series";
import MediaView from "@/components/media/MediaView";
import type { Series } from "@/types/movie";

const Series = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [allSeries, setAllSeries] = useState<Series[]>([]);

  const { data: newSeries = [], isLoading, isFetching } = useQuery({
    queryKey: ["series", page],
    queryFn: () => getSeries(page)
  });

  useEffect(() => {
    if (newSeries.length > 0) {
      setAllSeries(prev => [...prev, ...newSeries]);
    }
  }, [newSeries]);

  const handleMediaClick = (media: Series) => {
    navigate(`/serie/${media.id}`);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const filteredSeries = allSeries.filter((serie) => {
    // Add null/undefined checks for all properties being accessed
    const matchesSearch = serie.name && searchQuery 
      ? serie.name.toLowerCase().includes(searchQuery.toLowerCase())
      : !searchQuery; // If no search query, all items match
      
    const matchesYear = !yearFilter || 
      (serie.first_air_date && serie.first_air_date.startsWith(yearFilter));
      
    const matchesRating = !ratingFilter || 
      (serie.vote_average !== undefined && serie.vote_average >= parseFloat(ratingFilter));
      
    return matchesSearch && matchesYear && matchesRating;
  });

  return (
    <MediaView
      title="Séries"
      type="tv"
      mediaItems={filteredSeries}
      isLoading={isLoading}
      isLoadingMore={isFetching}
      hasMore={true}
      isFiltering={!!yearFilter || !!ratingFilter}
      isSearching={!!searchQuery}
      page={page}
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

export default Series;
