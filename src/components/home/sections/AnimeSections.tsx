
import React from "react";
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { Button } from "@/components/ui/button";

interface AnimeSectionsProps {
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recentAnimes: MediaItem[];
  popularAnime?: MediaItem[];
  onMediaClick: (anime: MediaItem) => void;
  onLoadMore?: (sectionId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const AnimeSections: React.FC<AnimeSectionsProps> = ({
  anime,
  topRatedAnime,
  recentAnimes,
  popularAnime = [],
  onMediaClick,
  onLoadMore,
  isLoading = false,
  hasMore = false
}) => {
  return (
    <div className="space-y-8">
      {anime.length > 0 && (
        <MediaSection
          title="Animes"
          items={anime}
          onItemClick={onMediaClick}
        />
      )}
      
      {topRatedAnime.length > 0 && (
        <MediaSection
          title="Animes Mais Bem Avaliados"
          items={topRatedAnime}
          onItemClick={onMediaClick}
        />
      )}
      
      {recentAnimes.length > 0 && (
        <MediaSection
          title="Animes Recentes"
          items={recentAnimes}
          onItemClick={onMediaClick}
        />
      )}
      
      {popularAnime && popularAnime.length > 0 && (
        <MediaSection
          title="Animes Populares"
          items={popularAnime}
          onItemClick={onMediaClick}
        />
      )}
      
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4 pb-8">
          <Button
            onClick={() => onLoadMore('anime')}
            disabled={isLoading}
            variant="outline"
            className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2"></div>
            ) : null}
            Carregar Mais Animes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnimeSections;
