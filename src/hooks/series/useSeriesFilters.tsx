import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";

interface UseSeriesFiltersProps {
  initialSeries: MediaItem[];
  setSeriesList: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  isSearching: boolean;
}

export const useSeriesFilters = ({ 
  initialSeries, 
  setSeriesList, 
  isSearching 
}: UseSeriesFiltersProps) => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);

  // Aplicar filtros
  const applyFilters = useCallback((seriesList: MediaItem[]) => {
    if (!seriesList || !Array.isArray(seriesList)) return [];
    
    let filteredSeries = [...seriesList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filteredSeries = filteredSeries.filter((series) => {
        let releaseYear = 0;
        
        if ('first_air_date' in series && series.first_air_date) {
          releaseYear = new Date(series.first_air_date).getFullYear();
        }
        
        return releaseYear === year;
      });
    }

    if (ratingFilter && ratingFilter !== "all") {
      const rating = parseFloat(ratingFilter);
      filteredSeries = filteredSeries.filter((series) => {
        return series.vote_average >= rating;
      });
    }

    return filteredSeries;
  }, [yearFilter, ratingFilter]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!initialSeries || !Array.isArray(initialSeries) || isSearching) return;
    
    const filtered = applyFilters(initialSeries);
    if (JSON.stringify(filtered) !== JSON.stringify(initialSeries)) {
      setIsFiltering(true);
      setSeriesList(filtered);
      setIsFiltering(false);
    }
  }, [yearFilter, ratingFilter, initialSeries, applyFilters, isSearching, setSeriesList]);

  // Resetar filtros
  const resetFilters = () => {
    setYearFilter("all");
    setRatingFilter("all");
    if (initialSeries && Array.isArray(initialSeries)) setSeriesList(initialSeries);
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
