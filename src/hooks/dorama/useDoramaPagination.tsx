
import { useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/movie";
import { fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaPaginationProps {
  filterDoramas: (contentList: MediaItem[]) => MediaItem[];
  setDoramas: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const useDoramaPagination = ({ filterDoramas, setDoramas }: UseDoramaPaginationProps) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Load more doramas and Korean movies
  const loadMoreDoramas = async (isSearching: boolean, isFiltering: boolean) => {
    if (isSearching || isFiltering || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      // Carrega 30 conteúdos por vez (doramas e filmes coreanos)
      const newContent = await fetchKoreanDramas(nextPage, 30);
      
      // Filtra para garantir apenas conteúdo coreano com imagens
      const filteredContent = filterDoramas(newContent);
      
      if (filteredContent.length === 0) {
        setHasMore(false);
        toast.info("Não há mais conteúdo para carregar.");
        return;
      }
      
      setDoramas((prevContent) => [...prevContent, ...filteredContent]);
      setPage(nextPage);
      
      // Verifica se ainda existem mais conteúdos para carregar
      if (filteredContent.length < 30) {
        setHasMore(false);
        toast.info("Você chegou ao fim da lista de doramas e filmes coreanos.");
      }
      
    } catch (error) {
      console.error("Erro ao carregar mais conteúdo:", error);
      toast.error("Erro ao carregar mais conteúdo coreano.");
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
