
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";
import { useSeriesLoader } from "./useSeriesLoader";
import { useSeriesPagination } from "./useSeriesPagination";
import { useSeriesSearch } from "./useSeriesSearch";
import { useSeriesFilters } from "./useSeriesFilters";
import { toast } from "sonner";

export const useSeries = () => {
  const [series, setSeries] = useState<MediaItem[]>([]);
  
  // Carregar dados iniciais com memoização para evitar re-renders desnecessários
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
  
  // Implementar loading de dados com tratamento de erros melhorado
  useEffect(() => {
    if (initialSeries && initialSeries.length > 0 && !isSearching && !isFiltering) {
      setSeries(initialSeries);
    } else if (!isSearching && !isFiltering && !isLoadingInitial && initialSeries?.length === 0) {
      // Se não há dados e não está carregando/filtrando, mostrar mensagem de erro
      toast.error("Não foi possível carregar a lista de séries");
    }
  }, [initialSeries, isSearching, isFiltering, isLoadingInitial]);

  // Função wrapper para carregar mais séries com tratamento de erros
  const handleLoadMoreSeries = useCallback(() => {
    try {
      loadMoreSeries(isSearching, isFiltering);
    } catch (error) {
      console.error("Erro ao carregar mais séries:", error);
      toast.error("Falha ao carregar mais séries. Tente novamente.");
    }
  }, [loadMoreSeries, isSearching, isFiltering]);

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
    loadMoreSeries: handleLoadMoreSeries,
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
