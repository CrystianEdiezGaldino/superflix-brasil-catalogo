
import { useState, useCallback, useEffect } from "react";
import { MediaItem, Series, isSeries } from "@/types/movie";

// Add origin_country to Series type augmentation
declare module "@/types/movie" {
  interface Series {
    origin_country?: string[];
  }
}

interface DoramaFiltering {
  filteredDoramas: MediaItem[];
  yearFilter: string;
  ratingFilter: string;
  countryFilter: string;
  isFiltering: boolean;
  setYearFilter: (year: string) => void;
  setRatingFilter: (rating: string) => void;
  setCountryFilter: (country: string) => void;
  resetFilters: () => void;
}

export const useDoramaFiltering = (doramas: MediaItem[]): DoramaFiltering => {
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [filteredDoramas, setFilteredDoramas] = useState<MediaItem[]>(doramas || []);
  const [isFiltering, setIsFiltering] = useState(false);

  // Reset filters
  const resetFilters = useCallback(() => {
    setYearFilter("");
    setRatingFilter("");
    setCountryFilter("");
    setIsFiltering(false);
  }, []);

  // Apply filters
  useEffect(() => {
    // If no doramas or no filters, reset to original doramas
    if (!doramas.length || (!yearFilter && !ratingFilter && !countryFilter)) {
      setFilteredDoramas(doramas);
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    const filtered = doramas.filter((dorama) => {
      // Ensure dorama has the necessary properties
      if (!dorama) return false;

      // Year filter
      if (yearFilter && isSeries(dorama) && dorama.first_air_date) {
        const year = dorama.first_air_date.split("-")[0];
        if (year !== yearFilter) return false;
      }

      // Rating filter
      if (ratingFilter && typeof dorama.vote_average === 'number') {
        const rating = parseFloat(ratingFilter);
        if (dorama.vote_average < rating) return false;
      }

      // Country filter
      if (countryFilter && isSeries(dorama)) {
        // Add a safety check for origin_country
        const originCountry = (dorama as Series).origin_country;
        if (!originCountry || !originCountry.includes(countryFilter)) {
          return false;
        }
      }

      return true;
    });

    setFilteredDoramas(filtered);
  }, [doramas, yearFilter, ratingFilter, countryFilter]);

  // Extract available filter values from doramas
  const getAvailableYears = useCallback((): string[] => {
    if (!doramas.length) return [];

    const years = new Set<string>();
    
    doramas.forEach((dorama) => {
      if (isSeries(dorama) && dorama.first_air_date) {
        const year = dorama.first_air_date.split("-")[0];
        years.add(year);
      }
    });
    
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // Sort descending
  }, [doramas]);

  const getAvailableRatings = useCallback((): string[] => {
    return ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  }, []);

  const getAvailableCountries = useCallback((): string[] => {
    if (!doramas.length) return [];

    const countries = new Set<string>();
    
    doramas.forEach((dorama) => {
      if (isSeries(dorama)) {
        const originCountry = (dorama as Series).origin_country;
        if (originCountry && Array.isArray(originCountry)) {
          originCountry.forEach((country: string) => {
            if (country) countries.add(country);
          });
        }
      }
    });
    
    return Array.from(countries).sort();
  }, [doramas]);

  return {
    filteredDoramas,
    yearFilter,
    ratingFilter,
    countryFilter,
    isFiltering,
    setYearFilter,
    setRatingFilter,
    setCountryFilter,
    resetFilters
  };
};
