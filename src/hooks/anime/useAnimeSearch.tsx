
import { useState } from "react";
import { toast } from "sonner";
import { searchMedia } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

interface UseAnimeSearchProps {
  setAnimes: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  initialAnimes: MediaItem[];
  resetPagination: () => void;
}

export const useAnimeSearch = ({ 
  setAnimes, 
  initialAnimes, 
  resetPagination 
}: UseAnimeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setAnimes(initialAnimes);
      setIsSearching(false);
      resetPagination();
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const animeResults = results.filter((item) => 
        item.media_type === "tv" && 
        (item.name?.toLowerCase().includes("anime") || 
        item.name?.match(/\bjapanese\b/i) || 
        item.name?.match(/\banime\b/i))
      );
      
      setAnimes(animeResults);
      resetPagination();
      
      if (animeResults.length === 0) {
        toast.info("Nenhum anime encontrado para sua pesquisa.");
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
    handleSearch
  };
};
