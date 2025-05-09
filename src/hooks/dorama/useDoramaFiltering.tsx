
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
  const [cachedDoramas, setCachedDoramas] = useState<Series[]>([]);
  
  // Carregar e armazenar em cache os doramas iniciais
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        const initialDoramas = await fetchKoreanDramas(1, 30);
        setCachedDoramas(initialDoramas);
      } catch (error) {
        console.error("Error caching doramas:", error);
      }
    };
    
    if (!isLoadingInitial && cachedDoramas.length === 0) {
      loadInitialDoramas();
    }
  }, [isLoadingInitial, cachedDoramas.length]);
  
  // Apply filters when they change
  useEffect(() => {
    const filterDoramasWithCriteria = async () => {
      if (cachedDoramas.length === 0) return;
      
      setIsFiltering(true);
      try {
        // Usar dados em cache para filtrar, o que torna a filtragem mais rápida
        const filtered = applyFilters(cachedDoramas, yearFilter, genreFilter);
        setDoramas(filtered);
        resetPagination();
      } catch (error) {
        console.error("Error filtering doramas:", error);
        toast.error("Erro ao aplicar filtros");
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Only apply filters if we're not in a search state and have cached data
    if (!isSearching && !isLoadingInitial && cachedDoramas.length > 0) {
      filterDoramasWithCriteria();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial, cachedDoramas, resetPagination, setDoramas]);

  // Reset all filters
  const resetFilters = () => {
    setYearFilter("all");
    setGenreFilter("all");
    
    // Reset to initial doramas without filters
    if (cachedDoramas.length > 0) {
      const filtered = applyFilters(cachedDoramas, "all", "all");
      setDoramas(filtered);
      resetPagination();
    } else {
      fetchKoreanDramas(1, 30).then(initialDoramas => {
        const filtered = applyFilters(initialDoramas, "all", "all");
        setDoramas(filtered);
        resetPagination();
      });
    }
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
