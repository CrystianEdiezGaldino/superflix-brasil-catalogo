
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaActionsProps {
  onPlayClick: () => void;
  onFavoriteClick: () => void;
  isFavorite: boolean;
  hasAccess: boolean;
}

const MediaActions = ({ onPlayClick, onFavoriteClick, isFavorite, hasAccess }: MediaActionsProps) => {
  return (
    <div className="px-6 md:px-10 flex items-center space-x-4">
      <Button
        onClick={onPlayClick}
        className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium"
      >
        Assistir Agora
      </Button>

      <Button
        onClick={onFavoriteClick}
        variant="ghost"
        size="icon"
        className={`rounded-full p-6 ${
          isFavorite ? 'bg-netflix-red text-white hover:bg-netflix-red/90' : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        <Heart size={24} className={isFavorite ? 'fill-current' : ''} />
      </Button>
    </div>
  );
};

export default MediaActions;
