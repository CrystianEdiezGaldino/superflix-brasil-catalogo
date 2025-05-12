
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MediaItem } from '@/types/movie';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar favoritos do localStorage quando o usuário mudar
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [user]);

  // Salvar favoritos no localStorage
  const saveFavorites = (newFavorites: number[]) => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  // Adicionar aos favoritos
  const addToFavorites = (mediaId: number) => {
    if (!user) {
      toast.error('É necessário fazer login para adicionar aos favoritos');
      return;
    }

    const newFavorites = [...favorites, mediaId];
    saveFavorites(newFavorites);
    toast.success('Adicionado aos favoritos');
  };

  // Remover dos favoritos
  const removeFromFavorites = (mediaId: number) => {
    if (!user) {
      toast.error('É necessário fazer login para remover dos favoritos');
      return;
    }

    const newFavorites = favorites.filter(id => id !== mediaId);
    saveFavorites(newFavorites);
    toast.success('Removido dos favoritos');
  };

  // Toggle favorite status - added for compatibility with new components
  const toggleFavorite = useCallback((mediaId: number, mediaType: string = '') => {
    if (isFavorite(mediaId)) {
      removeFromFavorites(mediaId);
    } else {
      addToFavorites(mediaId);
    }
  }, [favorites]);

  // Verificar se está nos favoritos
  const isFavorite = useCallback((mediaId: number) => {
    return favorites.includes(mediaId);
  }, [favorites]);

  // Mock function for refetchFavorites - for compatibility
  const refetchFavorites = useCallback(() => {
    // In a real implementation with an API, this would fetch the latest favorites
    const storedFavorites = user ? localStorage.getItem(`favorites_${user.id}`) : null;
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, [user]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    refetchFavorites
  };
}; 
