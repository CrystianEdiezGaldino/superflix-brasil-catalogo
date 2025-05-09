
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
        const initialDoramas = await fetchKoreanDramas(1, 50);
        setCachedDoramas(initialDoramas);
      } catch (error) {
        console.error("Erro ao armazenar doramas em cache:", error);
      }
    };
    
    if (!isLoadingInitial && cachedDoramas.length === 0) {
      loadInitialDoramas();
    }
  }, [isLoadingInitial, cachedDoramas.length]);
  
  // Aplicar filtros quando eles mudarem
  useEffect(() => {
    const filterDoramasWithCriteria = async () => {
      if (cachedDoramas.length === 0) return;
      
      setIsFiltering(true);
      try {
        // Usar dados em cache para filtrar, o que torna a filtragem mais rápida
        const filtered = applyFilters(cachedDoramas, yearFilter, genreFilter);
        setDoramas(filtered);
        resetPagination();
        
        if (filtered.length === 0) {
          toast.info("Nenhum dorama encontrado com estes filtros.");
        }
      } catch (error) {
        console.error("Erro ao filtrar doramas:", error);
        toast.error("Erro ao aplicar filtros");
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Aplicar filtros apenas se não estivermos em estado de busca e tivermos dados em cache
    if (!isSearching && !isLoadingInitial && cachedDoramas.length > 0 && 
        (yearFilter !== "all" || genreFilter !== "all")) {
      filterDoramasWithCriteria();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial, cachedDoramas, resetPagination, setDoramas]);

  // Resetar todos os filtros
  const resetFilters = () => {
    setYearFilter("all");
    setGenreFilter("all");
    
    // Resetar para os doramas iniciais sem filtros
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
