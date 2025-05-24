
import { useState, useEffect, useRef } from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { MediaItem, getMediaTitle } from '@/types/movie';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MediaCard from "./MediaCard";
import LoadingCard from "./LoadingCard";
import { cn } from '@/lib/utils';

type MediaSectionProps = {
  title: string;
  medias?: MediaItem[] | null;
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
  onLoadMore = () => {}, // Set default to empty function
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Ensure medias is an array
  const mediasArray = Array.isArray(medias) ? medias : [];
  
  useEffect(() => {
    setFocusedIndex(focusedItem);
  }, [focusedItem]);

  // Handle scroll position to show/hide arrows
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
  }, [mediasArray]);

  // Handle scroll when arrow buttons are clicked
  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;
    
    const container = contentRef.current;
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of visible width
    const newPosition = direction === 'left' 
      ? Math.max(container.scrollLeft - scrollAmount, 0) 
      : Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  // Keyboard navigation
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
          const newIndex = Math.min(focusedIndex + 1, mediasArray.length - 1);
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
          const downIndex = Math.min(focusedIndex + itemsPerRow, mediasArray.length - 1);
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
          if (focusedIndex >= 0 && focusedIndex < mediasArray.length) {
            onMediaClick?.(mediasArray[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, mediasArray, onMediaClick, onFocusChange, onKeyDown]);

  // Flag to show load more button
  const shouldShowLoadMore = showLoadMore && onLoadMore;
  
  // Handle load more button click
  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaType) {
      // Navigate to the corresponding media type route
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
  if (mediasArray.length === 0 && !isLoading) {
    return null;
  }

  // Generate loading placeholders
  const loadingItems = Array.from({ length: 6 }).map((_, i) => (
    <LoadingCard key={`loading-${i}`} />
  ));

  return (
    <div 
      className="space-y-4 py-4 relative group" 
      id={`media-section-${sectionId}`} 
      data-section-id={sectionId}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>

      {/* Navigation arrows */}
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

      {/* Content container with horizontal scrolling */}
      <div 
        ref={contentRef}
        className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Display loading placeholders or actual content */}
        {isLoading ? loadingItems : mediasArray.map((media, index) => (
          <div
            key={`${media.id}-${index}`}
            className="w-48 flex-none cursor-pointer"
            onClick={() => handleClick(media)}
            data-section={sectionIndex}
            data-item={index}
          >
            <MediaCard
              media={media}
              index={index}
              isFocused={index === focusedIndex}
              onFocus={() => {
                setFocusedIndex(index);
                onFocusChange?.(index);
              }}
            />
          </div>
        ))}
        
        {/* Load more button */}
        {shouldShowLoadMore && (
          <div className="flex-none items-center justify-center w-48 h-72 flex">
            <button 
              onClick={handleLoadMore}
              className="group relative overflow-hidden rounded-lg bg-netflix-red hover:bg-red-700 transition-all duration-300 flex items-center justify-center cursor-pointer px-6 py-3 h-12 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-10"
              data-section-id={sectionId}
              tabIndex={focusedIndex === mediasArray.length ? 0 : -1}
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
  );
};

export default MediaSection;
