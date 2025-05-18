
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteButtonProps {
  mediaId: number;
  mediaType: string;
  className?: string;
}

const FavoriteButton = ({ mediaId, mediaType, className = '' }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Você precisa estar logado para adicionar favoritos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      setIsFavorite(prev => !prev);
      toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
      // Here we would normally call the API to add/remove from favorites
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      setIsFavorite(prev => !prev); // Revert on error
      toast.error('Erro ao atualizar favorito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`absolute top-2 right-2 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-netflix-red ${className}`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart
        size={16}
        className={`transition-all ${isFavorite ? 'fill-white text-white' : 'text-white'}`}
      />
    </button>
  );
};

export default FavoriteButton;
