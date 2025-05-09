
import { useState } from "react";
import { toast } from "sonner";
import { Series } from "@/types/movie";
import { fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaPaginationProps {
  filterDoramas: (doramaList: Series[]) => Series[];
  setDoramas: React.Dispatch<React.SetStateAction<Series[]>>;
}

export const useDoramaPagination = ({ filterDoramas, setDoramas }: UseDoramaPaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Load more doramas
  const loadMoreDoramas = async (isSearching: boolean, isFiltering: boolean) => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      const newDoramas = await fetchKoreanDramas(nextPage);
      
      // Filter to ensure only Korean doramas with images
      const filteredDoramas = filterDoramas(newDoramas);
      
      if (filteredDoramas.length === 0) {
        setHasMore(false);
        return;
      }
      
      setDoramas((prevDoramas) => [...prevDoramas, ...filteredDoramas]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais doramas:", error);
      toast.error("Erro ao carregar mais doramas.");
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
    loadMoreDoramas,
    resetPagination
  };
};
