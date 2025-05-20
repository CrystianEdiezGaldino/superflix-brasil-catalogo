
import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/types/movie';
import { fetchDoramas } from '@/services/tmdbApi';

export const useDoramaFiltering = (initialDoramas: MediaItem[] = []) => {
  const [doramas, setDoramas] = useState<MediaItem[]>(initialDoramas);
  const [filteredDoramas, setFilteredDoramas] = useState<MediaItem[]>(initialDoramas);
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
    if (initialDoramas.length === 0) {
      loadDoramas();
    }
  }, [initialDoramas, loadDoramas]);

  const applyFilters = useCallback(() => {
    let results = [...doramas];

    if (filterOptions.genre) {
      results = results.filter(dorama => 
        dorama.genres?.some(genre => genre.name === filterOptions.genre)
      );
    }

    if (filterOptions.year) {
      const year = parseInt(filterOptions.year);
      results = results.filter(dorama => {
        const releaseYear = dorama.release_date 
          ? new Date(dorama.release_date).getFullYear() 
          : dorama.first_air_date 
            ? new Date(dorama.first_air_date).getFullYear()
            : null;
        
        return releaseYear === year;
      });
    }

    if (filterOptions.rating) {
      const minRating = parseFloat(filterOptions.rating);
      results = results.filter(dorama => dorama.vote_average >= minRating);
    }

    if (filterOptions.country) {
      results = results.filter(dorama => 
        dorama.origin_country?.includes(filterOptions.country)
      );
    }

    setFilteredDoramas(results);
  }, [doramas, filterOptions]);

  useEffect(() => {
    applyFilters();
  }, [filterOptions, applyFilters]);

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
    updateFilter,
    resetFilters
  };
};
