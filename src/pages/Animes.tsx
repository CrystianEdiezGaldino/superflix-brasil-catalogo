import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MediaView from "@/components/media/MediaView";
import { MediaItem } from "@/types/movie";
import { fetchAnime, fetchTopRatedAnime, fetchRecentAnime } from "@/services/tmdb/anime";
import { buildApiUrl, fetchFromApi, addMediaTypeToResults, limitResults } from "@/services/tmdb/utils";

const Animes = () => {
  const navigate = useNavigate();
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const top100ObserverRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTop100Ref = useRef<HTMLDivElement>(null);

  // Função para filtrar animes sem imagem
  const filterAnimesWithoutImage = (animes: MediaItem[]) => {
    return animes.filter(anime => anime.poster_path && anime.poster_path !== "");
  };

  // Buscar animes populares com paginação infinita
  const {
    data: animePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["animes", yearFilter, ratingFilter, searchQuery],
    queryFn: ({ pageParam = 1 }) => fetchAnime(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  // Buscar TOP 100 animes com paginação progressiva
  const {
    data: top100Pages,
    fetchNextPage: fetchNextTop100Page,
    hasNextPage: hasNextTop100Page,
    isFetchingNextPage: isFetchingNextTop100Page
  } = useInfiniteQuery({
    queryKey: ["top100Animes"],
    queryFn: ({ pageParam = 1 }) => fetchTopRatedAnime(pageParam, 20),
    getNextPageParam: (lastPage, allPages) => {
      // Continua carregando até atingir 100 animes
      return allPages.flat().length < 100 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  // Buscar animes mais bem avaliados
  const { data: topRatedAnimes } = useInfiniteQuery<MediaItem[]>({
    queryKey: ["topRatedAnimes"],
    queryFn: () => fetchTopRatedAnime(1, 6),
    getNextPageParam: () => undefined,
    initialPageParam: 1
  });

  // Buscar animes recentes do ano atual
  const {
    data: recentPages,
    fetchNextPage: fetchNextRecentPage,
    hasNextPage: hasNextRecentPage,
    isFetchingNextPage: isFetchingNextRecentPage
  } = useInfiniteQuery({
    queryKey: ["recentAnimes"],
    queryFn: ({ pageParam = 1 }) => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      
      // Formatar a data atual para o formato YYYY-MM-DD
      const currentDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
      
      const url = buildApiUrl("/discover/tv", 
        `&with_genres=16&sort_by=first_air_date.desc&language=pt-BR&with_original_language=ja&first_air_date.lte=${currentDate}&page=${pageParam}`
      );
      
      return fetchFromApi<{results?: any[]}>(url).then(data => {
        const animeWithType = addMediaTypeToResults(data.results || [], "tv");
        return limitResults(animeWithType, 20);
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Continua carregando até atingir 50 animes
      return allPages.flat().length < 50 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  // Configurar o Intersection Observer para carregamento automático do grid principal
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Configurar o Intersection Observer para carregamento automático do TOP 100
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    top100ObserverRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetchingNextTop100Page && hasNextTop100Page) {
        fetchNextTop100Page();
      }
    }, options);

    if (loadMoreTop100Ref.current) {
      top100ObserverRef.current.observe(loadMoreTop100Ref.current);
    }

    return () => {
      if (top100ObserverRef.current) {
        top100ObserverRef.current.disconnect();
      }
    };
  }, [isFetchingNextTop100Page, hasNextTop100Page, fetchNextTop100Page]);

  // Configurar o Intersection Observer para carregamento automático dos animes recentes
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const recentObserverRef = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetchingNextRecentPage && hasNextRecentPage) {
        fetchNextRecentPage();
      }
    }, options);

    const recentLoadMoreRef = document.getElementById('recentLoadMore');
    if (recentLoadMoreRef) {
      recentObserverRef.observe(recentLoadMoreRef);
    }

    return () => {
      recentObserverRef.disconnect();
    };
  }, [isFetchingNextRecentPage, hasNextRecentPage, fetchNextRecentPage]);

  // Obter todos os animes das páginas e filtrar os sem imagem
  const allAnimes = filterAnimesWithoutImage(animePages?.pages.flat() || []);
  const top100Animes = filterAnimesWithoutImage(top100Pages?.pages.flat() || []);
  const recentAnimes = filterAnimesWithoutImage(recentPages?.pages.flat() || []);

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

  return (
    <>
      <MediaView
        title="Animes"
        type="anime"
        mediaItems={allAnimes}
        trendingItems={filterAnimesWithoutImage(topRatedAnimes?.pages?.[0] || [])}
        topRatedItems={filterAnimesWithoutImage(topRatedAnimes?.pages?.[0] || [])}
        recentItems={recentAnimes}
        top100Items={top100Animes}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        hasMore={hasNextPage}
        isFiltering={isFiltering}
        isSearching={isSearching}
        page={animePages?.pages.length || 1}
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
      <div ref={loadMoreRef} className="h-10" />
      <div ref={loadMoreTop100Ref} className="h-10" />
      <div id="recentLoadMore" className="h-10" />
    </>
  );
};

export default Animes;
