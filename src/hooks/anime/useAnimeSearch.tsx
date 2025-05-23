
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/types/movie';

interface UseAnimeSearchProps {
  allAnimes: MediaItem[];
}

export const useAnimeSearch = ({ allAnimes }: UseAnimeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [filteredAnimes, setFilteredAnimes] = useState<MediaItem[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Apply filters and search
  const applyFilters = useCallback(() => {
    // If no filters are active, return all animes
    if (!searchQuery && !yearFilter && !ratingFilter) {
      setFilteredAnimes([]);
      setIsFiltering(false);
      setIsSearching(false);
      return;
    }

    let filtered = [...allAnimes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(anime => {
        const title = (anime.title || anime.name || '').toLowerCase();
        const overview = (anime.overview || '').toLowerCase();
        return title.includes(query) || overview.includes(query);
      });
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    
    // Filter by year
    if (yearFilter) {
      filtered = filtered.filter(anime => {
        const releaseDate = anime.first_air_date || anime.release_date || '';
        const year = new Date(releaseDate).getFullYear();
        return year === yearFilter;
      });
    }
    
    // Filter by rating
    if (ratingFilter) {
      filtered = filtered.filter(anime => {
        return anime.vote_average >= ratingFilter;
      });
    }
    
    setFilteredAnimes(filtered);
    setIsFiltering(!!yearFilter || !!ratingFilter);
  }, [searchQuery, yearFilter, ratingFilter, allAnimes]);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle year filter changes
  const handleYearFilter = (year: number | null) => {
    setYearFilter(year);
  };

  // Handle rating filter changes
  const handleRatingFilter = (rating: number | null) => {
    setRatingFilter(rating);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setYearFilter(null);
    setRatingFilter(null);
    setIsFiltering(false);
    setIsSearching(false);
  };

  return {
    filteredAnimes,
    searchQuery,
    isFiltering,
    isSearching,
    handleSearch,
    handleYearFilter,
    handleRatingFilter,
    resetFilters
  };
};
