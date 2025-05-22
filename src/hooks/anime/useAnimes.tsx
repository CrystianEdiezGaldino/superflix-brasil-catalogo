import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";
import { TMDB_API_URL, TMDB_API_KEY } from "@/config/tmdb";
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAnimes } from '@/services/animeService';

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
  const [yearFilter, setYearFilter] = useState<number>(0);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Query principal para todos os animes
  const {
    data: animeData,
    fetchNextPage: fetchNextAnimePage,
    hasNextPage: hasMoreAnime,
    isFetchingNextPage: isFetchingNextAnimePage,
    isLoading: isLoadingAnime,
    error: animeError
  } = useInfiniteQuery({
    queryKey: ['animes'],
    queryFn: ({ pageParam = 1 }) => fetchAnimes(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Query para animes mais bem avaliados
  const {
    data: topRatedData,
    isLoading: isLoadingTopRated,
    error: topRatedError
  } = useInfiniteQuery({
    queryKey: ['topRatedAnime'],
    queryFn: ({ pageParam = 1 }) => fetchAnimes(pageParam, 'vote_average.desc'),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Query para animes recentes
  const {
    data: recentData,
    isLoading: isLoadingRecent,
    error: recentError
  } = useInfiniteQuery({
    queryKey: ['recentAnime'],
    queryFn: ({ pageParam = 1 }) => fetchAnimes(pageParam, 'first_air_date.desc'),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

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
        // Carregar animes populares para a lista principal (50 itens)
        const [page1, page2, page3] = await Promise.all([
          fetchPopularAnimes(1),
          fetchPopularAnimes(2),
          fetchPopularAnimes(3)
        ]);
        
        const initialAnimes = [...page1, ...page2, ...page3].slice(0, 50);
        setAnimes(initialAnimes);
        
        // Carregar outras categorias (20 itens cada)
        const [topRated, trending, recent, seasonal] = await Promise.all([
          fetchTopRatedAnimes(),
          fetchTrendingAnimes(),
          fetchRecentAnimes(),
          fetchSeasonalAnimes()
        ]);
        
        setTopRatedAnimes(topRated.slice(0, 20));
        setTrendingAnimes(trending.slice(0, 20));
        setRecentAnimes(recent.slice(0, 20));
        setSeasonalAnimes(seasonal.slice(0, 20));
        
        // Carregar seções adicionais
        const [actionAnimes, classicAnimes] = await Promise.all([
          fetchAnimesByGenre(28), // ID 28 = Ação
          fetchClassicAnimes()
        ]);
        
        setAnimeSections({
          featuredAnime: trending.slice(0, 20),
          popularAnime: initialAnimes,
          newReleases: recent.slice(0, 20),
          classicAnime: classicAnimes.slice(0, 20),
          actionAnime: actionAnimes.slice(0, 20)
        });
        
        setHasMore(true);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialData();
  }, [fetchPopularAnimes, fetchTopRatedAnimes, fetchTrendingAnimes, fetchRecentAnimes, fetchSeasonalAnimes, fetchAnimesByGenre, fetchClassicAnimes]);

  // Atualizar estados quando os dados mudarem
  useEffect(() => {
    if (animeData) {
      const allAnimes = animeData.pages.flatMap(page => page.results);
      setAnimes(allAnimes);
    }
  }, [animeData]);

  useEffect(() => {
    if (topRatedData) {
      const allTopRated = topRatedData.pages.flatMap(page => page.results);
      setTopRatedAnimes(allTopRated);
    }
  }, [topRatedData]);

  useEffect(() => {
    if (recentData) {
      const allRecent = recentData.pages.flatMap(page => page.results);
      setRecentAnimes(allRecent);
    }
  }, [recentData]);

  // Função para carregar mais animes
  const loadMoreAnimes = async () => {
    if (hasMoreAnime && !isFetchingNextAnimePage) {
      await fetchNextAnimePage();
    }
  };

  // Função para carregar mais animes para uma seção específica
  const loadMoreForSection = async (sectionId: string) => {
    // Desabilitar carregamento para outras seções
    return;
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
    setYearFilter(0);
    setRatingFilter(0);
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
    hasMore: {
      anime: !!hasMoreAnime,
      topRated: false,
      recent: false
    },
    isLoading: isLoadingAnime || isLoadingTopRated || isLoadingRecent,
    isLoadingMore,
    isFiltering,
    isSearching,
    page,
    handleSearch,
    onLoadMore: {
      anime: loadMoreAnimes,
      topRated: () => {},
      recent: () => {}
    },
    error: animeError || topRatedError || recentError,
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
