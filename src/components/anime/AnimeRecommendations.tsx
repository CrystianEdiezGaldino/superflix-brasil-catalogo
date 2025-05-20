import React from "react";
import { Series } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface AnimeRecommendationsProps {
  anime: Series;
  isLoadingMore?: boolean;
}

const AnimeRecommendations: React.FC<AnimeRecommendationsProps> = ({ anime, isLoadingMore = false }) => {
  if (!anime.recommendations?.results.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Recomendações</h2>
      <MediaSection
        title="Recomendações"
        medias={anime.recommendations.results}
        showLoadMore={false}
        sectionId="recommendations"
        mediaType="anime"
        sectionIndex={0}
      />
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AnimeRecommendations; 