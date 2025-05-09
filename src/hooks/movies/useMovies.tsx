
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { useMovieLoader } from "./useMovieLoader";
import { useMoviePagination } from "./useMoviePagination";
import { useMovieSearch } from "./useMovieSearch";
import { useMovieFilters } from "./useMovieFilters";

export const useMovies = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  
  // Carregar dados iniciais
  const { 
    initialMovies, 
    trendingMovies, 
    topRatedMovies, 
    recentMovies,
    isLoadingInitial,
    isLoadingTrending,
    isLoadingTopRated,
    isLoadingRecent
  } = useMovieLoader();
  
  // Configurar paginação
  const { 
    page, 
    hasMore, 
    isLoadingMore, 
    loadMoreMovies, 
    resetPagination 
  } = useMoviePagination({ setMovies });
  
  // Configurar busca
  const { 
    searchQuery, 
    isSearching, 
    handleSearch 
  } = useMovieSearch({ 
    setMovies, 
    initialMovies, 
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
  } = useMovieFilters({ 
    initialMovies, 
    setMovies, 
    isSearching 
  });
  
  // Definir filmes iniciais quando carregados
  useEffect(() => {
    if (initialMovies && initialMovies.length > 0 && !isSearching && !isFiltering) {
      setMovies(initialMovies);
    }
  }, [initialMovies, isSearching, isFiltering]);

  return {
    movies,
    trendingMovies,
    topRatedMovies,
    recentMovies,
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
    loadMoreMovies: () => loadMoreMovies(isSearching, isFiltering),
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
