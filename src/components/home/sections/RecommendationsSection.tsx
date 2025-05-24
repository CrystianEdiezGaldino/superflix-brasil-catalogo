
import React from "react";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import MediaCard from "@/components/media/MediaCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RecommendationsSectionProps {
  recommendations: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  title?: string;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  isLoading,
  hasMore,
  onLoadMore,
  title = "Recomendações"
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {recommendations.map((media) => (
            <div key={media.id} className="w-[180px] md:w-[200px] flex-none">
              <MediaCard media={media} />
            </div>
          ))}
          
          {hasMore && (
            <div className="flex items-center justify-center w-[180px] md:w-[200px] flex-none">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
                className="h-32"
              >
                {isLoading ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default RecommendationsSection;
