
import { useState, useCallback, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { 
  fetchDoramas, 
  fetchPopularKoreanDramas, 
  fetchTopRatedKoreanDramas, 
  fetchKoreanMovies 
} from '@/services/tmdbApi';

export const useDoramaLoader = (initialLoad = true) => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [popularDoramas, setPopularDoramas] = useState<MediaItem[]>([]);
  const [topRatedDoramas, setTopRatedDoramas] = useState<MediaItem[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<MediaItem[]>([]);
  
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadDoramas = useCallback(async (resetData = false) => {
    try {
      setIsLoadingInitial(true);
      setError(null);
      
      const currentPage = resetData ? 1 : page;
      const response = await fetchDoramas(currentPage);
      
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setDoramas(prev => resetData ? response : [...prev, ...response]);
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doramas');
      console.error('Error loading doramas:', err);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [page]);

  // Load popular doramas
  const loadPopularDoramas = useCallback(async () => {
    try {
      setIsLoadingPopular(true);
      const data = await fetchPopularKoreanDramas();
      setPopularDoramas(data);
    } catch (err) {
      console.error('Error loading popular doramas:', err);
    } finally {
      setIsLoadingPopular(false);
    }
  }, []);

  // Load top rated doramas
  const loadTopRatedDoramas = useCallback(async () => {
    try {
      setIsLoadingTopRated(true);
      const data = await fetchTopRatedKoreanDramas();
      setTopRatedDoramas(data);
    } catch (err) {
      console.error('Error loading top rated doramas:', err);
    } finally {
      setIsLoadingTopRated(false);
    }
  }, []);

  // Load Korean movies
  const loadKoreanMovies = useCallback(async () => {
    try {
      setIsLoadingMovies(true);
      const data = await fetchKoreanMovies();
      setKoreanMovies(data);
    } catch (err) {
      console.error('Error loading Korean movies:', err);
    } finally {
      setIsLoadingMovies(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoad) {
      loadDoramas(true);
      loadPopularDoramas();
      loadTopRatedDoramas();
      loadKoreanMovies();
    }
  }, [initialLoad, loadDoramas, loadPopularDoramas, loadTopRatedDoramas, loadKoreanMovies]);

  const reloadDoramas = () => {
    setPage(1);
    setHasMore(true);
    loadDoramas(true);
    loadPopularDoramas();
    loadTopRatedDoramas();
    loadKoreanMovies();
  };

  return {
    doramas,
    setDoramas,
    popularDoramas,
    topRatedDoramas,
    koreanMovies,
    isLoading: isLoadingInitial,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    isLoadingMovies,
    error,
    hasMore,
    loadDoramas,
    reloadDoramas
  };
};

export default useDoramaLoader;
