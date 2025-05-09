
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard = ({ media }: MediaCardProps) => {
  // Fail safe check for the media object
  if (!media) {
    return null;
  }

  // Determine link path based on media type
  const getLinkPath = () => {
    if (!media || !media.id) return "#";
    
    if (!media.media_type) return `/filme/${media.id}`;
    
    switch (media.media_type) {
      case 'movie':
        return `/filme/${media.id}`;
      case 'tv':
        // Verificar se é um anime ou dorama (coreano)
        if ('original_language' in media) {
          if (media.original_language === 'ko') {
            return `/dorama/${media.id}`;
          } else if (media.original_language === 'ja') {
            return `/anime/${media.id}`;
          }
        }
        return `/serie/${media.id}`;
      default:
        return `/filme/${media.id}`;
    }
  };

  // Handle missing poster image
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : '/placeholder.svg';

  // Get title (handle both movie and tv show titles)
  const title = 'title' in media ? media.title : 'name' in media ? media.name : "Sem título";
  
  // Get vote average if available
  const rating = media.vote_average ? Math.round(media.vote_average * 10) / 10 : null;
  
  return (
    <Card className="bg-transparent border-none overflow-hidden group">
      <Link 
        to={getLinkPath()}
        className="block overflow-hidden rounded-lg transition-transform duration-300 relative"
      >
        <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
          <img 
            src={posterUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
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
            
            {media.id && (
              <FavoriteButton 
                mediaId={media.id.toString()} 
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
