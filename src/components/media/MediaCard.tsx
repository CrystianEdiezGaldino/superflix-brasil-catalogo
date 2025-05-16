import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface MediaCardProps {
  media: MediaItem;
  onClick?: (media: MediaItem) => void;
}

const MediaCard = ({ media, onClick }: MediaCardProps) => {
  // Fail safe check for the media object
  if (!media) {
    return null;
  }

  // Determine link path based on media type
  const getLinkPath = () => {
    // First check if media and media.id exist to avoid TypeScript errors
    if (!media) return "#";
    
    // Use type assertion to handle the potential 'never' type
    const mediaId = (media as any).id;
    if (mediaId === undefined) return "#";
    
    if (!media.media_type) return `/filme/${mediaId}`;
    
    switch (media.media_type) {
      case 'movie':
        return `/filme/${mediaId}`;
      case 'tv':
        // Verificar se é um anime ou dorama (coreano)
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

  // Handle missing poster image
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  // Get title (handle both movie and tv show titles)
  const title = 'title' in media ? media.title : 'name' in media ? media.name : "Sem título";
  
  // Get vote average if available
  const rating = media.vote_average ? Math.round(media.vote_average * 10) / 10 : null;
  
  // Use type assertion to handle the ID for favorite button
  const mediaId = (media as any).id;
  
  const handleClick = (e: React.MouseEvent) => {
    // If a click handler is provided, use it
    if (onClick) {
      e.preventDefault();
      onClick(media);
    }
  };
  
  return (
    <Card className="bg-transparent border-none overflow-hidden group">
      <Link 
        to={getLinkPath()}
        className="block overflow-hidden rounded-lg transition-transform duration-300 relative"
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
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
              <FavoriteButton 
                mediaId={Number(mediaId)} 
                mediaType={media.media_type || 'movie'} 
              />
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-white truncate">{title}</div>
      </Link>
    </Card>
  );
};

export default MediaCard;
