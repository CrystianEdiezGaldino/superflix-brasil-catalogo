import { Play, Heart } from "lucide-react";

interface SeriesActionsProps {
  showPlayer: boolean;
  hasAccess: boolean;
  togglePlayer: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const SeriesActions = ({
  showPlayer,
  hasAccess,
  togglePlayer,
  isFavorite,
  onToggleFavorite
}: SeriesActionsProps) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        onClick={togglePlayer}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
          showPlayer
            ? "bg-netflix-red/20 text-netflix-red border border-netflix-red hover:bg-netflix-red/30"
            : "bg-netflix-red text-white hover:bg-netflix-red/90"
        }`}
      >
        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        {showPlayer ? "Fechar Player" : "Assistir"}
      </button>

      <button
        onClick={onToggleFavorite}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
          isFavorite
            ? "bg-netflix-red/20 text-netflix-red border border-netflix-red hover:bg-netflix-red/30"
            : "bg-netflix-gray text-gray-300 hover:bg-netflix-gray-hover"
        }`}
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-netflix-red" : ""}`} />
        {isFavorite ? "Favorito" : "Favoritar"}
      </button>
    </div>
  );
};

export default SeriesActions;
