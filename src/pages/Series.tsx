
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MediaView from "@/components/media/MediaView";
import { MediaItem, Series } from "@/types/movie";
import { 
  fetchPopularSeries, 
  fetchTopRatedSeries, 
  fetchTrendingSeries, 
  fetchRecentSeries,
  searchMedia 
} from "@/services/tmdbApi";

const SeriesPage = () => {
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [itemsPerLoad] = useState(24);

  // Buscar séries iniciais
  const { data: initialSeries, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["popularSeries", 1],
    queryFn: () => fetchPopularSeries(1, itemsPerLoad),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries em tendência
  const { data: trendingSeries, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trendingSeries"],
    queryFn: () => fetchTrendingSeries(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries mais bem avaliadas
  const { data: topRatedSeries, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedSeries"],
    queryFn: () => fetchTopRatedSeries(),
    staleTime: 1000 * 60 * 5,
  });

  // Buscar séries recentes
  const { data: recentSeries, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentSeries"],
    queryFn: () => fetchRecentSeries(),
    staleTime: 1000 * 60 * 5,
  });

  // Definir séries iniciais quando carregadas
  useEffect(() => {
    if (initialSeries) {
      setSeries(initialSeries);
    }
  }, [initialSeries]);

  // Função de busca
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      if (initialSeries) setSeries(initialSeries);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const seriesResults = results.filter((item) => item.media_type === "tv") as Series[];
      setSeries(seriesResults);
      setPage(1);
      setHasMore(seriesResults.length >= itemsPerLoad);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  // Aplicar filtros
  const applyFilters = useCallback((seriesList: MediaItem[]) => {
    let filteredSeries = [...seriesList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredSeries = filteredSeries.filter((series) => {
        const releaseYear = 'first_air_date' in series && series.first_air_date 
          ? new Date(series.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredSeries = filteredSeries.filter((series) => {
        return series.vote_average >= rating;
      });
    }

    return filteredSeries;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!initialSeries || isSearching) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialSeries);
    setSeries(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, initialSeries, applyFilters, isSearching]);

  // Carregar mais séries
  const loadMoreSeries = async () => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newSeries = await fetchPopularSeries(nextPage, itemsPerLoad);
      
      if (newSeries.length === 0) {
        setHasMore(false);
        return;
      }
      
      setSeries((prevSeries) => [...prevSeries, ...newSeries]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais séries:", error);
      toast.error("Erro ao carregar mais séries.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (initialSeries) setSeries(initialSeries);
  };

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
