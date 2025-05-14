
import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';

interface MediaActionsProps {
  mediaId: number;
  mediaType?: string;
}

export const MediaActions = ({ mediaId, mediaType = 'movie' }: MediaActionsProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Convert the mediaId to string for our favorites system
  const strMediaId = String(mediaId);
  
  const handleToggleFavorite = () => {
    toggleFavorite(strMediaId, mediaType as any);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
      aria-label={isFavorite(strMediaId, mediaType as any) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`w-6 h-6 ${isFavorite(strMediaId, mediaType as any) ? 'fill-red-500 text-red-500' : 'text-white'}`}
      />
    </button>
  );
};
