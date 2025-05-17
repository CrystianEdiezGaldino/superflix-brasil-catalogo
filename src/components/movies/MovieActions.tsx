import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieActionsProps {
  showPlayer: boolean;
  hasAccess: boolean;
  onPlayClick: () => void;
}

const MovieActions = ({ showPlayer, hasAccess, onPlayClick }: MovieActionsProps) => {
  return (
    <div className="relative z-10 mt-4 sm:mt-6 px-4 sm:px-6 md:px-10 mb-6 sm:mb-8">
      <Button 
        onClick={onPlayClick} 
        className={`${hasAccess ? "bg-netflix-red" : "bg-gray-700"} hover:bg-red-700 text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 rounded-lg sm:rounded-xl flex items-center gap-2 w-full sm:w-auto`}
        disabled={!hasAccess}
      >
        <Play fill="white" size={18} className="sm:size-5" />
        {showPlayer ? "Ocultar Player" : "Assistir Agora"}
      </Button>
    </div>
  );
};

export default MovieActions;
