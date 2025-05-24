
import React from 'react';
import { MediaItem } from '@/types/movie';
import { Button } from '@/components/ui/button';
import MediaCard from '@/components/media/MediaCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface MediaSectionProps {
  title: string;
  medias: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore: () => void;
  sectionIndex: number;
  onMediaClick: (media: MediaItem) => void;
  className?: string; // Add className prop
}

const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  medias,
  showLoadMore = false,
  onLoadMore,
  sectionIndex,
  onMediaClick,
  className = "" // Default to empty string
}) => {
  if (!medias || medias.length === 0) {
    return null;
  }
  
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-4">
          {medias.map((media, index) => (
            <div
              key={`${media.id}-${index}-${sectionIndex}`}
              className="w-64 flex-none cursor-pointer"
              onClick={() => onMediaClick(media)}
            >
              <MediaCard 
                media={media} 
                index={index} 
                isFocused={false}
                onFocus={() => {}}
              />
            </div>
          ))}
          
          {showLoadMore && (
            <div className="flex items-center justify-center w-64 flex-none">
              <Button
                onClick={onLoadMore}
                className="h-32"
              >
                Carregar mais
              </Button>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MediaSection;
