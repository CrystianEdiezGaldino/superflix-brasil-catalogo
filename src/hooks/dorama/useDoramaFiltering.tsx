
import { useState, useEffect, useCallback } from 'react';
import { MediaItem, Series } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

export const useDoramaFiltering = () => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [filteredDoramas, setFilteredDoramas] = useState<MediaItem[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    genre: '',
    year: '',
    rating: '',
    country: ''
  });

  const loadDoramas = useCallback(async () => {
    try {
      const doramaData = await fetchDoramas();
      setDoramas(doramaData);
      setFilteredDoramas(doramaData);
    } catch (error) {
      console.error("Error loading doramas:", error);
    }
  }, []);

  useEffect(() => {
    loadDoramas();
  }, [loadDoramas]);

  const applyFilters = useCallback(() => {
    setIsFiltering(true);
    let results = [...doramas];

    if (filterOptions.genre) {
      results = results.filter(dorama => 
        dorama.genres?.some(genre => genre.name === filterOptions.genre)
      );
    }

    if (filterOptions.year) {
      const year = parseInt(filterOptions.year);
      results = results.filter(dorama => {
        // Check if it's a TV series or movie
        const isSeries = dorama.media_type === 'tv';
        const seriesDate = isSeries ? (dorama as Series).first_air_date : null;
        const movieDate = dorama.release_date;
        
        const releaseYear = seriesDate 
          ? new Date(seriesDate).getFullYear() 
          : movieDate
            ? new Date(movieDate).getFullYear()
            : null;
        
        return releaseYear === year;
      });
    }

    if (filterOptions.rating) {
      const minRating = parseFloat(filterOptions.rating);
      results = results.filter(dorama => dorama.vote_average >= minRating);
    }

    if (filterOptions.country) {
      results = results.filter(dorama => {
        // Check for origin country in TV series
        if (dorama.media_type === 'tv') {
          return (dorama as Series).origin_country?.includes(filterOptions.country);
        }
        return false;
      });
    }

    setFilteredDoramas(results);
    setIsFiltering(false);
  }, [doramas, filterOptions]);

  useEffect(() => {
    applyFilters();
  }, [filterOptions, applyFilters]);

  const setYearFilter = (year: string) => {
    setFilterOptions(prev => ({ ...prev, year }));
  };
  
  const setGenreFilter = (genre: string) => {
    setFilterOptions(prev => ({ ...prev, genre }));
  };

  const updateFilter = (filterType: keyof typeof filterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilterOptions({
      genre: '',
      year: '',
      rating: '',
      country: ''
    });
    setFilteredDoramas(doramas);
  };

  return {
    doramas: filteredDoramas,
    filterOptions,
    isFiltering,
    yearFilter: filterOptions.year,
    genreFilter: filterOptions.genre,
    setYearFilter,
    setGenreFilter,
    updateFilter,
    resetFilters
  };
};

export default useDoramaFiltering;
