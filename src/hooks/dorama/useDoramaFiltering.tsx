
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/movie";
import { fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaFilteringProps {
  applyFilters: (contentList: MediaItem[], yearFilter: string, genreFilter: string) => MediaItem[];
  setDoramas: React.Dispatch<React.SetStateAction<MediaItem[]>>;
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
  const [cachedContent, setCachedContent] = useState<MediaItem[]>([]);
  
  // Carregar e armazenar em cache o conteúdo inicial
  useEffect(() => {
    const loadInitialContent = async () => {
      try {
        const initialContent = await fetchKoreanDramas(1, 50);
        setCachedContent(initialContent);
      } catch (error) {
        console.error("Erro ao armazenar conteúdo em cache:", error);
      }
    };
    
    if (!isLoadingInitial && cachedContent.length === 0) {
      loadInitialContent();
    }
  }, [isLoadingInitial, cachedContent.length]);
  
  // Aplicar filtros quando eles mudarem
  useEffect(() => {
    const filterContentWithCriteria = async () => {
      if (cachedContent.length === 0) return;
      
      setIsFiltering(true);
      try {
        // Usar dados em cache para filtrar, o que torna a filtragem mais rápida
        const filtered = applyFilters(cachedContent, yearFilter, genreFilter);
        setDoramas(filtered);
        resetPagination();
        
        if (filtered.length === 0) {
          toast.info("Nenhum conteúdo encontrado com estes filtros.");
        }
      } catch (error) {
        console.error("Erro ao filtrar conteúdo:", error);
        toast.error("Erro ao aplicar filtros");
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Aplicar filtros apenas se não estivermos em estado de busca e tivermos dados em cache
    if (!isSearching && !isLoadingInitial && cachedContent.length > 0 && 
        (yearFilter !== "all" || genreFilter !== "all")) {
      filterContentWithCriteria();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial, cachedContent, resetPagination, setDoramas]);

  // Resetar todos os filtros
  const resetFilters = () => {
    setYearFilter("all");
    setGenreFilter("all");
    
    // Resetar para os conteúdos iniciais sem filtros
    if (cachedContent.length > 0) {
      const filtered = applyFilters(cachedContent, "all", "all");
      setDoramas(filtered);
      resetPagination();
    } else {
      fetchKoreanDramas(1, 50).then(initialContent => {
        const filtered = applyFilters(initialContent, "all", "all");
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
