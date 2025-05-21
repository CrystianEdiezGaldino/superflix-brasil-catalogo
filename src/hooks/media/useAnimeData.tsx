
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import { useBaseMedia } from "./useBaseMedia";
import { fetchAnime, fetchTopRatedAnime, fetchRecentAnime } from "@/services/tmdb/anime";

export const useAnimeData = () => {
  const { user, hasAccess, isUserAuthenticated } = useBaseMedia();
  
  // Verificar se temos um usuário válido antes de fazer as consultas
  const shouldFetchData = !!user && isUserAuthenticated;
  
  // Fetch anime data with infinite query
  const animeQuery = useInfiniteQuery<MediaItem[]>({
    queryKey: ["anime"],
    queryFn: ({ pageParam = 1 }) => fetchAnime(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: shouldFetchData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Fetch top rated anime with infinite query
  const topRatedAnimeQuery = useInfiniteQuery<MediaItem[]>({
    queryKey: ["topRatedAnime"],
    queryFn: ({ pageParam = 1 }) => fetchTopRatedAnime(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: shouldFetchData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Fetch recent anime with infinite query
  const recentAnimesQuery = useInfiniteQuery<MediaItem[]>({
    queryKey: ["recentAnime"],
    queryFn: ({ pageParam = 1 }) => fetchRecentAnime(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: shouldFetchData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Combine estados de loading
  const isLoading = 
    animeQuery.isPending || 
    topRatedAnimeQuery.isPending || 
    recentAnimesQuery.isPending;
  
  // Combine estados de erro
  const hasError = 
    animeQuery.isError || 
    topRatedAnimeQuery.isError || 
    recentAnimesQuery.isError;

  // Flatten pages into single arrays and ensure unique IDs
  const animeData = animeQuery.data?.pages
    .flat()
    .filter(Boolean)
    .reduce<MediaItem[]>((acc, curr) => {
      if (curr && !acc.find(item => item.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []) || [];

  const topRatedAnimeData = topRatedAnimeQuery.data?.pages
    .flat()
    .filter(Boolean)
    .reduce<MediaItem[]>((acc, curr) => {
      if (curr && !acc.find(item => item.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []) || [];

  const recentAnimesData = recentAnimesQuery.data?.pages
    .flat()
    .filter(Boolean)
    .reduce<MediaItem[]>((acc, curr) => {
      if (curr && !acc.find(item => item.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []) || [];

  return {
    animeData,
    topRatedAnimeData,
    recentAnimesData,
    isLoading,
    hasError,
    fetchNextPage: {
      anime: animeQuery.fetchNextPage,
      topRated: topRatedAnimeQuery.fetchNextPage,
      recent: recentAnimesQuery.fetchNextPage
    },
    hasNextPage: {
      anime: animeQuery.hasNextPage,
      topRated: topRatedAnimeQuery.hasNextPage,
      recent: recentAnimesQuery.hasNextPage
    },
    isFetchingNextPage: {
      anime: animeQuery.isFetchingNextPage,
      topRated: topRatedAnimeQuery.isFetchingNextPage,
      recent: recentAnimesQuery.isFetchingNextPage
    }
  };
};
