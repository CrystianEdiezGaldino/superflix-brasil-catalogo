
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";

interface UseMovieFiltersProps {
  initialMovies: MediaItem[];
  setMovies: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  isSearching: boolean;
}

export const useMovieFilters = ({ 
  initialMovies, 
  setMovies, 
  isSearching 
}: UseMovieFiltersProps) => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Aplicar filtros
  const applyFilters = useCallback((movieList: MediaItem[]) => {
    let filteredMovies = [...movieList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredMovies = filteredMovies.filter((movie) => {
        const releaseYear = 'release_date' in movie && movie.release_date 
          ? new Date(movie.release_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredMovies = filteredMovies.filter((movie) => {
        return movie.vote_average >= rating;
      });
    }

    return filteredMovies;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!initialMovies || isSearching) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialMovies);
    setMovies(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, initialMovies, applyFilters, isSearching, setMovies]);

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (initialMovies) setMovies(initialMovies);
  };

  return {
    yearFilter,
    ratingFilter,
    isFiltering,
    setYearFilter,
    setRatingFilter,
    resetFilters
  };
};
