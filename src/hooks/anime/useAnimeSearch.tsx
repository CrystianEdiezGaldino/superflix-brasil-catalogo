
import { useState, useCallback, useEffect } from 'react';
import { MediaItem } from '@/types/movie';

interface UseAnimeSearchProps {
  allAnimes: MediaItem[];
  onResetFilters?: () => void;
}

export const useAnimeSearch = ({ allAnimes, onResetFilters }: UseAnimeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number>(0);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [filteredAnimes, setFilteredAnimes] = useState<MediaItem[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      if (isSearching) {
        setIsFiltering(yearFilter > 0 || ratingFilter > 0);
        setIsSearching(false);
      }
      return;
    }
    
    setIsSearching(true);
    setIsFiltering(true);
  }, [yearFilter, ratingFilter, isSearching]);

  // Handle year filter
  const handleYearFilter = useCallback((year: number) => {
    setYearFilter(year);
    setIsFiltering(year > 0 || ratingFilter > 0 || searchQuery !== '');
  }, [ratingFilter, searchQuery]);

  // Handle rating filter
  const handleRatingFilter = useCallback((rating: number) => {
    setRatingFilter(rating);
    setIsFiltering(yearFilter > 0 || rating > 0 || searchQuery !== '');
  }, [yearFilter, searchQuery]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setYearFilter(0);
    setRatingFilter(0);
    setIsFiltering(false);
    setIsSearching(false);
    
    if (onResetFilters) {
      onResetFilters();
    }
  }, [onResetFilters]);

  // Apply filters
  useEffect(() => {
    if (!isFiltering && !isSearching) {
      setFilteredAnimes([]);
      return;
    }

    const applyFilters = () => {
      if (!allAnimes || !Array.isArray(allAnimes)) {
        setFilteredAnimes([]);
        return;
      }
      
      let results = [...allAnimes];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(anime => {
          // Safe access to properties with fallbacks
          const title = (anime.title || anime.name || '').toLowerCase();
          const overview = (anime.overview || '').toLowerCase();
          return title.includes(query) || overview.includes(query);
        });
      }
      
      if (yearFilter > 0) {
        results = results.filter(anime => {
          const releaseYear = new Date(anime.first_air_date || anime.release_date || '').getFullYear();
          return releaseYear === yearFilter;
        });
      }
      
      if (ratingFilter > 0) {
        results = results.filter(anime => anime.vote_average >= ratingFilter);
      }
      
      setFilteredAnimes(results);
    };
    
    applyFilters();
  }, [allAnimes, searchQuery, yearFilter, ratingFilter, isFiltering, isSearching]);

  return {
    searchQuery,
    yearFilter,
    ratingFilter,
    filteredAnimes,
    isFiltering,
    isSearching,
    handleSearch,
    handleYearFilter,
    handleRatingFilter,
    resetFilters
  };
};
