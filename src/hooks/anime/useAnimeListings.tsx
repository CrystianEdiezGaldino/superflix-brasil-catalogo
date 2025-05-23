
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/types/movie';
import { fetchAnimeData, fetchSuperflixAnimeIds } from '@/services/anime/animeFetcher';
import { organizeSections, isValidAnime } from '@/utils/animeUtils';
import { usePagination } from './usePagination';

interface UseAnimeListingsProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export const useAnimeListings = ({ 
  initialPage = 1,
  itemsPerPage = 20
}: UseAnimeListingsProps = {}) => {
  // Main states
  const [allAnimes, setAllAnimes] = useState<MediaItem[]>([]);
  const [sections, setSections] = useState<{
    featured: MediaItem[];
    trending: MediaItem[];
    topRated: MediaItem[];
    recent: MediaItem[];
    adult: MediaItem[];
  }>({
    featured: [],
    trending: [],
    topRated: [],
    recent: [],
    adult: []
  });
  
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // Use pagination hook
  const {
    currentPage,
    setCurrentPage,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
    displayedItems: displayedAnimes,
    setDisplayedItems: setDisplayedAnimes,
    loadMoreFromExisting
  } = usePagination({ initialPage, itemsPerPage });

  // Fetch animes from TMDB
  const { data: tmdbData, isLoading: isTmdbLoading } = useQuery({
    queryKey: ['tmdb-animes', currentPage],
    queryFn: () => fetchAnimeData(currentPage),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  // Fetch Superflix list
  const { data: superflixData } = useQuery({
    queryKey: ['superflix-animes'],
    queryFn: fetchSuperflixAnimeIds,
    staleTime: 1000 * 60 * 10
  });

  // Combine data and organize sections
  useEffect(() => {
    if (tmdbData?.animes) {
      const combinedAnimes = [...(tmdbData.animes || [])];
      
      if (Array.isArray(superflixData) && superflixData.length > 0) {
        console.log("Superflix anime IDs:", superflixData.length);
      }
      
      const validAnimes = combinedAnimes.filter(isValidAnime);

      if (currentPage === 1) {
        setAllAnimes(validAnimes);
        
        // Organize sections
        const organizedSections = organizeSections(validAnimes);
        setSections(organizedSections);
        
        // Show first batch of animes
        setDisplayedAnimes(validAnimes.slice(0, itemsPerPage));
        setHasMore(validAnimes.length > itemsPerPage);
      } else {
        setAllAnimes(prev => {
          const newAnimes = [...prev, ...validAnimes];
          const unique = newAnimes.filter((anime, index, self) => 
            index === self.findIndex(a => a.id === anime.id)
          );
          return unique;
        });
        
        // Add new animes to displayed animes
        setDisplayedAnimes(prev => {
          const newAnimes = [...prev, ...validAnimes];
          const unique = newAnimes.filter((anime, index, self) => 
            index === self.findIndex(a => a.id === anime.id)
          );
          return unique;
        });
      }
    }
  }, [tmdbData, superflixData, currentPage, itemsPerPage, setDisplayedAnimes]);

  // Load more animes
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const startIndex = displayedAnimes.length;
      const endIndex = startIndex + itemsPerPage;
      
      // First check if we have more animes in the existing allAnimes array
      if (endIndex < allAnimes.length) {
        loadMoreFromExisting(allAnimes, startIndex);
      } else {
        // Need to fetch more animes from API
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more animes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    allAnimes,
    displayedAnimes,
    sections,
    isLoading: isTmdbLoading && currentPage === 1,
    isLoadingMore,
    hasMore,
    loadingRef,
    handleLoadMore
  };
};
