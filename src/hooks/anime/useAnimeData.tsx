import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/types/movie';
import { fetchAnimes, fetchTopRatedAnimes, fetchRecentAnimes, isAdultAnime } from '@/services/animeService';

// Função para verificar se o texto contém apenas caracteres japoneses
const isJapaneseOnly = (text: string) => {
  const japaneseRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+$/;
  return japaneseRegex.test(text);
};

// Função para verificar se o anime tem imagem e título válido
const isValidAnime = (anime: MediaItem) => {
  const hasImage = anime.poster_path || anime.backdrop_path;
  const title = anime.name || anime.title || '';
  return hasImage && !isJapaneseOnly(title);
};

export const useAnimeData = () => {
  const [featuredAnimes, setFeaturedAnimes] = useState<MediaItem[]>([]);
  const [recentReleases, setRecentReleases] = useState<MediaItem[]>([]);
  const [topRatedAnimes, setTopRatedAnimes] = useState<MediaItem[]>([]);
  const [adultContent, setAdultContent] = useState<MediaItem[]>([]);
  const [isAdultContentVisible, setIsAdultContentVisible] = useState(false);
  const [displayedAnimes, setDisplayedAnimes] = useState<MediaItem[]>([]);

  // Main anime listing with infinite query
  const {
    data: animesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAnimes,
    error: animesError,
  } = useInfiniteQuery({
    queryKey: ['animes'],
    queryFn: ({ pageParam = 1 }) => fetchAnimes(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 20) { // Limit to 20 pages maximum
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Query for top rated animes
  const {
    data: topRatedData,
    isLoading: isLoadingTopRated,
  } = useQuery({
    queryKey: ['topRatedAnimes'],
    queryFn: () => fetchTopRatedAnimes(1),
  });

  // Query for recent releases
  const {
    data: recentData,
    isLoading: isLoadingRecent,
  } = useQuery({
    queryKey: ['recentAnimes'],
    queryFn: () => fetchRecentAnimes(1),
  });

  // Load more animes from the current query
  const loadMoreAnimes = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("Loading next page of animes");
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Process and categorize animes
  useEffect(() => {
    if (animesData) {
      // Flatten all pages
      const allAnimes = animesData.pages.flatMap(page => page.results);
      
      // Filter valid animes first
      const validAnimes = allAnimes.filter(isValidAnime);
      
      // Separate adult content
      const safeAnimes = validAnimes.filter(anime => !isAdultAnime(anime));
      const adultAnimes = validAnimes.filter(anime => isAdultAnime(anime));
      
      // Set featured animes (high quality backdrops, good ratings)
      const featured = safeAnimes
        .filter(anime => anime.backdrop_path && anime.vote_average >= 7)
        .sort((a, b) => b.vote_average - a.vote_average || b.popularity - a.popularity)
        .slice(0, 10);
      
      setFeaturedAnimes(featured);
      setDisplayedAnimes(safeAnimes);
      setAdultContent(adultAnimes);
    }
  }, [animesData]);

  // Process top rated animes
  useEffect(() => {
    if (topRatedData && topRatedData.results) {
      setTopRatedAnimes(
        topRatedData.results
          .filter(isValidAnime)
          .filter(anime => !isAdultAnime(anime))
          .slice(0, 30)
      );
    }
  }, [topRatedData]);

  // Process recent releases
  useEffect(() => {
    if (recentData && recentData.results) {
      setRecentReleases(
        recentData.results
          .filter(isValidAnime)
          .filter(anime => !isAdultAnime(anime))
          .slice(0, 20)
      );
    }
  }, [recentData]);

  // Toggle adult content visibility
  const toggleAdultContent = useCallback((password: string) => {
    // Simple check - in a real app you would verify against user's actual password
    if (password === 'admin123' || password === 'password') {
      setIsAdultContentVisible(prev => !prev);
      return true;
    }
    return false;
  }, []);

  return {
    // Collections
    featuredAnimes,
    recentReleases,
    topRatedAnimes,
    adultContent,
    isAdultContentVisible,
    displayedAnimes,
    
    // Loading states
    isLoading: isLoadingAnimes || isLoadingTopRated || isLoadingRecent,
    isFetchingMore: isFetchingNextPage,
    
    // Pagination
    loadMoreAnimes,
    hasMore: !!hasNextPage,
    
    // Adult content handling
    toggleAdultContent,
    
    // Errors
    error: animesError
  };
};
