
import { useState } from "react";
import { useHomePageData } from "../useHomePageData";
import { useMovies } from "../movies/useMovies";
import { MediaItem } from "@/types/movie";

export const useContentSections = () => {
  const [currentSection, setCurrentSection] = useState<string>("movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    trialEnd,
    featuredMedia,
    recommendations,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    popularSeries,
    recentAnimes,
    isLoading,
    hasError,
    handleSearch: originalHandleSearch,
  } = useHomePageData();

  // Add hook for loading more content
  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

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
      const results = await originalHandleSearch(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle loading more content for a specific section
  const handleLoadMoreSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    console.log(`Loading more content for section: ${sectionId}`);
    loadMoreMovies();
  };
  
  return {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    trialEnd,
    featuredMedia,
    recommendations,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    popularSeries,
    recentAnimes,
    movies,
    isLoading,
    isLoadingMore,
    hasMore,
    hasError,
    searchQuery,
    searchResults,
    isSearching,
    currentSection,
    handleSearch,
    handleLoadMoreSection,
    setSearchQuery,
    setSearchResults,
    setIsSearching
  };
};
