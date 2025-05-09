
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Series } from "@/types/movie";
import { fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaFilteringProps {
  applyFilters: (doramaList: Series[], yearFilter: string, genreFilter: string) => Series[];
  setDoramas: React.Dispatch<React.SetStateAction<Series[]>>;
  resetPagination: () => void;
  isSearching: boolean;
  isLoadingInitial: boolean;
}

export const useDoramaFiltering = ({ 
  applyFilters, 
  setDoramas, 
  resetPagination,
  isSearching,
  isLoadingInitial
}: UseDoramaFilteringProps) => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Apply filters when they change
  useEffect(() => {
    const filterDoramasWithCriteria = async () => {
      setIsFiltering(true);
      try {
        // Get fresh data to apply filters
        const doramasToFilter = await fetchKoreanDramas(1);
        const filtered = applyFilters(doramasToFilter, yearFilter, genreFilter);
        setDoramas(filtered);
        resetPagination();
      } catch (error) {
        console.error("Error filtering doramas:", error);
        toast.error("Erro ao aplicar filtros");
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Only apply filters if we're not in a search state
    if (!isSearching && !isLoadingInitial) {
      filterDoramasWithCriteria();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial, resetPagination, setDoramas]);

  // Reset all filters
  const resetFilters = () => {
    setYearFilter("all");
    setGenreFilter("all");
    fetchKoreanDramas(1).then(initialDoramas => {
      const filtered = applyFilters(initialDoramas, "all", "all");
      setDoramas(filtered);
      resetPagination();
    });
  };

  return {
    yearFilter,
    genreFilter,
    isFiltering,
    setYearFilter,
    setGenreFilter,
    resetFilters
  };
};
