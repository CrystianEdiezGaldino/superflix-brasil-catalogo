import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MediaView from "@/components/media/MediaView";
import { MediaItem } from "@/types/movie";
import { fetchAnime, fetchTopRatedAnime } from "@/services/tmdb/anime";
import { useAuth } from "@/contexts/AuthContext";

const Animes: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Função para filtrar animes sem imagem
  const filterAnimesWithoutImage = (animes: MediaItem[] = []) => {
    return animes.filter(anime => anime?.poster_path && anime.poster_path !== "");
  };

  // Buscar animes populares
  const {
    data: animePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: queryLoading,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: ["animes", yearFilter, ratingFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchAnime(pageParam);
      return {
        results: result || [],
        page: pageParam,
        total_pages: 20
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.results?.length) return undefined;
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
  });

  // Buscar TOP 100 animes
  const {
    data: top100Pages,
    fetchNextPage: fetchNextTop100Page,
    hasNextPage: hasNextTop100Page,
    isFetchingNextPage: isFetchingNextTop100Page,
  } = useInfiniteQuery({
    queryKey: ["top100Animes"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchTopRatedAnime(pageParam, 20);
      return {
        results: result || [],
        page: pageParam,
        total_pages: 5
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.results?.length) return undefined;
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
  });

  // Buscar animes mais bem avaliados
  const { 
    data: topRatedAnimes,
  } = useInfiniteQuery({
    queryKey: ["topRatedAnimes"],
    queryFn: async () => {
      const result = await fetchTopRatedAnime(1, 6);
      return {
        results: result || [],
        page: 1,
        total_pages: 1
      };
    },
    getNextPageParam: () => undefined,
    initialPageParam: 1,
    enabled: !!user && !authLoading,
  });

  // Buscar animes recentes
  const {
    data: recentPages,
    fetchNextPage: fetchNextRecentPage,
    hasNextPage: hasNextRecentPage,
    isFetchingNextPage: isFetchingNextRecentPage,
  } = useInfiniteQuery({
    queryKey: ["recentAnimes"],
    queryFn: async ({ pageParam = 1 }) => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      const currentDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
      
      const url = `/discover/tv?with_genres=16&sort_by=first_air_date.desc&language=pt-BR&with_original_language=ja&first_air_date.lte=${currentDate}&page=${pageParam}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        results: data.results || [],
        page: pageParam,
        total_pages: 3
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.results?.length) return undefined;
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
  });

  // Obter todos os animes das páginas
  const allAnimes = React.useMemo(() => {
    return filterAnimesWithoutImage(animePages?.pages?.flatMap(page => page?.results || []) || []);
  }, [animePages?.pages]);

  const top100Animes = React.useMemo(() => {
    return filterAnimesWithoutImage(top100Pages?.pages?.flatMap(page => page?.results || []) || []);
  }, [top100Pages?.pages]);

  const recentAnimes = React.useMemo(() => {
    return filterAnimesWithoutImage(recentPages?.pages?.flatMap(page => page?.results || []) || []);
  }, [recentPages?.pages]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleYearFilterChange = (year: string) => {
    setYearFilter(year);
    setIsFiltering(year !== "");
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating);
    setIsFiltering(rating !== "");
  };

  const handleResetFilters = () => {
    setYearFilter("");
    setRatingFilter("");
    setIsFiltering(false);
  };

  const handleMediaClick = (media: MediaItem) => {
    navigate(`/anime/${media.id}`);
  };

  const isLoading = authLoading || queryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar animes</h2>
          <p>Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso não autorizado</h2>
          <p>Por favor, faça login para acessar esta página</p>
        </div>
      </div>
    );
  }

  const trendingItems = filterAnimesWithoutImage(topRatedAnimes?.pages?.[0]?.results || []);
  const topRatedItems = filterAnimesWithoutImage(topRatedAnimes?.pages?.[0]?.results || []);

  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto px-4 py-8">
        <MediaView
          title="Animes"
          type="anime"
          mediaItems={allAnimes}
          trendingItems={trendingItems}
          topRatedItems={topRatedItems}
          recentItems={recentAnimes}
          top100Items={top100Animes}
          isLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
          hasMore={hasNextPage}
          isFiltering={isFiltering}
          isSearching={isSearching}
          page={animePages?.pages?.length || 1}
          yearFilter={yearFilter}
          ratingFilter={ratingFilter}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onYearFilterChange={handleYearFilterChange}
          onRatingFilterChange={handleRatingFilterChange}
          onLoadMore={fetchNextPage}
          onResetFilters={handleResetFilters}
          onMediaClick={handleMediaClick}
        />
      </div>
    </div>
  );
};

export default Animes; 