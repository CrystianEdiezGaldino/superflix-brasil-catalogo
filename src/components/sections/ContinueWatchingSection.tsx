import React, { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/types/movie';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ContinueWatchingProps {
  items: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
  className?: string;
}

const ContinueWatchingSection: React.FC<ContinueWatchingProps> = ({ 
  items, 
  onMediaClick,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<{[key: number]: number}>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    if (items && items.length > 0) {
      const timer = setTimeout(() => {
        const progress = items.reduce((acc, item) => {
          acc[item.id] = Math.floor(Math.random() * 80) + 10;
          return acc;
        }, {} as {[key: number]: number});
        
        setProgressData(progress);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [items]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const cardWidth = 320; // w-80 (320px) + space-x-4 (16px)
    const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time
    
    const newScrollLeft = direction === 'left' 
      ? Math.max(0, scrollRef.current.scrollLeft - scrollAmount)
      : Math.min(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
          scrollRef.current.scrollLeft + scrollAmount
        );
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Continuar assistindo</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[calc(50%-40px)] -translate-y-1/2 z-10 h-14 w-14 rounded-full backdrop-blur-md bg-black/30 border border-white/20 hover:bg-[rgb(229,9,20)] hover:border-[rgb(229,9,20)] transition-all duration-300 shadow-lg shadow-black/20"
            variant="ghost"
          >
            <ChevronLeft className="h-7 w-7 text-white" />
          </Button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[calc(50%-40px)] -translate-y-1/2 z-10 h-14 w-14 rounded-full backdrop-blur-md bg-black/30 border border-white/20 hover:bg-[rgb(229,9,20)] hover:border-[rgb(229,9,20)] transition-all duration-300 shadow-lg shadow-black/20"
            variant="ghost"
          >
            <ChevronRight className="h-7 w-7 text-white" />
          </Button>
        )}

        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex space-x-4 pb-4 px-2 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => {
              const progress = progressData[item.id];
              
              return (
                <div 
                  key={item.id}
                  className="w-80 flex-none relative group/item cursor-pointer"
                  onClick={() => onMediaClick(item)}
                >
                  <div className="relative overflow-hidden rounded-md">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                      alt={item.title || item.name || ''}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover/item:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Progress bar - only visible on hover */}
                    {!isLoading && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700/50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <div 
                          className="h-full bg-[rgb(229,9,20)] transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 bg-black/50">
                      <button className="bg-white rounded-full p-3">
                        <Play className="h-6 w-6 text-black fill-black" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white text-base font-medium truncate">
                        {item.title || item.name}
                      </h3>
                      {!isLoading && progress && (
                        <div className="flex items-center text-sm text-gray-400 mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <span>
                            {Math.floor(progress / 10)} min restantes
                          </span>
                        </div>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingSection;
