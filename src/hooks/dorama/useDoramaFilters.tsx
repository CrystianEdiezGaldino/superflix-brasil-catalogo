
import { useCallback } from "react";
import { Series } from "@/types/movie";

export const useDoramaFilters = () => {
  // Filter doramas that don't have images and ensure they're Korean
  const filterDoramas = useCallback((doramaList: Series[]) => {
    return doramaList.filter(dorama => 
      // Guarantee it's a Korean drama (checking original language)
      dorama.original_language === "ko" && 
      // Guarantee it has an image (poster or backdrop)
      (dorama.poster_path || dorama.backdrop_path)
    );
  }, []);

  // Apply year and genre filters
  const applyFilters = useCallback((doramaList: Series[], yearFilter: string, genreFilter: string) => {
    let filtered = [...doramaList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter((dorama) => {
        const releaseYear = dorama.first_air_date 
          ? new Date(dorama.first_air_date).getFullYear() 
          : 0;
        return releaseYear === year;
      });
    }

    if (genreFilter && genreFilter !== "all") {
      // In a real app, we'd filter by actual genre IDs from the API
      // This is just a placeholder implementation
    }

    // Always filter to show only Korean doramas with images
    filtered = filterDoramas(filtered);

    return filtered;
  }, []);

  return {
    filterDoramas,
    applyFilters
  };
};
