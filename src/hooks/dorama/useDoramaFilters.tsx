
import { useCallback } from "react";
import { Series, Movie, MediaItem } from "@/types/movie";

export const useDoramaFilters = () => {
  // Filter content that doesn't have images and ensure they're Korean
  const filterDoramas = useCallback((contentList: MediaItem[]) => {
    return contentList.filter(content => {
      // Verifique se é dorama ou filme coreano
      const isKorean = content.media_type === "tv" 
        ? (content as Series).original_language === "ko"
        : true; // Para filmes, consideramos que já filtramos na API
      
      // Garantir que tem uma imagem (poster ou backdrop)
      const hasImage = content.poster_path || content.backdrop_path;
      
      return isKorean && hasImage;
    });
  }, []);

  // Apply year and genre filters
  const applyFilters = useCallback((contentList: MediaItem[], yearFilter: string, genreFilter: string) => {
    let filtered = [...contentList];

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter((content) => {
        const releaseYear = content.media_type === "tv"
          ? (content as Series).first_air_date 
            ? new Date((content as Series).first_air_date).getFullYear() 
            : 0
          : (content as Movie).release_date
            ? new Date((content as Movie).release_date).getFullYear()
            : 0;
        
        return releaseYear === year;
      });
    }

    if (genreFilter && genreFilter !== "all") {
      // No futuro, podemos implementar a filtragem por gênero usando IDs reais de gênero da API
      // Isso é apenas um espaço reservado para implementação futura
    }

    // Always filter to show only Korean content with images
    filtered = filterDoramas(filtered);

    return filtered;
  }, [filterDoramas]);

  // Mapeamento de géneros para IDs (para uso futuro)
  const genreMap = {
    romance: 10749,
    comedy: 35,
    drama: 18,
    action: 28,
    thriller: 53,
    family: 10751,
    fantasy: 14
  };

  return {
    filterDoramas,
    applyFilters,
    genreMap
  };
};
