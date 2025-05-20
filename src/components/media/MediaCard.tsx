import React from "react";
import { Link } from "react-router-dom";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Heart, Play, Star } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addToWatchHistory } from "@/services/supabase/watchHistory";
import { toast } from "sonner";

interface MediaCardProps {
  media: MediaItem;
  onClick?: (media: MediaItem) => void;
  className?: string;
  tabIndex?: number;
  index: number;
  isFocused: boolean;
  onFocus: (index: number) => void;
  sectionIndex?: number;
  itemIndex?: number;
}

const MediaCard = ({ 
  media, 
  onClick, 
  className = '', 
  tabIndex, 
  index, 
  isFocused, 
  onFocus,
  sectionIndex,
  itemIndex
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const itemsPerRow = window.innerWidth >= 1280 ? 6 : 
                       window.innerWidth >= 1024 ? 5 : 
                       window.innerWidth >= 768 ? 4 : 
                       window.innerWidth >= 640 ? 3 : 2;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleClick(e);
        break;
      case "ArrowRight":
        e.preventDefault();
        onFocus(index + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        onFocus(index - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        onFocus(index - itemsPerRow);
        break;
      case "ArrowDown":
        e.preventDefault();
        onFocus(index + itemsPerRow);
        break;
    }
  };

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
  
  const handleClick = async (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(media);
    }

    if (user) {
      try {
        await addToWatchHistory(media, user.id);
      } catch (error) {
        console.error('Error adding to watch history:', error);
        toast.error('Erro ao adicionar ao histórico de visualização');
      }
    }
  };
  
  // Função para determinar a classificação indicativa
  const getRating = (voteAverage: number) => {
    if (voteAverage >= 8) return "L";
    if (voteAverage >= 7) return "10";
    if (voteAverage >= 6) return "12";
    if (voteAverage >= 5) return "14";
    return "16";
  };

  return (
    <Card 
      ref={cardRef}
      className={`bg-transparent border-none overflow-hidden group ${className} ${
        isFocused ? "scale-105 z-10" : "hover:scale-105"
      }`}
      data-section={sectionIndex}
      data-item={itemIndex}
    >
      <Link 
        to={getLinkPath()}
        className="block overflow-hidden rounded-lg transition-all duration-300 relative focus:outline-none focus:scale-105 focus:ring-4 focus:ring-netflix-red"
        onClick={handleClick}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="text-white font-medium group-focus-within:text-netflix-red transition-colors duration-200">{title}</div>
            
            {rating && (
              <div className="flex items-center gap-2 mt-1">
                <div className={`text-xs px-1.5 py-0.5 rounded ${
                  rating >= 7 ? 'bg-green-600' : 
                  rating >= 5 ? 'bg-yellow-600' : 
                  'bg-red-600'
                }`}>
                  {rating}
                </div>
                <div className="text-xs px-1.5 py-0.5 rounded bg-gray-700">
                  {getRating(rating)}
                </div>
              </div>
            )}
            
            {mediaId !== undefined && (
              <FavoriteButton 
                mediaId={Number(mediaId)} 
                mediaType={media.media_type || 'movie'} 
              />
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-white group-focus-within:text-netflix-red transition-colors duration-200 truncate">{title}</div>
      </Link>
    </Card>
  );
};

export default MediaCard;
