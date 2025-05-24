
import React, { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/types/movie';
import { Button } from '@/components/ui/button';
import MediaCard from '@/components/media/MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Ensure medias is a valid array
  const validMedias = Array.isArray(medias) ? medias : [];
  
  // Check scroll position to control arrow visibility
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    
    const checkScrollPosition = () => {
      if (!container) return;
      
      setShowLeftArrow(container.scrollLeft > 20);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 20
      );
    };
    
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);
    
    // Initial check
    checkScrollPosition();
    
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [validMedias]);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;
    
    const container = contentRef.current;
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of the visible width
    const newPosition = direction === 'left' 
      ? Math.max(scrollPosition - scrollAmount, 0) 
      : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);
    
    setScrollPosition(newPosition);
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };
  
  // Generate placeholder items for loading state
  const loadingItems = Array.from({ length: 6 }).map((_, i) => (
    <div key={`loading-${i}`} className="w-64 h-40 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
  ));
  
  // Media content to display based on either medias prop or loading state
  const mediaContent = isLoading ? loadingItems : validMedias.map((media, index) => (
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
  
  if (validMedias.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <div className={`mb-8 ${className}`} id={`media-section-${sectionId}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      
      {displayStyle === 'carousel' ? (
        <div className="relative group">
          {/* Left scroll button */}
          <button 
            onClick={() => handleScroll('left')}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transform -translate-x-1/4 transition-opacity",
              showLeftArrow ? "opacity-80" : "opacity-0 pointer-events-none"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          {/* Content area */}
          <div 
            ref={contentRef}
            className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1 px-1"
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
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 transform translate-x-1/4 transition-opacity",
              showRightArrow ? "opacity-80" : "opacity-0 pointer-events-none"
            )}
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
