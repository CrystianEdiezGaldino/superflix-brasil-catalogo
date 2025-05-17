import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem, isMovie, isSeries } from "@/types/movie";
import MediaCard from "@/components/media/MediaCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

interface MediaGridProps {
  mediaItems: MediaItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isSearching: boolean;
  isFiltering: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
  onMediaClick?: (media: MediaItem) => void;
}

const MediaGrid = ({
  mediaItems,
  isLoading,
  isLoadingMore,
  hasMore,
  isSearching,
  isFiltering,
  onLoadMore,
  onResetFilters,
  onMediaClick
}: MediaGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">
          {isSearching
            ? "Nenhum resultado encontrado para sua busca."
            : isFiltering
            ? "Nenhum conteúdo encontrado com os filtros selecionados."
            : "Nenhum conteúdo disponível no momento."}
        </p>
        {(isSearching || isFiltering) && (
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="text-white border-white hover:bg-white/10"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {mediaItems.map((media) => (
          <div
            key={media.id}
            onClick={() => onMediaClick?.(media)}
            className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
              alt={isMovie(media) ? media.title : isSeries(media) ? media.name : ''}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h3 className="text-sm font-medium text-white truncate">
                  {isMovie(media) ? media.title : isSeries(media) ? media.name : ''}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={gridRef} className="flex justify-center">
          {isLoadingMore ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 text-netflix-red animate-spin" />
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="text-white border-white hover:bg-white/10"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Carregar Mais
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
