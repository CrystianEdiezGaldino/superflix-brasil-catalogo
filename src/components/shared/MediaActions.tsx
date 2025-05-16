
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaActionsProps {
  onPlayClick: () => void;
  onFavoriteClick: () => void;
  isFavorite: boolean;
  hasAccess: boolean;
}

const MediaActions = ({ onPlayClick, onFavoriteClick, isFavorite, hasAccess }: MediaActionsProps) => {
  return (
    <div className="relative z-10 px-4 sm:px-6 md:px-10 mt-2 mb-8">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 sm:gap-6">
        {/* Botão Assistir */}
        <button
          onClick={onPlayClick}
          disabled={!hasAccess}
          className={cn(
            "flex items-center gap-2 sm:gap-3 py-3 px-6 sm:px-8 rounded-full font-medium text-base sm:text-lg transition-all duration-300 shadow-lg",
            hasAccess 
              ? "bg-netflix-red hover:bg-red-700 text-white" 
              : "bg-gray-700 text-gray-300 cursor-not-allowed opacity-80"
          )}
        >
          <Play fill="currentColor" size={18} className="sm:size-5" />
          <span>Assistir</span>
        </button>

        {/* Botão Favorito */}
        <button
          onClick={onFavoriteClick}
          className={cn(
            "flex items-center gap-2 sm:gap-3 py-3 px-6 sm:px-8 rounded-full font-medium text-base transition-all duration-300 border-2 shadow-lg",
            isFavorite
              ? "bg-white/10 border-white text-white hover:bg-white/20"
              : "bg-black/60 backdrop-blur border-gray-600 text-gray-300 hover:border-white hover:text-white"
          )}
        >
          <Heart
            size={18}
            className={cn(
              "sm:size-5 transition-all duration-300", 
              isFavorite && "fill-netflix-red text-netflix-red"
            )}
          />
          <span>{isFavorite ? "Favorito" : "Favoritar"}</span>
        </button>
      </div>
    </div>
  );
};

export default MediaActions;
