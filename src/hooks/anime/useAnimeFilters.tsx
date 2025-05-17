
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";

interface UseAnimeFiltersProps {
  initialAnimes: MediaItem[];
  setAnimes: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  isSearching: boolean;
}

export const useAnimeFilters = ({ 
  initialAnimes, 
  setAnimes, 
  isSearching 
}: UseAnimeFiltersProps) => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);

  // Aplicar filtros
  const applyFilters = useCallback((animeList: MediaItem[]) => {
    if (!animeList) return [];
    
    let filteredAnimes = [...animeList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredAnimes = filteredAnimes.filter((anime) => {
        let releaseYear = 0;
        
        if ('first_air_date' in anime && anime.first_air_date) {
          releaseYear = new Date(anime.first_air_date).getFullYear();
        } else if ('release_date' in anime && anime.release_date) {
          releaseYear = new Date(anime.release_date).getFullYear();
        }
        
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredAnimes = filteredAnimes.filter((anime) => {
        return anime.vote_average >= rating;
      });
    }

    return filteredAnimes;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!initialAnimes || initialAnimes.length === 0 || isSearching) return;
    
    setIsFiltering(true);
    const filtered = applyFilters(initialAnimes);
    setAnimes(filtered);
    setIsFiltering(false);
  }, [yearFilter, ratingFilter, initialAnimes, applyFilters, isSearching, setAnimes]);

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (initialAnimes) setAnimes(initialAnimes);
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
