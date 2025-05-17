import { useState } from "react";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Heart, Play, Plus } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface MediaActionsProps {
  media: MediaItem;
  onWatch?: () => void;
}

const MediaActions = ({ media, onWatch }: MediaActionsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(media.id, media.media_type);
  };

  const isMediaFavorite = isFavorite(media.id);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="default" 
        size="sm" 
        className="bg-netflix-red hover:bg-red-700 flex items-center gap-1"
        onClick={onWatch}
      >
        <Play size={16} />
        <span>Assistir</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="border-gray-600 text-white hover:bg-gray-800"
        onClick={handleFavoriteClick}
        title={isMediaFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart 
          size={16} 
          className={isMediaFavorite ? "fill-netflix-red text-netflix-red" : ""}
        />
      </Button>
    </div>
  );
};

export default MediaActions;
