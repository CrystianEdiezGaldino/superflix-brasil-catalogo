
import { useState } from "react";
import { MediaItem } from "@/types/movie";

export const useSectionSearch = (searchMediaFn: (query: string) => Promise<MediaItem[]>) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Enhanced search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (!query || query.trim() === "") {
      // If query is empty, clear search results but don't show loader
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    try {
      const results = await searchMediaFn(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    setSearchQuery,
    setSearchResults,
    setIsSearching
  };
};
