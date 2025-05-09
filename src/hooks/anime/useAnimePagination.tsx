
import { useState } from "react";
import { toast } from "sonner";
import { fetchAnime } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

interface UseAnimePaginationProps {
  setAnimes: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useAnimePagination = ({ setAnimes }: UseAnimePaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerLoad = 24;

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
  };

  const loadMoreAnimes = async (isSearching: boolean, isFiltering: boolean) => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newAnimes = await fetchAnime(nextPage, itemsPerLoad);
      
      if (newAnimes.length === 0) {
        setHasMore(false);
        return;
      }
      
      setAnimes((prevAnimes) => [...prevAnimes, ...newAnimes]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais animes:", error);
      toast.error("Erro ao carregar mais animes.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    page,
    hasMore,
    isLoadingMore,
    loadMoreAnimes,
    resetPagination
  };
};
