import { useState } from "react";
import { toast } from "sonner";
import { fetchPopularMovies } from "@/services/tmdb/movies";
import { MediaItem } from "@/types/movie";

interface UseMoviePaginationProps {
  setMovies: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useMoviePagination = ({ setMovies }: UseMoviePaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Carregar mais filmes
  const loadMoreMovies = async (isSearching: boolean, isFiltering: boolean) => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newMovies = await fetchPopularMovies(nextPage);
      
      if (!newMovies || newMovies.length === 0) {
        setHasMore(false);
        return;
      }
      
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais filmes:", error);
      toast.error("Erro ao carregar mais filmes.");
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
  };

  return {
    page,
    hasMore,
    isLoadingMore,
    loadMoreMovies,
    resetPagination
  };
};
