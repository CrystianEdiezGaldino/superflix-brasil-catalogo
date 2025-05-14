
import { useState } from "react";
import { MediaItem } from "@/types/movie";

interface UseAnimePaginationProps {
  setAnimes: (animes: MediaItem[] | ((prevAnimes: MediaItem[]) => MediaItem[])) => void;
  fetchAnimeBatch?: (batchIndex: number) => Promise<MediaItem[]>;
  totalAnimes?: number;
}

export const useAnimePagination = ({ 
  setAnimes,
  fetchAnimeBatch,
  totalAnimes = 0
}: UseAnimePaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;

  const loadMoreAnimes = async (isSearching: boolean, isFiltering: boolean) => {
    if (isLoadingMore || isSearching || isFiltering) return;
    if (!hasMore) return;
    if (!fetchAnimeBatch) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page;
      
      // Check if we've reached the end of our anime list
      if (totalAnimes > 0 && page * ITEMS_PER_PAGE >= totalAnimes) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }
      
      const newAnimes = await fetchAnimeBatch(page);
      
      if (newAnimes.length > 0) {
        setAnimes((prevAnimes: MediaItem[]) => [...prevAnimes, ...newAnimes]);
        setPage(nextPage + 1);
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error loading more animes:", error);
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
    loadMoreAnimes,
    resetPagination
  };
};
