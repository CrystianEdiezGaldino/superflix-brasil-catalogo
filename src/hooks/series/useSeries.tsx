
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { useSeriesLoader } from "./useSeriesLoader";
import { useSeriesPagination } from "./useSeriesPagination";
import { useSeriesSearch } from "./useSeriesSearch";
import { useSeriesFilters } from "./useSeriesFilters";

export const useSeries = () => {
  const [series, setSeries] = useState<MediaItem[]>([]);
  
  // Carregar dados iniciais
  const { 
    initialSeries, 
    trendingSeries, 
    topRatedSeries, 
    recentSeries,
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent
  } = useSeriesLoader();
  
  // Configurar paginação
  const { 
    page, 
    hasMore, 
    isLoadingMore, 
    loadMoreSeries, 
    resetPagination 
  } = useSeriesPagination({ setSeriesList: setSeries });
  
  // Configurar busca
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useSeriesSearch({ 
    setSeriesList: setSeries, 
    initialSeries, 
    resetPagination 
  });
  
  // Configurar filtros
  const { 
    yearFilter, 
    ratingFilter, 
    isFiltering, 
    setYearFilter, 
    setRatingFilter, 
    resetFilters 
  } = useSeriesFilters({ 
    initialSeries, 
    setSeriesList: setSeries, 
    isSearching 
  });
  
  // Definir séries iniciais quando carregadas
  useEffect(() => {
    if (initialSeries && initialSeries.length > 0 && !isSearching && !isFiltering) {
      setSeries(initialSeries);
    }
  }, [initialSeries, isSearching, isFiltering]);

  return {
    series: series || [],
    trendingSeries: trendingSeries || [],
    topRatedSeries: topRatedSeries || [],
    recentSeries: recentSeries || [],
    searchQuery,
    yearFilter,
    ratingFilter,
    page,
    hasMore,
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreSeries: () => loadMoreSeries(isSearching, isFiltering),
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
