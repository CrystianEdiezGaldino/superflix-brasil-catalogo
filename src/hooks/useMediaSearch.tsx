import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { searchMedia } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

export const useMediaSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchMediaWithPage = async (query: string, page: number = 1) => {
    if (!user) {
      toast.error("É necessário fazer login para pesquisar");
      navigate("/auth");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // If query is empty, clear results
      if (!query || query.trim() === "") {
        setResults([]);
        setHasMore(false);
        return;
      }
      
      const newResults = await searchMedia(query, page);
      
      // Se for a primeira página, substitui os resultados
      // Se não for, adiciona aos resultados existentes
      if (page === 1) {
        setResults(newResults);
      } else {
        setResults(prev => {
          // Evita duplicatas
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewResults = newResults.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewResults];
        });
      }
      
      setHasMore(newResults.length === 20); // Assuming 20 items per page
      setCurrentPage(page);
      
      if (newResults.length === 0 && page === 1) {
        toast.info("Nenhum resultado encontrado para sua pesquisa.");
      }
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    hasMore,
    currentPage,
    searchMedia: searchMediaWithPage
  };
};
