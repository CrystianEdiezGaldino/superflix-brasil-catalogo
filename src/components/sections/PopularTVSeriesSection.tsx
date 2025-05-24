
import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';
import { ChevronRight, ChevronLeft } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { cn } from '@/lib/utils';

interface PopularTVSeriesSectionProps {
  title: string;
  series: MediaItem[];
  onSeriesClick: (series: MediaItem) => void;
  isLoading?: boolean;
}

const PopularTVSeriesSection: React.FC<PopularTVSeriesSectionProps> = ({ 
  title, 
  series, 
  onSeriesClick,
  isLoading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check scroll position to control arrow visibility
  useEffect(() => {
    const container = containerRef.current;
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
  }, [series]);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(container.scrollLeft - scrollAmount, 0) 
      : Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      
      <div className="relative">
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
        
        <div 
          ref={containerRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4 pt-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            // Loading placeholders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={`loading-${i}`} className="w-64 h-40 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>
            ))
          ) : (
            // Actual content
            series.map((item, index) => (
              <div
                key={`popular-tv-${item.id}-${index}`}
                className="w-64 flex-none cursor-pointer"
                onClick={() => onSeriesClick(item)}
              >
                <MediaCard media={item} index={index} isFocused={false} />
              </div>
            ))
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
    </div>
  );
};

export default PopularTVSeriesSection;
