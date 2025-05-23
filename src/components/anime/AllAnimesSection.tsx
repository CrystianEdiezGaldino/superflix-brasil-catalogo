
import React from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import MediaCard from "@/components/media/MediaCard";
import LoadingCard from "@/components/media/LoadingCard";
import { Loader2, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AllAnimesSectionProps {
  animes: MediaItem[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMediaClick: (media: MediaItem) => void;
  loadingRef: React.RefObject<HTMLDivElement>;
}

const AllAnimesSection: React.FC<AllAnimesSectionProps> = ({
  animes,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onMediaClick,
  loadingRef
}) => {
  // Safety check for animes array
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => 
    anime && (anime.poster_path || anime.backdrop_path)
  ) : [];
  
  // Checking if we have data to show
  if (isLoading && validAnimes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
        <p className="mt-2 text-gray-400">Carregando animes...</p>
      </div>
    );
  }

  // No data to show
  if (validAnimes.length === 0) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold text-white mb-4">Todos os Animes</h3>
        <p className="text-gray-400 text-center py-12">Nenhum anime encontrado.</p>
      </div>
    );
  }

  // Manual load more handler for debugging
  const handleManualLoadMore = () => {
    console.log("Manual load more triggered");
    onLoadMore();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Todos os Animes</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {validAnimes.map((anime, index) => (
          <div
            key={`${anime.id}-${index}`}
            className="relative group overflow-hidden rounded-lg"
            ref={index === validAnimes.length - 2 ? loadingRef : null}
          >
            <MediaCard
              media={anime}
              onClick={() => onMediaClick(anime)}
              index={index}
              isFocused={false}
              onFocus={() => {}}
              className="transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                <span className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={12} />
                  {anime.vote_average.toFixed(1)}
                </span>
                <span>{new Date(anime.first_air_date || anime.release_date || "").getFullYear()}</span>
              </div>
              <Button
                size="sm"
                className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                onClick={() => onMediaClick(anime)}
              >
                <Play size={14} className="mr-1" /> Assistir
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading indicator for infinite scroll */}
      {isFetchingMore && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-netflix-red animate-spin" />
          <span className="ml-2 text-white">Carregando mais animes...</span>
        </div>
      )}
      
      {/* Manual load more button for debugging */}
      {hasMore && !isFetchingMore && (
        <div className="flex justify-center py-6">
          <Button 
            onClick={handleManualLoadMore}
            className="bg-netflix-red hover:bg-netflix-red/90 text-white"
          >
            Carregar mais animes
          </Button>
        </div>
      )}
      
      {/* End of list message */}
      {!hasMore && validAnimes.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          Você chegou ao fim da lista de animes disponíveis.
        </div>
      )}
    </div>
  );
};

export default AllAnimesSection;
