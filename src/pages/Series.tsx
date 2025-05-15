import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSeries } from "@/services/series";
import MediaView from "@/components/media/MediaView";
import type { Series } from "@/types/movie";

// Lista de IDs de séries disponíveis
const AVAILABLE_SERIES_IDS = [
  // ... existing code ...
];

const Series = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "year" | "name">("rating");

  const { data: newSeries = [], isLoading, isFetching } = useQuery({
    queryKey: ["series", page],
    queryFn: () => getSeries(page)
  });

  useEffect(() => {
    if (newSeries.length > 0) {
      // Filtrar apenas séries disponíveis
      const availableSeries = newSeries.filter(series => 
        AVAILABLE_SERIES_IDS.includes(series.id.toString())
      );
      setAllSeries(prev => [...prev, ...availableSeries]);
    }
  }, [newSeries]);

  const handleMediaClick = (media: Series) => {
    navigate(`/serie/${media.id}`);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const filteredSeries = allSeries
    .filter((serie) => {
      const matchesSearch = serie.name && searchQuery 
        ? serie.name.toLowerCase().includes(searchQuery.toLowerCase())
        : !searchQuery;
        
      const matchesYear = !yearFilter || 
        (serie.first_air_date && serie.first_air_date.startsWith(yearFilter));
        
      const matchesRating = !ratingFilter || 
        (serie.vote_average !== undefined && serie.vote_average >= parseFloat(ratingFilter));
        
      const matchesGenre = !selectedGenre || 
        (serie.genres && serie.genres.some(genre => genre.id.toString() === selectedGenre));
        
      return matchesSearch && matchesYear && matchesRating && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.vote_average || 0) - (a.vote_average || 0);
        case "year":
          return (b.first_air_date || "").localeCompare(a.first_air_date || "");
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

  return (
    <MediaView
      title="Séries"
      type="tv"
      mediaItems={filteredSeries}
      isLoading={isLoading}
      isLoadingMore={isFetching}
      hasMore={true}
      isFiltering={!!yearFilter || !!ratingFilter || !!selectedGenre}
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
        setSelectedGenre("");
        setSortBy("rating");
      }}
      onMediaClick={handleMediaClick}
    />
  );
};

export default Series;
