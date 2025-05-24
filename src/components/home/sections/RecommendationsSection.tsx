
import React from "react";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import MediaCard from "@/components/media/MediaCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MediaSection from "@/components/MediaSection";

interface RecommendationsSectionProps {
  recommendations: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  title?: string;
  onMediaClick?: (media: MediaItem) => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  isLoading,
  hasMore,
  onLoadMore,
  title = "Recomendações",
  onMediaClick = () => {}
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <MediaSection
      title={title}
      medias={recommendations}
      showLoadMore={hasMore}
      onLoadMore={onLoadMore}
      sectionIndex={999} // Use a high number to avoid conflicts
      onMediaClick={onMediaClick}
      isLoading={isLoading}
    />
  );
};

export default RecommendationsSection;
