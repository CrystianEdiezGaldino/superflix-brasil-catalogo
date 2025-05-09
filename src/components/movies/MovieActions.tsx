
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieActionsProps {
  showPlayer: boolean;
  hasAccess: boolean;
  onPlayClick: () => void;
}

const MovieActions = ({ showPlayer, hasAccess, onPlayClick }: MovieActionsProps) => {
  return (
    <div className="relative z-10 mt-6 px-6 md:px-10 mb-8">
      <Button 
        onClick={onPlayClick} 
        className={`${hasAccess ? "bg-netflix-red" : "bg-gray-700"} hover:bg-red-700 text-lg py-6 px-8 rounded-xl flex items-center gap-2`}
        disabled={!hasAccess}
      >
        <Play fill="white" size={20} />
        {showPlayer ? "Ocultar Player" : "Assistir Agora"}
      </Button>
    </div>
  );
};

export default MovieActions;
