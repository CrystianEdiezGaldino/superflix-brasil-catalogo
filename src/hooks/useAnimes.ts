import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/types/media';

interface UseAnimesReturn {
  animes: MediaItem[];
  isLoading: boolean;
  error: Error | null;
  loadMore: (startIndex: number, count: number) => Promise<number>;
}

export const useAnimes = (): UseAnimesReturn => {
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['animes', page],
    queryFn: async () => {
      const response = await fetch(`/api/animes?page=${page}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar animes');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setAnimes(prev => [...prev, ...data.results]);
    }
  }, [data]);

  const loadMore = async (startIndex: number, count: number): Promise<number> => {
    if (isLoadingMore) return 0;
    
    setIsLoadingMore(true);
    try {
      const nextPage = Math.floor(startIndex / 20) + 1;
      const response = await fetch(`/api/animes?page=${nextPage}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar mais animes');
      }
      const newData = await response.json();
      
      if (newData.results.length > 0) {
        setAnimes(prev => [...prev, ...newData.results]);
        setPage(nextPage);
        return newData.results.length;
      }
      return 0;
    } catch (error) {
      console.error('Erro ao carregar mais animes:', error);
      return 0;
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    animes,
    isLoading,
    error: error as Error | null,
    loadMore
  };
}; 