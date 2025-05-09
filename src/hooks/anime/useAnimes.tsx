
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { useAnimeLoader } from "./useAnimeLoader";
import { useAnimePagination } from "./useAnimePagination";
import { useAnimeSearch } from "./useAnimeSearch";
import { useAnimeFilters } from "./useAnimeFilters";

export const useAnimes = () => {
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  
  // Carregar dados iniciais
  const { 
    initialAnimes, 
    topRatedAnimes, 
    specificAnimes,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingSpecific 
  } = useAnimeLoader();
  
  // Configurar paginação
  const { 
    page, 
    hasMore, 
    isLoadingMore, 
    loadMoreAnimes, 
    resetPagination 
  } = useAnimePagination({ setAnimes });
  
  // Configurar busca
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useAnimeSearch({ 
    setAnimes, 
    initialAnimes, 
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
  } = useAnimeFilters({ 
    initialAnimes, 
    setAnimes, 
    isSearching 
  });
  
  // Definir animes iniciais quando carregados
  useEffect(() => {
    if (initialAnimes.length > 0 && !isSearching && !isFiltering) {
      setAnimes(initialAnimes);
    }
  }, [initialAnimes, isSearching, isFiltering]);

  return {
    animes,
    topRatedAnimes,
    specificAnimes,
    searchQuery,
    yearFilter,
    ratingFilter,
    page,
    hasMore,
    isLoadingInitial,
    isLoadingTopRated,
    isLoadingSpecific,
    isLoadingMore,
    isSearching,
    isFiltering,
    handleSearch,
    loadMoreAnimes: () => loadMoreAnimes(isSearching, isFiltering),
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
