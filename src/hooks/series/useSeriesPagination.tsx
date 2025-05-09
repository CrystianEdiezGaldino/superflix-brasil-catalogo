
import { useState } from "react";
import { toast } from "sonner";
import { fetchPopularSeries } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

interface UseSeriesPaginationProps {
  setSeriesList: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useSeriesPagination = ({ setSeriesList }: UseSeriesPaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerLoad = 24;

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
  };

  const loadMoreSeries = async (isSearching: boolean, isFiltering: boolean) => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newSeries = await fetchPopularSeries(nextPage, itemsPerLoad);
      
      if (newSeries.length === 0) {
        setHasMore(false);
        return;
      }
      
      setSeriesList((prevSeries) => [...prevSeries, ...newSeries]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais séries:", error);
      toast.error("Erro ao carregar mais séries.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    page,
    hasMore,
    isLoadingMore,
    loadMoreSeries,
    resetPagination
  };
};
