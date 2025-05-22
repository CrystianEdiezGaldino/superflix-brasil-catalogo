
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MediaItem, getMediaTitle } from '@/types/movie';
import { useNavigate, useLocation } from 'react-router-dom';
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
  onLoadMore,
  isLoading = false,
  onMediaClick,
  sectionId = "section",
  mediaType = "movie",
  focusedItem = -1,
  onFocusChange,
  onKeyDown,
  sectionIndex
}: MediaSectionProps) => {
  const [focusedIndex, setFocusedIndex] = useState(focusedItem);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setFocusedIndex(focusedItem);
  }, [focusedItem]);

  const handleClick = (media: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(media);
    } else {
      if (media.media_type === 'movie') {
        navigate(`/filme/${media.id}`);
      } else if (media.media_type === 'tv') {
        if (media.original_language === 'ko') {
          navigate(`/dorama/${media.id}`);
        } else if (media.original_language === 'ja') {
          navigate(`/anime/${media.id}`);
        } else {
          navigate(`/serie/${media.id}`);
        }
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    onFocusChange?.(index);
  };

  // Ensure medias is an array
  const mediasArray = Array.isArray(medias) ? medias : [];

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={`skeleton-${sectionId}-${index}`}
              className="animate-pulse bg-gray-800 rounded-md aspect-[2/3]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no media items
  if (!mediasArray.length) {
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
        {mediasArray.map((media, index) => (
          <div
            key={`section-${sectionIndex}-media-${media.id}-${index}`}
            data-section={sectionIndex}
            data-item={index}
            className={`relative group cursor-pointer transition-all duration-300 ${
              index === focusedIndex ? 'ring-2 ring-netflix-red scale-105' : ''
            }`}
            onClick={() => handleClick(media)}
            tabIndex={index === focusedIndex ? 0 : -1}
          >
            <img
              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
              alt={getMediaTitle(media)}
              className="rounded-md w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <h3 className="text-white font-medium truncate">{getMediaTitle(media)}</h3>
              <p className="text-sm text-gray-300">
                {media.media_type === 'movie' ? 'Filme' : 
                 media.media_type === 'tv' ? 
                   media.original_language === 'ko' ? 'Dorama' : 'Série' : 
                 'Anime'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showLoadMore && onLoadMore && !isHomePage && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onLoadMore}
            className="bg-netflix-red hover:bg-red-700"
          >
            Carregar Mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
