import { useState, useEffect, useRef } from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Play, Heart, Share2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

interface MediaDetailsProps {
  media: MediaItem;
  onClose: () => void;
  onPlay: () => void;
  onAddToList: () => void;
  onShare: () => void;
}

const MediaDetails = ({ media, onClose, onPlay, onAddToList, onShare }: MediaDetailsProps) => {
  const [focusedElement, setFocusedElement] = useState<'play' | 'add' | 'share' | 'close'>('play');
  const { user } = useAuth();
  const { toast } = useToast();
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          if (focusedElement === 'play') setFocusedElement('add');
          else if (focusedElement === 'add') setFocusedElement('share');
          else if (focusedElement === 'share') setFocusedElement('close');
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (focusedElement === 'close') setFocusedElement('share');
          else if (focusedElement === 'share') setFocusedElement('add');
          else if (focusedElement === 'add') setFocusedElement('play');
          break;
        case "Enter":
          e.preventDefault();
          switch (focusedElement) {
            case 'play':
              onPlay();
              break;
            case 'add':
              if (user) {
                onAddToList();
              } else {
                toast({
                  title: "Atenção",
                  description: "Você precisa estar logado para adicionar itens à sua lista.",
                  variant: "destructive",
                });
              }
              break;
            case 'share':
              onShare();
              break;
            case 'close':
              onClose();
              break;
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedElement, onClose, onPlay, onAddToList, onShare, user, toast]);

  const getReleaseDate = () => {
    if ('release_date' in media) {
      return media.release_date;
    }
    if ('first_air_date' in media) {
      return media.first_air_date;
    }
    return 'Data não disponível';
  };

  return (
    <div
      ref={detailsRef}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={getMediaTitle(media)}
            className="w-full h-[40vh] object-cover rounded-t-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{getMediaTitle(media)}</h1>
            <p className="text-gray-300 mb-4">
              {media.media_type === 'movie' ? 'Filme' : 
               media.media_type === 'tv' ? 
                 media.original_language === 'ko' ? 'Dorama' : 'Série' : 
               'Anime'}
            </p>
            <div className="flex gap-4">
              <Button
                className={`flex items-center gap-2 ${
                  focusedElement === 'play' ? 'ring-2 ring-white' : ''
                }`}
                onClick={onPlay}
                onFocus={() => setFocusedElement('play')}
                tabIndex={focusedElement === 'play' ? 0 : -1}
              >
                <Play className="w-5 h-5" />
                Assistir
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  focusedElement === 'add' ? 'ring-2 ring-white' : ''
                }`}
                onClick={onAddToList}
                onFocus={() => setFocusedElement('add')}
                tabIndex={focusedElement === 'add' ? 0 : -1}
              >
                <Plus className="w-5 h-5" />
                Minha Lista
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  focusedElement === 'share' ? 'ring-2 ring-white' : ''
                }`}
                onClick={onShare}
                onFocus={() => setFocusedElement('share')}
                tabIndex={focusedElement === 'share' ? 0 : -1}
              >
                <Share2 className="w-5 h-5" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  focusedElement === 'close' ? 'ring-2 ring-white' : ''
                }`}
                onClick={onClose}
                onFocus={() => setFocusedElement('close')}
                tabIndex={focusedElement === 'close' ? 0 : -1}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-300 mb-4">{media.overview}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-medium">Data de Lançamento</p>
              <p>{getReleaseDate()}</p>
            </div>
            <div>
              <p className="font-medium">Avaliação</p>
              <p>{media.vote_average?.toFixed(1)}/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails; 