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
  
  // Filtra doramas que não têm imagens
  const filterDoramas = useCallback((doramaList: Series[]) => {
    return doramaList.filter(dorama => 
      // Garantir que é um dorama coreano (verificando idioma original)
      dorama.original_language === "ko" && 
      // Garantir que tem imagem (poster ou backdrop)
      (dorama.poster_path || dorama.backdrop_path)
    );
  }, []);
  
  // Load initial doramas
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        const initialDoramas = await fetchKoreanDramas(1);
        const filteredDoramas = filterDoramas(initialDoramas);
        setDoramas(filteredDoramas);
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Error loading initial doramas:", error);
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, [filterDoramas]);
  
  // Load popular and top rated doramas
  useEffect(() => {
    const loadPopularDoramas = async () => {
      try {
        const popular = await fetchPopularDoramas(6);
        const filteredPopular = filterDoramas(popular);
        setPopularDoramas(filteredPopular);
        setIsLoadingPopular(false);
      } catch (error) {
        console.error("Error loading popular doramas:", error);
        setIsLoadingPopular(false);
      }
    };
    
    const loadTopRatedDoramas = async () => {
      try {
        const topRated = await fetchTopRatedDoramas(6);
        const filteredTopRated = filterDoramas(topRated);
        setTopRatedDoramas(filteredTopRated);
        setIsLoadingTopRated(false);
      } catch (error) {
        console.error("Error loading top rated doramas:", error);
        setIsLoadingTopRated(false);
      }
    };
    
    loadPopularDoramas();
    loadTopRatedDoramas();
  }, [filterDoramas]);

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

    if (genreFilter && genreFilter !== "all") {
      // In a real app, we'd filter by actual genre IDs from the API
      // This is just a placeholder implementation
    }

    // Sempre filtrar para mostrar apenas doramas coreanos com imagens
    filtered = filterDoramas(filtered);

    return filtered;
  }, [yearFilter, genreFilter, filterDoramas]);

  // Apply filters when they change
  useEffect(() => {
    const filterDoramasWithCriteria = async () => {
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
      filterDoramasWithCriteria();
    }
  }, [yearFilter, genreFilter, applyFilters, isSearching, isLoadingInitial]);

  // Load more doramas
  const loadMoreDoramas = async () => {
    if (isSearching || isFiltering || !hasMore) return;
    
    try {
      const nextPage = page + 1;
      const newDoramas = await fetchKoreanDramas(nextPage);
      
      // Filtramos para garantir apenas doramas coreanos com imagens
      const filteredDoramas = filterDoramas(newDoramas);
      
      if (filteredDoramas.length === 0) {
        setHasMore(false);
        return;
      }
      
      setDoramas((prevDoramas) => [...prevDoramas, ...filteredDoramas]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erro ao carregar mais doramas:", error);
      toast.error("Erro ao carregar mais doramas.");
    }
  };

  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // Se a pesquisa estiver vazia, retornamos aos doramas iniciais
      if (isSearching) {
        // Reset to initial state only if we were previously searching
        fetchKoreanDramas(1).then(initialDoramas => {
          const filteredDoramas = filterDoramas(initialDoramas);
          setDoramas(filteredDoramas);
          setPage(1);
          setHasMore(true);
          setSearchQuery("");
          setIsSearching(false);
        });
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      // Filtramos para doramas coreanos com imagens
      const doramaResults = filterDoramas(
        results.filter(item => item.media_type === "tv") as Series[]
      );
      
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
      const filteredDoramas = filterDoramas(initialDoramas);
      setDoramas(filteredDoramas);
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
