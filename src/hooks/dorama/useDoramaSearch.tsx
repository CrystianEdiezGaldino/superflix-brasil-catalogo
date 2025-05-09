
import { useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/movie";
import { searchMedia, fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaSearchProps {
  filterDoramas: (contentList: MediaItem[]) => MediaItem[];
  setDoramas: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  resetPagination: () => void;
}

export const useDoramaSearch = ({ filterDoramas, setDoramas, resetPagination }: UseDoramaSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is empty, return to initial doramas
      if (isSearching) {
        // Reset to initial state only if we were previously searching
        fetchKoreanDramas(1, 50).then(initialContent => {
          const filteredContent = filterDoramas(initialContent);
          setDoramas(filteredContent);
          resetPagination();
          setSearchQuery("");
          setIsSearching(false);
        });
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      
      // Filtra resultados da pesquisa para conteúdo coreano com imagens
      const koreanContent = filterDoramas(results);
      
      setDoramas(koreanContent);
      resetPagination();
      setSearchQuery(query);
      
      if (koreanContent.length === 0) {
        toast.info("Nenhum conteúdo encontrado para sua pesquisa.");
      } else {
        toast.success(`Encontramos ${koreanContent.length} resultados para "${query}"`);
      }
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    isSearching,
    handleSearch,
    setSearchQuery
  };
};
