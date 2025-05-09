
import { useState } from "react";
import { toast } from "sonner";
import { MediaItem, Movie } from "@/types/movie";
import { searchMedia } from "@/services/tmdbApi";

interface UseMovieSearchProps {
  setMovies: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  initialMovies: MediaItem[];
  resetPagination: () => void;
}

export const useMovieSearch = ({ 
  setMovies, 
  initialMovies, 
  resetPagination 
}: UseMovieSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Função de busca
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setMovies(initialMovies);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const movieResults = results.filter((item) => item.media_type === "movie") as Movie[];
      setMovies(movieResults);
      resetPagination();
      
      if (movieResults.length === 0) {
        toast.info("Nenhum filme encontrado para sua pesquisa.");
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
