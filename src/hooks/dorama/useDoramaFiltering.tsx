
import { useState, useCallback, useEffect } from "react";
import { MediaItem, Series } from "@/types/movie";

export type DoramaFilters = {
  year?: string;
  rating?: string;
  sortBy?: string;
  country?: string;
  searchQuery?: string;
};

export type DoramaFilterState = {
  filters: DoramaFilters;
  filteredDoramas: MediaItem[];
  isFiltering: boolean;
  originalDoramas: MediaItem[];
};

export const useDoramaFiltering = (doramas: MediaItem[]) => {
  const [filterState, setFilterState] = useState<DoramaFilterState>({
    filters: {},
    filteredDoramas: [],
    isFiltering: false,
    originalDoramas: [],
  });

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      filteredDoramas: doramas,
      originalDoramas: doramas,
    }));
  }, [doramas]);

  const updateFilters = useCallback(
    (newFilters: Partial<DoramaFilters>) => {
      setFilterState((prev) => {
        const updatedFilters = {
          ...prev.filters,
          ...newFilters,
        };

        // Check if any filter is active
        const isFiltering = Boolean(
          updatedFilters.year ||
          updatedFilters.rating ||
          updatedFilters.sortBy ||
          updatedFilters.country ||
          updatedFilters.searchQuery
        );

        // Apply filters
        let filtered = [...prev.originalDoramas];

        // Filter by year
        if (updatedFilters.year) {
          filtered = filtered.filter((dorama) => {
            const date = 'first_air_date' in dorama ? dorama.first_air_date : '';
            return date?.includes(updatedFilters.year || '');
          });
        }

        // Filter by rating
        if (updatedFilters.rating) {
          const minRating = parseFloat(updatedFilters.rating);
          filtered = filtered.filter(
            (dorama) => dorama.vote_average >= minRating
          );
        }

        // Filter by country
        if (updatedFilters.country) {
          filtered = filtered.filter((dorama) => {
            // Corrigido para verificar se a propriedade origin_country existe antes de usá-la
            const origins = (dorama as Series).origin_country || [];
            return origins.includes(updatedFilters.country || '');
          });
        }

        // Filter by search query
        if (updatedFilters.searchQuery) {
          const query = updatedFilters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (dorama) =>
              dorama.name?.toLowerCase().includes(query) ||
              dorama.title?.toLowerCase().includes(query) ||
              dorama.original_name?.toLowerCase().includes(query) ||
              dorama.overview?.toLowerCase().includes(query)
          );
        }

        // Sort
        if (updatedFilters.sortBy) {
          switch (updatedFilters.sortBy) {
            case "popularity.desc":
              filtered.sort((a, b) => b.popularity - a.popularity);
              break;
            case "popularity.asc":
              filtered.sort((a, b) => a.popularity - b.popularity);
              break;
            case "vote_average.desc":
              filtered.sort((a, b) => b.vote_average - a.vote_average);
              break;
            case "vote_average.asc":
              filtered.sort((a, b) => a.vote_average - b.vote_average);
              break;
            case "first_air_date.desc":
              filtered.sort((a, b) => {
                const dateA = a.first_air_date || a.release_date || "";
                const dateB = b.first_air_date || b.release_date || "";
                return dateB.localeCompare(dateA);
              });
              break;
            case "first_air_date.asc":
              filtered.sort((a, b) => {
                const dateA = a.first_air_date || a.release_date || "";
                const dateB = b.first_air_date || b.release_date || "";
                return dateA.localeCompare(dateB);
              });
              break;
            default:
              break;
          }
        }

        return {
          ...prev,
          filters: updatedFilters,
          filteredDoramas: filtered,
          isFiltering,
        };
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      filters: {},
      filteredDoramas: prev.originalDoramas,
      isFiltering: false,
    }));
  }, []);

  return {
    filters: filterState.filters,
    filteredDoramas: filterState.filteredDoramas,
    isFiltering: filterState.isFiltering,
    updateFilters,
    resetFilters,
  };
};
