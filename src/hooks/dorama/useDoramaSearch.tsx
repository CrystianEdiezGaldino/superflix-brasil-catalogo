
import { useState } from "react";
import { toast } from "sonner";
import { Series } from "@/types/movie";
import { searchMedia, fetchKoreanDramas } from "@/services/tmdbApi";

interface UseDoramaSearchProps {
  filterDoramas: (doramaList: Series[]) => Series[];
  setDoramas: React.Dispatch<React.SetStateAction<Series[]>>;
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
        fetchKoreanDramas(1).then(initialDoramas => {
          const filteredDoramas = filterDoramas(initialDoramas);
          setDoramas(filteredDoramas);
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
      // Filter for Korean doramas with images
      const doramaResults = filterDoramas(
        results.filter(item => item.media_type === "tv") as Series[]
      );
      
      setDoramas(doramaResults);
      resetPagination();
      setSearchQuery(query);
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
