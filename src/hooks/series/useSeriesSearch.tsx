
import { useState } from "react";
import { toast } from "sonner";
import { searchMedia } from "@/services/tmdbApi";
import { MediaItem, Series } from "@/types/movie";

interface UseSeriesSearchProps {
  setSeriesList: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  initialSeries: MediaItem[];
  resetPagination: () => void;
}

export const useSeriesSearch = ({ 
  setSeriesList, 
  initialSeries, 
  resetPagination 
}: UseSeriesSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSeriesList(initialSeries);
      setIsSearching(false);
      resetPagination();
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      const seriesResults = results.filter((item) => item.media_type === "tv");
      setSeriesList(seriesResults);
      resetPagination();
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
