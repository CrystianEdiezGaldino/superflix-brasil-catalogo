import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SeriesActionsProps {
  showPlayer: boolean;
  hasAccess: boolean;
  onPlayClick: () => void;
}

const SeriesActions = ({ showPlayer, hasAccess, onPlayClick }: SeriesActionsProps) => {
  return (
    <div className="px-6 md:px-10 py-4">
      <button
        onClick={onPlayClick}
        className={`px-8 py-3 rounded-md font-semibold transition ${
          hasAccess 
            ? 'bg-white text-black hover:bg-opacity-80' 
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
        disabled={!hasAccess}
      >
        {showPlayer ? 'Voltar para detalhes' : 'Assistir'}
      </button>
    </div>
  );
};

export default SeriesActions;
