
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Series } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularDoramas, fetchTopRatedDoramas, searchMedia } from "@/services/tmdbApi";

export const useDoramas = () => {
  const [doramas, setDoramas] = useState<Series[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [topRatedDoramas, setTopRatedDoramas] = useState<Series[]>([]);
  const [popularDoramas, setPopularDoramas] = useState<Series[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(true);
  
  // Load initial doramas
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        const initialDoramas = await fetchKoreanDramas(1);
        setDoramas(initialDoramas);
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Error loading initial doramas:", error);
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, []);
  
  // Load popular and top rated doramas
  useEffect(() => {
    const loadPopularDoramas = async () => {
      try {
        const popular = await fetchPopularDoramas(6);
        setPopularDoramas(popular);
        setIsLoadingPopular(false);
      } catch (error) {
        console.error("Error loading popular doramas:", error);
        setIsLoadingPopular(false);
      }
    };
    
    const loadTopRatedDoramas = async () => {
      try {
        const topRated = await fetchTopRatedDoramas(6);
        setTopRatedDoramas(topRated);
        setIsLoadingTopRated(false);
      } catch (error) {
        console.error("Error loading top rated doramas:", error);
        setIsLoadingTopRated(false);
      }
    };
    
    loadPopularDoramas();
    loadTopRatedDoramas();
  }, []);

  // Apply filters function
  const applyFilters = useCallback((doramaList: Series[]) => {
    let filtered = [...doramaList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter((dorama) => {
        const releaseYear = dorama.first_air_date 
          ? new Date(dorama.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    // Additional filtering could be added here for genres, etc.
    if (genreFilter && genreFilter !== "all") {
      // In a real app, we'd filter by actual genre IDs from the API
      // This is just a placeholder implementation
    }

    return filtered;
  }, [yearFilter, genreFilter]);

  // Apply filters when they change
  useEffect(() => {
    const filterDoramas = async () => {
      setIsFiltering(true);
      try {
        // Get fresh data to apply filters
        const doramasToFilter = await fetchKoreanDramas(1);
        const filtered = applyFilters(doramasToFilter);
        setDoramas(filtered);
        setPage(1);
        setHasMore(true);
      } catch (error) {
        console.error("Error filtering doramas:", error);
        toast.error("Erro ao aplicar filtros");
      } finally {
        setIsFiltering(false);
      }
    };
    
    // Only apply filters if we're not in a search state
    if (!isSearching && !isLoadingInitial) {
      filterDoramas();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial]);

  // Load more doramas
  const loadMoreDoramas = async () => {
    if (isSearching || isFiltering || !hasMore) return;
    
    try {
      const nextPage = page + 1;
      const newDoramas = await fetchKoreanDramas(nextPage);
      
      if (newDoramas.length === 0) {
        setHasMore(false);
        return;
      }
      
      setDoramas((prevDoramas) => [...prevDoramas, ...newDoramas]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais doramas:", error);
      toast.error("Erro ao carregar mais doramas.");
    }
  };

  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Digite algo para pesquisar");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      // Filter for Korean dramas - in a real app, we'd have better criteria
      const doramaResults = results.filter((item) => 
        item.media_type === "tv" && 
        item.original_language === "ko"
      ) as Series[];
      
      setDoramas(doramaResults);
      setPage(1);
      setHasMore(doramaResults.length >= 20);
      setSearchQuery(query);
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilters = () => {
    setYearFilter("all");
    setGenreFilter("all");
    setSearchQuery("");
    fetchKoreanDramas(1).then(initialDoramas => {
      setDoramas(initialDoramas);
      setPage(1);
      setHasMore(true);
    });
  };

  return {
    doramas,
    topRatedDoramas,
    popularDoramas,
    page,
    hasMore,
    searchQuery,
    yearFilter,
    genreFilter,
    isSearching,
    isFiltering,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    handleSearch,
    loadMoreDoramas,
    setYearFilter,
    setGenreFilter,
    resetFilters
  };
};
