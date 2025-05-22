
import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MediaView from "@/components/home/MediaView";
import { MediaItem } from "@/types/movie";
import { fetchAnime, fetchTopRatedAnime, fetchTrendingAnime, fetchRecentAnime } from "@/services/tmdb/anime";
import { useAuth } from "@/contexts/AuthContext";
import AnimeCarousel from "@/components/anime/AnimeCarousel";
import { useAnimeLoader } from "@/hooks/anime/useAnimeLoader";

const Animes: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Get anime recommendations from our loader
  const { recommendedAnimes, trendingAnimes, topRatedAnimes, recentAnimes } = useAnimeLoader();

  // Function to filter animes without image
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
    refetch: refetchAnimes
  } = useInfiniteQuery({
    queryKey: ["animes", yearFilter, ratingFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchAnime(pageParam);
        return {
          results: result || [],
          page: pageParam,
          total_pages: 20
        };
      } catch (error) {
        console.error("Error fetching animes:", error);
        return {
          results: [],
          page: pageParam,
          total_pages: 0
        };
      }
    },
    getNextPageParam: (lastPage) => {
      // Add comprehensive safety checks
      if (!lastPage) return undefined;
      if (!lastPage.results || !Array.isArray(lastPage.results) || lastPage.results.length === 0) return undefined;
      const totalPages = lastPage.total_pages || 0;
      if (lastPage.page >= totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Buscar os animes em alta (trending)
  const {
    data: trendingPages,
    fetchNextPage: fetchNextTrendingPage,
    hasNextPage: hasNextTrendingPage,
    isFetchingNextPage: isFetchingNextTrendingPage,
    refetch: refetchTrending
  } = useInfiniteQuery({
    queryKey: ["trendingAnimes"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchTrendingAnime(pageParam, 20);
        return {
          results: result || [],
          page: pageParam,
          total_pages: 5
        };
      } catch (error) {
        console.error("Error fetching trending animes:", error);
        return {
          results: [],
          page: pageParam,
          total_pages: 0
        };
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.results || !Array.isArray(lastPage.results) || lastPage.results.length === 0) return undefined;
      const totalPages = lastPage.total_pages || 0;
      if (lastPage.page >= totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Buscar animes recentes
  const {
    data: recentPages,
    fetchNextPage: fetchNextRecentPage,
    hasNextPage: hasNextRecentPage,
    isFetchingNextPage: isFetchingNextRecentPage,
    refetch: refetchRecent
  } = useInfiniteQuery({
    queryKey: ["recentAnimes"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchRecentAnime(pageParam, 20);
        return {
          results: result || [],
          page: pageParam,
          total_pages: 3
        };
      } catch (error) {
        console.error("Error fetching recent animes:", error);
        return {
          results: [],
          page: pageParam,
          total_pages: 0
        };
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.results || !Array.isArray(lastPage.results) || lastPage.results.length === 0) return undefined;
      const totalPages = lastPage.total_pages || 0;
      if (lastPage.page >= totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Buscar animes mais bem avaliados
  const {
    data: topRatedPages,
    fetchNextPage: fetchNextTopRatedPage,
    hasNextPage: hasNextTopRatedPage, 
    isFetchingNextPage: isFetchingNextTopRatedPage,
    refetch: refetchTopRated
  } = useInfiniteQuery({
    queryKey: ["topRatedAnimesFull"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchTopRatedAnime(pageParam, 20);
        return {
          results: result || [],
          page: pageParam,
          total_pages: 5
        };
      } catch (error) {
        console.error("Error fetching top rated animes:", error);
        return {
          results: [],
          page: pageParam,
          total_pages: 0
        };
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.results || !Array.isArray(lastPage.results) || lastPage.results.length === 0) return undefined;
      const totalPages = lastPage.total_pages || 0;
      if (lastPage.page >= totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add useEffect to handle refetching when user auth state changes
  useEffect(() => {
    if (user && !authLoading) {
      refetchAnimes();
      refetchTrending();
      refetchTopRated();
      refetchRecent();
    }
  }, [user, authLoading, refetchAnimes, refetchTrending, refetchTopRated, refetchRecent]);

  // Obter todos os animes das páginas
  const allAnimes = React.useMemo(() => {
    // Add safety check for animePages
    if (!animePages?.pages) return [];
    
    return filterAnimesWithoutImage(animePages.pages.flatMap(page => page?.results || []) || []);
  }, [animePages?.pages]);

  const trendingItems = React.useMemo(() => {
    if (!trendingPages?.pages) return [];
    
    return filterAnimesWithoutImage(trendingPages.pages.flatMap(page => page?.results || []) || []);
  }, [trendingPages?.pages]);

  const topRatedItems = React.useMemo(() => {
    if (!topRatedPages?.pages) return [];
    
    return filterAnimesWithoutImage(topRatedPages.pages.flatMap(page => page?.results || []) || []);
  }, [topRatedPages?.pages]);

  const recentItems = React.useMemo(() => {
    if (!recentPages?.pages) return [];
    
    return filterAnimesWithoutImage(recentPages.pages.flatMap(page => page?.results || []) || []);
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

  // Handlers for loading more content in each section
  const handleLoadMoreTrending = () => {
    console.log("Loading more trending animes");
    fetchNextTrendingPage();
  };

  const handleLoadMoreTopRated = () => {
    console.log("Loading more top rated animes");
    fetchNextTopRatedPage();
  };

  const handleLoadMoreRecent = () => {
    console.log("Loading more recent animes");
    fetchNextRecentPage();
  };

  const isLoading = authLoading || queryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar animes</h2>
          <p>Tente novamente mais tarde</p>
          <button 
            onClick={() => refetchAnimes()}
            className="mt-4 px-4 py-2 bg-netflix-red text-white rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Add carousel for anime recommendations */}
      {recommendedAnimes && recommendedAnimes.length > 0 && !isSearching && !isFiltering && (
        <div className="mb-8">
          <AnimeCarousel 
            animes={recommendedAnimes.slice(0, 5)} 
            onAnimeClick={handleMediaClick}
          />
        </div>
      )}
      
      <MediaView
        title="Animes"
        type="anime"
        mediaItems={allAnimes}
        trendingItems={trendingItems}
        topRatedItems={topRatedItems}
        recentItems={recentItems}
        isLoading={isLoading}
        isFiltering={isFiltering}
        isSearching={isSearching}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onYearFilterChange={handleYearFilterChange}
        onRatingFilterChange={handleRatingFilterChange}
        onResetFilters={handleResetFilters}
        onMediaClick={handleMediaClick}
        onLoadMoreTrending={handleLoadMoreTrending}
        onLoadMoreTopRated={handleLoadMoreTopRated}
        onLoadMoreRecent={handleLoadMoreRecent}
        hasMoreTrending={hasNextTrendingPage}
        hasMoreTopRated={hasNextTopRatedPage}
        hasMoreRecent={hasNextRecentPage}
        trendingTitle="Em Alta"
        topRatedTitle="Mais Bem Avaliados"
        recentTitle="Lançamentos Recentes"
        sectionLoading={isFetchingNextPage || isFetchingNextTrendingPage || isFetchingNextTopRatedPage || isFetchingNextRecentPage}
      />
    </div>
  );
};

export default Animes;
