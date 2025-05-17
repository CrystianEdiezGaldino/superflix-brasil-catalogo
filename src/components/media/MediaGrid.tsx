import React, { useEffect, useRef, useState } from "react";
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
  focusedItem?: number;
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
  onMediaClick,
  focusedItem = -1
}: MediaGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(focusedItem);

  useEffect(() => {
    setFocusedIndex(focusedItem);
  }, [focusedItem]);

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

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsPerRow = window.innerWidth >= 1280 ? 8 : 
                         window.innerWidth >= 1024 ? 6 : 
                         window.innerWidth >= 768 ? 5 : 
                         window.innerWidth >= 640 ? 4 : 3;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            setFocusedIndex(prev => Math.max(prev - 1, 0));
          } else {
            setFocusedIndex(prev => Math.min(prev + 1, mediaItems.length - 1));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, mediaItems.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + itemsPerRow, mediaItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - itemsPerRow, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < mediaItems.length) {
            onMediaClick?.(mediaItems[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, mediaItems, onMediaClick]);

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
        {mediaItems.map((media, index) => (
          <MediaCard
            key={`${media.id}-${media.media_type || 'movie'}`}
            media={media}
            onClick={() => onMediaClick?.(media)}
            index={index}
            isFocused={index === focusedIndex}
            onFocus={setFocusedIndex}
          />
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
