
import React from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Info } from 'lucide-react';

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
  if (!items || items.length === 0) return null;

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Continuar assistindo</h2>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 pb-4">
          {items.map((item) => {
            // Generate random progress between 10% and 90%
            const progress = Math.floor(Math.random() * 80) + 10;
            
            return (
              <div 
                key={item.id}
                className="w-64 flex-none relative group cursor-pointer"
                onClick={() => onMediaClick(item)}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                    alt={item.title || item.name || ''}
                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div 
                      className="h-full bg-red-600" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                    <button className="bg-white rounded-full p-3">
                      <Play className="h-6 w-6 text-black fill-black" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-medium truncate">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span>
                        {Math.floor(progress / 10)} min restantes
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ContinueWatchingSection;
