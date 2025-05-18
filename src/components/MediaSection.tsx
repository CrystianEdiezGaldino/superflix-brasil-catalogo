import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MediaItem, getMediaTitle } from '@/types/movie';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import MediaCard from "./media/MediaCard";
import { Button } from '@/components/ui/button';

type MediaSectionProps = {
  title: string;
  medias?: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  onMediaClick?: (media: MediaItem) => void;
  sectionId?: string;
  mediaType?: 'movie' | 'tv' | 'anime' | 'dorama' | 'tv-channel';
  focusedItem?: number;
  onFocusChange?: (index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  sectionIndex: number;
};

const MediaSection = ({ 
  title, 
  medias = [], 
  showLoadMore = false, 
  onLoadMore, 
  isLoading = false,
  onMediaClick,
  sectionId = 'default',
  mediaType,
  focusedItem = -1,
  onFocusChange,
  onKeyDown,
  sectionIndex
}: MediaSectionProps) => {
  const navigate = useNavigate();
  const [focusedIndex, setFocusedIndex] = useState(focusedItem);
  
  useEffect(() => {
    setFocusedIndex(focusedItem);
  }, [focusedItem]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(e as unknown as React.KeyboardEvent);
        return;
      }
      
      const itemsPerRow = window.innerWidth >= 1280 ? 6 : 
                         window.innerWidth >= 1024 ? 5 : 
                         window.innerWidth >= 768 ? 4 : 
                         window.innerWidth >= 640 ? 3 : 2;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          const newIndex = Math.min(focusedIndex + 1, medias.length - 1);
          setFocusedIndex(newIndex);
          onFocusChange?.(newIndex);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
          onFocusChange?.(prevIndex);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const downIndex = Math.min(focusedIndex + itemsPerRow, medias.length - 1);
          setFocusedIndex(downIndex);
          onFocusChange?.(downIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const upIndex = Math.max(focusedIndex - itemsPerRow, 0);
          setFocusedIndex(upIndex);
          onFocusChange?.(upIndex);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < medias.length) {
            onMediaClick?.(medias[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, medias, onMediaClick, onFocusChange, onKeyDown]);

  // Only show load more for sections with showLoadMore flag
  const shouldShowLoadMore = showLoadMore && onLoadMore;
  
  // Function to handle click on "Load More" button
  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaType) {
      // Navegar para a rota correspondente ao tipo de mídia
      switch (mediaType) {
        case 'movie':
          navigate('/filmes');
          break;
        case 'tv':
          navigate('/series');
          break;
        case 'anime':
          navigate('/animes');
          break;
        case 'dorama':
          navigate('/doramas');
          break;
        case 'tv-channel':
          navigate('/tv-channels');
          break;
      }
    } else if (onLoadMore) {
      console.log(`Loading more items for section: ${sectionId}`);
      onLoadMore();
    }
  };

  const handleClick = (media: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(media);
    }
  };

  // Skip rendering if no media items
  if (medias.length === 0) {
    return null;
  }

  return (
    <div 
      className="space-y-4 py-4" 
      id={`media-section-${sectionId}`} 
      data-section-id={sectionId}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative">
        {medias.map((media, index) => (
          <MediaCard
            key={`section-${sectionIndex}-media-${media.id}`}
            media={media}
            onClick={() => handleClick(media)}
            index={index}
            isFocused={index === focusedIndex}
            onFocus={(idx) => {
              setFocusedIndex(idx);
              onFocusChange?.(idx);
            }}
          />
        ))}
      </div>

      {/* Load more button */}
      {shouldShowLoadMore && (
        <div className="flex items-center justify-center mt-6">
          <button 
            onClick={handleLoadMore}
            className={`group relative overflow-hidden rounded-lg bg-netflix-red hover:bg-red-700 transition-all duration-300 flex items-center justify-center cursor-pointer px-6 py-3 min-w-[200px] focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-100 ${
              focusedIndex === medias.length ? 'scale-105' : ''
            }`}
            data-section-id={sectionId}
            tabIndex={focusedIndex === medias.length ? 0 : -1}
          >
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="text-sm font-medium text-white">
                {isLoading ? "Carregando..." : "Ver mais"}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
