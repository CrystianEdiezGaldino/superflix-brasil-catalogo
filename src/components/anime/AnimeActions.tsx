import { Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimeActionsProps {
  showPlayer: boolean;
  hasAccess: boolean;
  togglePlayer: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const AnimeActions = ({
  showPlayer,
  hasAccess,
  togglePlayer,
  isFavorite,
  onToggleFavorite
}: AnimeActionsProps) => {
  return (
    <div className="relative z-10 mt-6 px-6 md:px-10 mb-8 flex items-center gap-4">
      <Button 
        onClick={togglePlayer} 
        className={`${hasAccess ? "bg-netflix-red" : "bg-gray-700"} hover:bg-red-700 text-lg py-6 px-8 rounded-xl flex items-center gap-2 flex-1`}
        disabled={!hasAccess}
      >
        <Play fill="white" size={20} />
        {showPlayer ? "Ocultar Player" : "Assistir Agora"}
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className={`rounded-xl p-6 ${isFavorite ? 'bg-netflix-red' : 'bg-gray-700 hover:bg-gray-600'}`}
        onClick={onToggleFavorite}
      >
        <Heart className={`${isFavorite ? 'text-white fill-current' : 'text-white'}`} size={24} />
      </Button>
    </div>
  );
};

export default AnimeActions;
