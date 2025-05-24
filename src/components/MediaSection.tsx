
import React, { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/types/movie';
import { Button } from '@/components/ui/button';
import MediaCard from '@/components/media/MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MediaSectionProps {
  title: string;
  medias: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore: () => void;
  sectionIndex: number;
  onMediaClick: (media: MediaItem) => void;
  className?: string;
  isLoading?: boolean;
  sectionId?: string;
  mediaType?: 'movie' | 'tv' | 'anime' | 'dorama' | 'tv-channel';
  focusedItem?: number;
  onFocusChange?: (index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  displayStyle?: 'carousel' | 'grid';
}

const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  medias,
  showLoadMore = false,
  onLoadMore,
  sectionIndex,
  onMediaClick,
  className = "",
  isLoading = false,
  sectionId = "section",
  mediaType,
  focusedItem = -1,
  onFocusChange,
  onKeyDown,
  displayStyle = 'carousel'
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  if (!medias || medias.length === 0) {
    return null;
  }
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;
    
    const container = contentRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(scrollPosition - scrollAmount, 0) 
      : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);
    
    setScrollPosition(newPosition);
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };
  
  // Generate placeholder items for loading state
  const loadingItems = Array.from({ length: 5 }).map((_, i) => (
    <div key={`loading-${i}`} className="w-64 h-36 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
  ));
  
  // Media content to display based on either medias prop or loading state
  const mediaContent = isLoading ? loadingItems : medias.map((media, index) => (
    <div
      key={`${media.id}-${index}-${sectionIndex}`}
      className="w-64 flex-none cursor-pointer"
      onClick={() => onMediaClick(media)}
      data-section={sectionIndex}
      data-item={index}
      onFocus={() => onFocusChange && onFocusChange(index)}
      tabIndex={focusedItem === index ? 0 : -1}
      onKeyDown={onKeyDown}
    >
      <MediaCard 
        media={media} 
        index={index} 
        isFocused={focusedItem === index}
        onFocus={() => onFocusChange && onFocusChange(index)}
      />
    </div>
  ));
  
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      
      {displayStyle === 'carousel' ? (
        <div className="relative">
          {/* Left scroll button */}
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 z-10 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ opacity: scrollPosition > 0 ? 0.7 : 0 }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          {/* Content area */}
          <div 
            ref={contentRef}
            className="flex space-x-4 overflow-x-scroll scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mediaContent}
            
            {showLoadMore && (
              <div className="flex items-center justify-center w-64 flex-none">
                <Button
                  onClick={onLoadMore}
                  className="h-32"
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            )}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 z-10 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      ) : (
        // Grid layout for sections that should display as grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaContent}
          
          {showLoadMore && (
            <div className="flex items-center justify-center h-full">
              <Button
                onClick={onLoadMore}
                className="h-32 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaSection;
