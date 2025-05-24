import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { watchHistoryService } from "@/services/watchHistoryService";
import { useEffect, useRef } from "react";

interface MediaActionsProps {
  onPlayClick: () => void;
  onFavoriteClick: () => void;
  isFavorite: boolean;
  hasAccess: boolean;
  showPlayer?: boolean;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  focusedButton?: string | null;
  onButtonFocus?: (button: string | null) => void;
}

const MediaActions = ({ 
  onPlayClick, 
  onFavoriteClick, 
  isFavorite, 
  hasAccess,
  showPlayer,
  tmdbId,
  mediaType,
  focusedButton,
  onButtonFocus
}: MediaActionsProps) => {
  const watchButtonRef = useRef<HTMLButtonElement>(null);
  const favoriteButtonRef = useRef<HTMLButtonElement>(null);

  const handlePlayClick = async () => {
    if (hasAccess) {
      console.log('Iniciando salvamento no histórico:', { tmdbId, mediaType });
      onPlayClick();
      try {
        const result = await watchHistoryService.addToHistory(tmdbId, mediaType);
        console.log('Resultado do salvamento:', result);
      } catch (error) {
        console.error('Erro detalhado ao adicionar ao histórico:', error);
      }
    } else {
      onPlayClick();
    }
  };

  // Efeito para scroll automático quando o botão recebe foco
  useEffect(() => {
    if (focusedButton === 'watch' && watchButtonRef.current) {
      watchButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (focusedButton === 'favorite' && favoriteButtonRef.current) {
      favoriteButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedButton]);

  // Navegação por controle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedButton) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (focusedButton === 'favorite') {
            onButtonFocus?.('watch');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (focusedButton === 'watch') {
            onButtonFocus?.('favorite');
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedButton === 'watch') {
            handlePlayClick();
          } else if (focusedButton === 'favorite') {
            onFavoriteClick();
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          onButtonFocus?.(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedButton, onButtonFocus, handlePlayClick, onFavoriteClick]);

  return (
    <div className="relative z-10 px-4 sm:px-6 md:px-10 mt-2 mb-8">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6">
        {/* Botão Assistir */}
        <button
          ref={watchButtonRef}
          onClick={handlePlayClick}
          disabled={!hasAccess}
          onFocus={() => onButtonFocus?.('watch')}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-3 px-6 sm:px-8 rounded-full font-medium text-base sm:text-lg transition-all duration-300 shadow-lg min-w-[45%] sm:min-w-0",
            showPlayer 
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : hasAccess 
                ? "bg-netflix-red hover:bg-red-700 text-white" 
                : "bg-gray-700 text-gray-300 cursor-not-allowed opacity-80",
            focusedButton === 'watch' && "ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
          )}
        >
          <Play fill="currentColor" size={20} className="sm:size-5" />
          <span>{showPlayer ? "Fechar Player" : "Assistir"}</span>
        </button>

        {/* Botão Favorito */}
        <button
          ref={favoriteButtonRef}
          onClick={onFavoriteClick}
          onFocus={() => onButtonFocus?.('favorite')}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-3 px-6 sm:px-8 rounded-full font-medium text-base transition-all duration-300 border-2 shadow-lg min-w-[45%] sm:min-w-0",
            isFavorite
              ? "bg-white/10 border-white text-white hover:bg-white/20"
              : "bg-black/60 backdrop-blur border-gray-600 text-gray-300 hover:border-white hover:text-white",
            focusedButton === 'favorite' && "ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
          )}
        >
          <Heart
            size={20}
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
