
import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MediaView from "@/components/media/MediaView";
import { MediaItem } from "@/types/movie";
import { fetchAnime, fetchTopRatedAnime } from "@/services/tmdb/anime";
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
  const { recommendedAnimes } = useAnimeLoader();

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
      if (!lastPage.results || lastPage.results.length === 0) return undefined;
      if (lastPage.page >= (lastPage.total_pages || 0)) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Buscar TOP 100 animes
  const {
    data: top100Pages,
    fetchNextPage: fetchNextTop100Page,
    hasNextPage: hasNextTop100Page,
    isFetchingNextPage: isFetchingNextTop100Page,
    refetch: refetchTop100
  } = useInfiniteQuery({
    queryKey: ["top100Animes"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchTopRatedAnime(pageParam, 20);
        return {
          results: result || [],
          page: pageParam,
          total_pages: 5
        };
      } catch (error) {
        console.error("Error fetching top 100 animes:", error);
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
      if (!lastPage.results || lastPage.results.length === 0) return undefined;
      if (lastPage.page >= (lastPage.total_pages || 0)) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Buscar animes mais bem avaliados
  const { 
    data: topRatedAnimes,
    refetch: refetchTopRated
  } = useInfiniteQuery({
    queryKey: ["topRatedAnimes"],
    queryFn: async () => {
      try {
        const result = await fetchTopRatedAnime(1, 6);
        return {
          results: result || [],
          page: 1,
          total_pages: 1
        };
      } catch (error) {
        console.error("Error fetching top rated animes:", error);
        return {
          results: [],
          page: 1,
          total_pages: 0
        };
      }
    },
    getNextPageParam: () => undefined, // No pagination needed for this query
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
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        const currentDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
        
        // In a real application, use the fetchRecentAnime function here instead
        // This is just a placeholder to maintain the structure of the existing code
        const result = await fetchAnime(pageParam); // Using fetchAnime as a fallback
        
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
      // Add comprehensive safety checks
      if (!lastPage) return undefined;
      if (!lastPage.results || lastPage.results.length === 0) return undefined;
      if (lastPage.page >= (lastPage.total_pages || 0)) return undefined;
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
      refetchTop100();
      refetchTopRated();
      refetchRecent();
    }
  }, [user, authLoading, refetchAnimes, refetchTop100, refetchTopRated, refetchRecent]);

  // Obter todos os animes das páginas
  const allAnimes = React.useMemo(() => {
    // Add safety check for animePages
    if (!animePages?.pages) return [];
    
    return filterAnimesWithoutImage(animePages.pages.flatMap(page => page?.results || []) || []);
  }, [animePages?.pages]);

  const top100Animes = React.useMemo(() => {
    // Add safety check for top100Pages
    if (!top100Pages?.pages) return [];
    
    return filterAnimesWithoutImage(top100Pages.pages.flatMap(page => page?.results || []) || []);
  }, [top100Pages?.pages]);

  const recentAnimes = React.useMemo(() => {
    // Add safety check for recentPages
    if (!recentPages?.pages) return [];
    
    return filterAnimesWithoutImage(recentPages.pages.flatMap(page => page?.results || []) || []);
  }, [recentPages?.pages]);

  const trendingItems = React.useMemo(() => {
    // Add safety check for topRatedAnimes
    if (!topRatedAnimes?.pages?.[0]?.results) return [];
    
    return filterAnimesWithoutImage(topRatedAnimes.pages[0].results || []);
  }, [topRatedAnimes?.pages]);

  const topRatedItems = React.useMemo(() => {
    // Add safety check for topRatedAnimes
    if (!topRatedAnimes?.pages?.[0]?.results) return [];
    
    return filterAnimesWithoutImage(topRatedAnimes.pages[0].results || []);
  }, [topRatedAnimes?.pages]);

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
    fetchNextPage();
  };

  const handleLoadMoreTopRated = () => {
    console.log("Loading more top rated animes");
    fetchNextTop100Page();
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
        recentItems={recentAnimes}
        isLoading={isLoading}
        isFiltering={isFiltering}
        isSearching={isSearching}
        yearFilter={yearFilter}
        ratingFilter={ratingFilter}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onYearFilterChange={handleYearFilterChange}
        onRatingFilterChange={handleRatingFilterChange}
        onLoadMoreTrending={handleLoadMoreTrending}
        onLoadMoreTopRated={handleLoadMoreTopRated}
        onLoadMoreRecent={handleLoadMoreRecent}
        hasMoreTrending={hasNextPage}
        hasMoreTopRated={hasNextTop100Page}
        hasMoreRecent={hasNextRecentPage}
        onResetFilters={handleResetFilters}
        onMediaClick={handleMediaClick}
      />
    </div>
  );
};

export default Animes;
