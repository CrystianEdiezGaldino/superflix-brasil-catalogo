import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';

interface MediaActionsProps {
  mediaId: number;
}

export const MediaActions = ({ mediaId }: MediaActionsProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <button
      onClick={() => toggleFavorite(mediaId)}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
      aria-label={isFavorite(mediaId) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`w-6 h-6 ${isFavorite(mediaId) ? 'fill-red-500 text-red-500' : 'text-white'}`}
      />
    </button>
  );
}; 