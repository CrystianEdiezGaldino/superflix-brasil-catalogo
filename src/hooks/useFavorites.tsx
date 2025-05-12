
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  
  // Use React Query to fetch favorites
  const { 
    data: favoritesData, 
    refetch: refetchFavorites, 
    isLoading 
  } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  useEffect(() => {
    if (favoritesData) {
      // Convert to MediaItem format if needed
      const mediaItems = favoritesData.map(fav => ({
        id: fav.media_id,
        media_type: fav.media_type,
        title: fav.title || '',
        name: fav.name || '',
        poster_path: fav.poster_path || '',
        backdrop_path: fav.backdrop_path || '',
        vote_average: 0,
        vote_count: 0,
        overview: '',
        genres: [],
        networks: [],
        episode_run_time: [],
        first_air_date: '',
        original_language: ''
      })) as MediaItem[];
      
      setFavorites(mediaItems);
    }
  }, [favoritesData]);

  // Function to add to favorites
  const addToFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) {
      toast.error("Faça login para adicionar aos favoritos");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local state
      refetchFavorites();
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Erro ao adicionar aos favoritos");
    }
  };
  
  // Function to remove from favorites
  const removeFromFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType);
      
      if (error) throw error;
      
      // Update local state
      refetchFavorites();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Erro ao remover dos favoritos");
    }
  };
  
  // Check if specific item is in favorites
  const isFavorite = useCallback((mediaId: number) => {
    return favorites.some(item => item.id === mediaId);
  }, [favorites]);
  
  // Toggle favorite status
  const toggleFavorite = async (mediaId: number, mediaType: string) => {
    if (isFavorite(mediaId)) {
      await removeFromFavorites(mediaId, mediaType);
    } else {
      await addToFavorites(mediaId, mediaType);
    }
  };
  
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
