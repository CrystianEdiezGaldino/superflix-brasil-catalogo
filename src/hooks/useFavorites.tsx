
import { useState, useEffect, useCallback } from "react";
import { MediaItem, Movie, Series } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "@/services/tmdb/movies";
import { fetchSeriesDetails } from "@/services/tmdb/series";

interface FavoriteItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: string;
  title: string;
  poster_path: string;
  added_at: string;
}

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
      const mediaItems = favoritesData.map((fav: FavoriteItem) => {
        const baseItem = {
          id: fav.media_id,
          media_type: fav.media_type as 'movie' | 'tv',
          overview: '',
          poster_path: fav.poster_path,
          backdrop_path: '',
          vote_average: 0,
          genres: [],
          genre_ids: []
        };

        if (fav.media_type === 'movie') {
          return {
            ...baseItem,
            title: fav.title,
            release_date: '',
            original_title: fav.title,
            runtime: 0,
            status: 'Released',
            vote_count: 0,
            popularity: 0
          } as Movie;
        } else {
          return {
            ...baseItem,
            name: fav.title,
            first_air_date: '',
            original_name: fav.title,
            original_language: '',
            number_of_seasons: 0,
            number_of_episodes: 0,
            status: 'Returning Series',
            seasons: []
          } as Series;
        }
      });
      
      setFavorites(mediaItems);
    }
  }, [favoritesData]);

  // Function to get all favorites IDs - Adding this to fix the missing method error
  const getAllFavorites = useCallback(() => {
    return favorites.map(fav => fav.id);
  }, [favorites]);

  // Function to add to favorites
  const addToFavorites = async (mediaId: number, mediaType: string) => {
    console.log('Tentando adicionar aos favoritos:', { mediaId, mediaType, userId: user?.id });
    
    if (!user) {
      toast.error("Faça login para adicionar aos favoritos");
      return;
    }

    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Erro ao verificar sessão:", sessionError);
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      return;
    }
    
    try {
      // Buscar informações do TMDB baseado no tipo
      let mediaInfo;
      if (mediaType === 'movie') {
        mediaInfo = await fetchMovieDetails(mediaId.toString());
      } else {
        mediaInfo = await fetchSeriesDetails(mediaId.toString());
      }

      if (!mediaInfo) {
        throw new Error("Não foi possível encontrar informações do item");
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          title: mediaType === 'movie' ? mediaInfo.title : (mediaInfo as Series).name || '',
          poster_path: mediaInfo.poster_path || '',
          added_at: new Date().toISOString()
        })
        .select();
      
      console.log('Resposta do Supabase ao adicionar:', { data, error });
      
      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }
      
      // Update local state
      await refetchFavorites();
      toast.success("Adicionado aos favoritos com sucesso!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Erro ao adicionar aos favoritos. Tente novamente.");
    }
  };
  
  // Function to remove from favorites
  const removeFromFavorites = async (mediaId: number, mediaType: string) => {
    console.log('Tentando remover dos favoritos:', { mediaId, mediaType, userId: user?.id });
    
    if (!user) {
      toast.error("Faça login para remover dos favoritos");
      return;
    }

    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Erro ao verificar sessão:", sessionError);
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .select();
      
      console.log('Resposta do Supabase ao remover:', { data, error });
      
      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }
      
      // Update local state
      await refetchFavorites();
      toast.success("Removido dos favoritos com sucesso!");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Erro ao remover dos favoritos. Tente novamente.");
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
    refetchFavorites,
    getAllFavorites // Add this to fix the missing method error
  };
};
