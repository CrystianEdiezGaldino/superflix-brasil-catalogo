
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface MediaCardProps {
  media: MediaItem;
  onClick?: (media: MediaItem) => void;
  className?: string;
  index: number;
  isFocused: boolean;
  onFocus: (index: number) => void;
}

const MediaCard = ({ 
  media, 
  onClick, 
  className = '', 
  index,
  isFocused,
  onFocus 
}: MediaCardProps) => {
  // Fail safe check for the media object
  if (!media) {
    return null;
  }

  // Determine link path based on media type
  const getLinkPath = () => {
    if (!media) return "#";
    
    const mediaId = (media as any).id;
    if (mediaId === undefined) return "#";
    
    if (!media.media_type) return `/filme/${mediaId}`;
    
    switch (media.media_type) {
      case 'movie':
        return `/filme/${mediaId}`;
      case 'tv':
        if ('original_language' in media) {
          if (media.original_language === 'ko') {
            return `/dorama/${mediaId}`;
          } else if (media.original_language === 'ja') {
            return `/anime/${mediaId}`;
          }
        }
        return `/serie/${mediaId}`;
      default:
        return `/filme/${mediaId}`;
    }
  };

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  const title = 'title' in media ? media.title : 'name' in media ? media.name : "Sem título";
  const rating = media.vote_average ? Math.round(media.vote_average * 10) / 10 : null;
  const mediaId = (media as any).id;
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(media);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (onClick) onClick(media);
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          onFocus(index - 1);
        } else {
          onFocus(index + 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        onFocus(index + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onFocus(index - 1);
        break;
    }
  };
  
  return (
    <Card 
      className={`bg-transparent border-none overflow-hidden group transition-all duration-200 ${
        isFocused ? 'scale-105 ring-4 ring-netflix-red z-10' : 'hover:scale-105'
      } ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(index)}
    >
      <Link 
        to={getLinkPath()}
        className="block overflow-hidden rounded-lg transition-all duration-300 relative"
        onClick={handleClick}
      >
        <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
          {posterUrl ? (
            <img 
              src={posterUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gray-900 flex items-center justify-center border border-gray-800">
              <div className="text-center p-4">
                <span className="text-gray-400 text-sm block mb-2">Sem imagem</span>
                <span className="text-gray-500 text-xs">{title}</span>
              </div>
            </div>
          )}
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
            isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="text-white font-medium">{title}</div>
            
            {rating && (
              <div className="flex items-center mt-1">
                <div className={`text-xs px-1.5 py-0.5 rounded ${
                  rating >= 7 ? 'bg-green-600' : 
                  rating >= 5 ? 'bg-yellow-600' : 
                  'bg-red-600'
                }`}>
                  {rating}
                </div>
              </div>
            )}
            
            {mediaId !== undefined && (
              <button 
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-netflix-red"
                onClick={(e) => {
                  e.preventDefault();
                  // Função de favorito será implementada posteriormente
                }}
              >
                <Heart size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-white truncate">{title}</div>
      </Link>
    </Card>
  );
};

export default MediaCard;
