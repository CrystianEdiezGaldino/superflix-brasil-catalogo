
import { useState, useMemo } from "react";
import { MediaItem, isSeries } from "@/types/movie";

export interface DoramaFilters {
  year: string;
  genre: string;
  country: string;
  sort: string;
  yearRange: number[];
}

const defaultFilters: DoramaFilters = {
  year: "all",
  genre: "all",
  country: "all",
  sort: "popularity",
  yearRange: [1990, new Date().getFullYear()]
};

export const useDoramaFiltering = (doramas: MediaItem[]) => {
  const [filters, setFilters] = useState<DoramaFilters>(defaultFilters);
  
  const updateFilters = (newFilters: Partial<DoramaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Extract available genres from doramas
  const availableGenres = useMemo(() => {
    const genresSet = new Set<string>();
    
    doramas.forEach(dorama => {
      (dorama.genres || dorama.genre_ids || []).forEach((genre: any) => {
        if (typeof genre === 'object' && genre.name) {
          genresSet.add(genre.name);
        }
      });
    });
    
    return Array.from(genresSet).sort();
  }, [doramas]);

  // Extract available countries from doramas
  const availableCountries = useMemo(() => {
    const countriesSet = new Set<string>();
    
    doramas.forEach(dorama => {
      if (isSeries(dorama) && dorama.origin_country) {
        dorama.origin_country.forEach(country => {
          countriesSet.add(country);
        });
      }
    });
    
    return Array.from(countriesSet).sort();
  }, [doramas]);

  // Extract available years from doramas
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    
    doramas.forEach(dorama => {
      const releaseDate = isSeries(dorama) ? dorama.first_air_date : dorama.release_date;
      if (releaseDate) {
        const year = new Date(releaseDate).getFullYear();
        if (!isNaN(year)) {
          yearsSet.add(year);
        }
      }
    });
    
    return Array.from(yearsSet).sort((a, b) => b - a); // Descending order
  }, [doramas]);

  // Filter doramas based on current filters
  const filteredDoramas = useMemo(() => {
    return doramas.filter(dorama => {
      // Filter by year
      const releaseDate = isSeries(dorama) ? dorama.first_air_date : dorama.release_date;
      
      if (filters.year !== "all" && releaseDate) {
        const year = new Date(releaseDate).getFullYear();
        if (year.toString() !== filters.year) {
          return false;
        }
      }
      
      // Filter by year range
      if (releaseDate) {
        const year = new Date(releaseDate).getFullYear();
        if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
          return false;
        }
      }
      
      // Filter by genre
      if (filters.genre !== "all") {
        const doramaGenres = dorama.genres || [];
        const hasGenre = doramaGenres.some((genre: any) => 
          genre.name === filters.genre
        );
        
        if (!hasGenre) {
          return false;
        }
      }
      
      // Filter by country
      if (filters.country !== "all" && isSeries(dorama)) {
        if (!dorama.origin_country?.includes(filters.country)) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected sort option
      if (filters.sort === "popularity") {
        return b.popularity - a.popularity;
      } else if (filters.sort === "rating") {
        return b.vote_average - a.vote_average;
      } else if (filters.sort === "recent") {
        const dateA = isSeries(a) ? a.first_air_date : a.release_date;
        const dateB = isSeries(b) ? b.first_air_date : b.release_date;
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } else if (filters.sort === "oldest") {
        const dateA = isSeries(a) ? a.first_air_date : a.release_date;
        const dateB = isSeries(b) ? b.first_air_date : b.release_date;
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      
      return 0;
    });
  }, [doramas, filters]);

  const isFiltering = useMemo(() => {
    return filters.year !== "all" || 
           filters.genre !== "all" || 
           filters.country !== "all" ||
           filters.sort !== "popularity" ||
           filters.yearRange[0] !== defaultFilters.yearRange[0] ||
           filters.yearRange[1] !== defaultFilters.yearRange[1];
  }, [filters]);

  return {
    filters,
    filteredDoramas,
    isFiltering,
    availableGenres,
    availableCountries,
    availableYears,
    updateFilters,
    resetFilters
  };
};
