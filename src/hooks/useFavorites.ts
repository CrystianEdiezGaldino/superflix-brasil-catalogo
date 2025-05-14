
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type MediaType = 'movie' | 'series' | 'anime' | 'dorama' | 'tv';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<MediaType, string[]>>({
    movie: [],
    series: [],
    anime: [],
    dorama: [],
    tv: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from localStorage when the user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [user]);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Record<MediaType, string[]>) => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    }
  };

  // Add to favorites
  const addToFavorites = (id: string, type: MediaType) => {
    if (!user) {
      toast.error('É necessário fazer login para adicionar aos favoritos');
      return;
    }

    setFavorites(prev => {
      const newFavorites = { ...prev };
      if (!newFavorites[type]) {
        newFavorites[type] = [];
      }

      const index = newFavorites[type].indexOf(id);
      if (index === -1) {
        newFavorites[type].push(id);
      }

      saveFavorites(newFavorites);
      toast.success('Adicionado aos favoritos');
      return newFavorites;
    });
  };

  // Remove from favorites
  const removeFromFavorites = (id: string, type: MediaType) => {
    if (!user) {
      toast.error('É necessário fazer login para remover dos favoritos');
      return;
    }

    setFavorites(prev => {
      const newFavorites = { ...prev };
      const index = newFavorites[type].indexOf(id);
      if (index !== -1) {
        newFavorites[type].splice(index, 1);
      }

      saveFavorites(newFavorites);
      toast.success('Removido dos favoritos');
      return newFavorites;
    });
  };

  // Check if it's in favorites
  const isFavorite = (id: string, type: MediaType) => {
    return favorites[type]?.includes(id) || false;
  };

  // Toggle favorite status
  const toggleFavorite = (id: string, type: MediaType) => {
    if (!user) return;

    if (isFavorite(id, type)) {
      removeFromFavorites(id, type);
    } else {
      addToFavorites(id, type);
    }
  };

  // Function to get all favorites as a flat array
  const getAllFavorites = () => {
    return Object.values(favorites).flat();
  };

  // Mock function for refetchFavorites
  const refetchFavorites = () => {
    setIsLoading(true);
    // In a real implementation with an API, this would fetch the latest favorites
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
    setIsLoading(false);
  };

  return {
    favorites,
    getAllFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    refetchFavorites
  };
};
