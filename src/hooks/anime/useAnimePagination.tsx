
import { useState } from "react";
import { MediaItem } from "@/types/movie";

interface UseAnimePaginationProps {
  setAnimes: (animes: MediaItem[]) => void;
  allAnimeIds?: number[];
  fetchAnimeByIds?: (ids: number[], limit: number) => Promise<MediaItem[]>;
}

export const useAnimePagination = ({ 
  setAnimes,
  allAnimeIds = [],
  fetchAnimeByIds
}: UseAnimePaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 30;

  const loadMoreAnimes = async (isSearching: boolean, isFiltering: boolean) => {
    if (isLoadingMore || isSearching || isFiltering) return;
    if (!hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      let newAnimes: MediaItem[] = [];

      // If we have fetchAnimeByIds and allAnimeIds, use them to load more
      if (fetchAnimeByIds && allAnimeIds.length > 0) {
        const startIndex = (page * ITEMS_PER_PAGE);
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        if (startIndex >= allAnimeIds.length) {
          setHasMore(false);
          setIsLoadingMore(false);
          return;
        }
        
        const nextPageIds = allAnimeIds.slice(startIndex, endIndex);
        newAnimes = await fetchAnimeByIds(nextPageIds, ITEMS_PER_PAGE);
      }

      if (newAnimes.length > 0) {
        setAnimes(prevAnimes => [...prevAnimes, ...newAnimes]);
        setPage(nextPage);
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
