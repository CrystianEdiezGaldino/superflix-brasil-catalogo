import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem, isMovie, isSeries, getMediaTitle } from "@/types/movie";
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
      const itemsPerRow = Math.floor((gridRef.current?.clientWidth || 0) / 200); // Aproximadamente 200px por item
      const totalRows = Math.ceil(mediaItems.length / itemsPerRow);

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          if (focusedIndex < mediaItems.length - 1) {
            setFocusedIndex(prev => prev + 1);
            const nextItem = document.querySelector(`[data-item="${focusedIndex + 1}"]`);
            if (nextItem) {
              nextItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (focusedIndex > 0) {
            setFocusedIndex(prev => prev - 1);
            const prevItem = document.querySelector(`[data-item="${focusedIndex - 1}"]`);
            if (prevItem) {
              prevItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (focusedIndex + itemsPerRow < mediaItems.length) {
            setFocusedIndex(prev => prev + itemsPerRow);
            const nextRowItem = document.querySelector(`[data-item="${focusedIndex + itemsPerRow}"]`);
            if (nextRowItem) {
              nextRowItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (focusedIndex - itemsPerRow >= 0) {
            setFocusedIndex(prev => prev - itemsPerRow);
            const prevRowItem = document.querySelector(`[data-item="${focusedIndex - itemsPerRow}"]`);
            if (prevRowItem) {
              prevRowItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
          break;

        case "Enter":
          e.preventDefault();
          if (mediaItems[focusedIndex]) {
            onMediaClick?.(mediaItems[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, mediaItems, onMediaClick]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">
          {isSearching
            ? "Nenhum resultado encontrado para sua busca."
            : isFiltering
            ? "Nenhum resultado encontrado com os filtros selecionados."
            : "Nenhum conteúdo disponível no momento."}
        </p>
        {isFiltering && onResetFilters && (
          <Button
            onClick={onResetFilters}
            className="mt-4 bg-netflix-red hover:bg-red-700"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
    >
      {mediaItems.map((item, index) => (
        <div
          key={item.id}
          data-item={index}
          className={`relative group cursor-pointer transition-all duration-300 ${
            index === focusedIndex ? 'ring-2 ring-netflix-red scale-105' : ''
          }`}
          onClick={() => onMediaClick?.(item)}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          <img
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={getMediaTitle(item)}
            className="rounded-md w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <h3 className="text-white font-medium truncate">{getMediaTitle(item)}</h3>
            <p className="text-sm text-gray-300">
              {item.media_type === 'movie' ? 'Filme' : 
               item.media_type === 'tv' ? 
                 item.original_language === 'ko' ? 'Dorama' : 'Série' : 
               'Anime'}
            </p>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="col-span-full flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="bg-netflix-red hover:bg-red-700"
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Carregar Mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
