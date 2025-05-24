
import React from 'react';
import { MediaItem } from '@/types/movie';
import MediaSection from '@/components/MediaSection';

interface AnimeRecommendationsProps {
  recommendations: MediaItem[];
  onAnimeClick: (anime: MediaItem) => void;
}

const AnimeRecommendations: React.FC<AnimeRecommendationsProps> = ({ recommendations, onAnimeClick }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <MediaSection
      title="Animes recomendados para você"
      medias={recommendations}
      showLoadMore={false}
      sectionId="animeRecommendations"
      mediaType="anime"
      sectionIndex={0}
      onMediaClick={onAnimeClick}
      onLoadMore={() => {}}
    />
  );
};

export default AnimeRecommendations;
