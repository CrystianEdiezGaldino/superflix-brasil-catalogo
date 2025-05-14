
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";
import { TMDB_API_URL, TMDB_API_KEY } from "@/config/tmdb";

interface AnimeSections {
  featuredAnime: MediaItem[];
  popularAnime: MediaItem[];
  newReleases: MediaItem[];
  classicAnime: MediaItem[];
  actionAnime: MediaItem[];
}

export const useAnimes = () => {
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  const [topRatedAnimes, setTopRatedAnimes] = useState<MediaItem[]>([]);
  const [trendingAnimes, setTrendingAnimes] = useState<MediaItem[]>([]);
  const [recentAnimes, setRecentAnimes] = useState<MediaItem[]>([]);
  const [seasonalAnimes, setSeasonalAnimes] = useState<MediaItem[]>([]);
  const [animeSections, setAnimeSections] = useState<AnimeSections | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Função para buscar animes populares
  const fetchPopularAnimes = useCallback(async (pageNum = 1) => {
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&with_genres=16&page=${pageNum}&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes populares");
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar animes populares:", error);
      return [];
    }
  }, []);

  // Função para buscar animes bem avaliados
  const fetchTopRatedAnimes = useCallback(async () => {
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=vote_average.desc&with_genres=16&vote_count.gte=100&page=1&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes bem avaliados");
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar animes bem avaliados:", error);
      return [];
    }
  }, []);

  // Função para buscar animes em tendência
  const fetchTrendingAnimes = useCallback(async () => {
    try {
      const response = await fetch(
        `${TMDB_API_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes em tendência");
      }
      
      const data = await response.json();
      // Filtrar apenas animes (pode ser necessário refinar este filtro)
      const animeResults = data.results.filter((item: any) => 
        item.genre_ids?.includes(16) || 
        item.original_language === 'ja'
      );
      return animeResults;
    } catch (error) {
      console.error("Erro ao buscar animes em tendência:", error);
      return [];
    }
  }, []);

  // Função para buscar animes recentes
  const fetchRecentAnimes = useCallback(async () => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];
    const toDate = currentDate.toISOString().split('T')[0];
    
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&air_date.gte=${fromDate}&air_date.lte=${toDate}&sort_by=first_air_date.desc&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes recentes");
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar animes recentes:", error);
      return [];
    }
  }, []);

  // Função para buscar animes da temporada atual
  const fetchSeasonalAnimes = useCallback(async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    let season = '';
    if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) season = 'fall';
    else season = 'winter';
    
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&first_air_date_year=${currentYear}&sort_by=popularity.desc&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes da temporada");
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar animes da temporada:", error);
      return [];
    }
  }, []);

  // Função para buscar animes por gênero
  const fetchAnimesByGenre = useCallback(async (genreId: number) => {
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16,${genreId}&sort_by=popularity.desc&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error(`Falha ao buscar animes do gênero ${genreId}`);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(`Erro ao buscar animes do gênero ${genreId}:`, error);
      return [];
    }
  }, []);

  // Função para buscar animes clássicos
  const fetchClassicAnimes = useCallback(async () => {
    const endYear = new Date().getFullYear() - 10;
    
    try {
      const response = await fetch(
        `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&first_air_date.lte=${endYear}-12-31&sort_by=popularity.desc&with_original_language=ja`
      );
      
      if (!response.ok) {
        throw new Error("Falha ao buscar animes clássicos");
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar animes clássicos:", error);
      return [];
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingInitial(true);
      
      try {
        // Carregar animes populares para a lista principal
        const popularAnimes = await fetchPopularAnimes();
        setAnimes(popularAnimes);
        
        // Carregar outras categorias
        const [topRated, trending, recent, seasonal] = await Promise.all([
          fetchTopRatedAnimes(),
          fetchTrendingAnimes(),
          fetchRecentAnimes(),
          fetchSeasonalAnimes()
        ]);
        
        setTopRatedAnimes(topRated);
        setTrendingAnimes(trending);
        setRecentAnimes(recent);
        setSeasonalAnimes(seasonal);
        
        // Carregar seções adicionais
        const [actionAnimes, classicAnimes] = await Promise.all([
          fetchAnimesByGenre(28), // ID 28 = Ação
          fetchClassicAnimes()
        ]);
        
        setAnimeSections({
          featuredAnime: trending.slice(0, 10),
          popularAnime: popularAnimes,
          newReleases: recent,
          classicAnime: classicAnimes,
          actionAnime: actionAnimes
        });
        
        setHasMore(popularAnimes.length === 20);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialData();
  }, [fetchPopularAnimes, fetchTopRatedAnimes, fetchTrendingAnimes, fetchRecentAnimes, fetchSeasonalAnimes, fetchAnimesByGenre, fetchClassicAnimes]);

  // Função para carregar mais animes
  const loadMoreAnimes = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const moreAnimes = await fetchPopularAnimes(nextPage);
      
      if (moreAnimes.length > 0) {
        setAnimes(prev => [...prev, ...moreAnimes]);
        setPage(nextPage);
        setHasMore(moreAnimes.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar mais animes:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Função para carregar mais animes para uma seção específica
  const loadMoreForSection = async (sectionId: string) => {
    if (!animeSections) return;
    
    try {
      let newItems: MediaItem[] = [];
      
      switch (sectionId) {
        case "newReleases":
          newItems = await fetchRecentAnimes();
          if (newItems.length > 0) {
            setAnimeSections({
              ...animeSections,
              newReleases: [...animeSections.newReleases, ...newItems.slice(0, 10)]
            });
          }
          break;
          
        case "classicAnime":
          newItems = await fetchClassicAnimes();
          if (newItems.length > 0) {
            setAnimeSections({
              ...animeSections,
              classicAnime: [...animeSections.classicAnime, ...newItems.slice(0, 10)]
            });
          }
          break;
          
        case "actionAnime":
          newItems = await fetchAnimesByGenre(28);
          if (newItems.length > 0) {
            setAnimeSections({
              ...animeSections,
              actionAnime: [...animeSections.actionAnime, ...newItems.slice(0, 10)]
            });
          }
          break;
          
        case "seasonalAnime":
          newItems = await fetchSeasonalAnimes();
          if (newItems.length > 0) {
            setSeasonalAnimes(prev => [...prev, ...newItems.slice(0, 10)]);
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error(`Erro ao carregar mais itens para a seção ${sectionId}:`, error);
    }
  };

  // Função para buscar animes
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setIsLoadingInitial(true);
    
    try {
      const response = await fetch(
        `${TMDB_API_URL}/search/tv?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&with_genres=16`
      );
      
      if (!response.ok) {
        throw new Error("Falha na busca de animes");
      }
      
      const data = await response.json();
      
      // Filtrar resultados para incluir apenas animes
      const animeResults = data.results.filter((item: any) => 
        item.genre_ids?.includes(16) || 
        item.original_language === 'ja'
      );
      
      setAnimes(animeResults);
      setHasMore(false);
    } catch (error) {
      console.error("Erro na busca de animes:", error);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  // Função para aplicar filtros
  const applyFilters = useCallback(async () => {
    if (!yearFilter && !ratingFilter) {
      setIsFiltering(false);
      return;
    }
    
    setIsFiltering(true);
    setIsLoadingInitial(true);
    
    try {
      let url = `${TMDB_API_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=16&with_original_language=ja`;
      
      if (yearFilter) {
        url += `&first_air_date_year=${yearFilter}`;
      }
      
      if (ratingFilter) {
        url += `&vote_average.gte=${ratingFilter}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Falha ao aplicar filtros");
      }
      
      const data = await response.json();
      setAnimes(data.results);
      setHasMore(false);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    applyFilters();
  }, [yearFilter, ratingFilter, applyFilters]);

  // Função para resetar filtros
  const resetFilters = () => {
    setYearFilter(null);
    setRatingFilter(null);
    setSearchQuery("");
    setIsFiltering(false);
    setIsSearching(false);
    setPage(1);
    
    // Recarregar dados iniciais
    fetchPopularAnimes().then(data => {
      setAnimes(data);
      setHasMore(data.length === 20);
    });
  };

  return {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    seasonalAnimes,
    animeSections,
    searchQuery,
    yearFilter,
    ratingFilter,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    isFiltering,
    isSearching,
    page,
    handleSearch,
    loadMoreAnimes,
    loadMoreForSection,
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
