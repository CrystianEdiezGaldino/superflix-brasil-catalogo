import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useFavorites = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Function to add to favorites
  const addToFavorites = (mediaId: number) => {
    setFavorites(prev => {
      const newFavorites = [...prev, mediaId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  // Function to remove from favorites
  const removeFromFavorites = (mediaId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== mediaId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  // Check if specific item is in favorites
  const isFavorite = (mediaId: number) => {
    return favorites.includes(mediaId);
  };
  
  // Get all user favorites with reactQuery for better caching
  const { data: favoritesData, refetch: refetchFavorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Convert to MediaItem format
        return (data || []).map(fav => fav.media_id) as number[];
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        return [];
      }
    },
    enabled: !!user
  });

  const toggleFavorite = (mediaId: number) => {
    if (isFavorite(mediaId)) {
      removeFromFavorites(mediaId);
    } else {
      addToFavorites(mediaId);
    }
  };

  // Helper function to get media details
  const getMediaDetails = async (mediaId: number, mediaType: string) => {
    try {
      // Fetch from TMDB API via our backend service
      const apiUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=3e12a7e85d7a29a86a227c7a9743f556&language=pt-BR`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return {
        poster_path: data.poster_path,
        title: data.title,
        name: data.name
      };
    } catch (error) {
      console.error("Error fetching media details:", error);
      return { poster_path: null, title: null, name: null };
    }
  };
  
  // Simplified version for easy access
  const getFavorites = async (): Promise<number[]> => {
    await refetchFavorites();
    return favoritesData || [];
  };
  
  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavorites,
    isLoading: isLoading || isLoadingFavorites,
    refetchFavorites
  };
};
