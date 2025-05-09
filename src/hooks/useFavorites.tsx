
import { useState } from "react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useFavorites = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para adicionar aos favoritos
  const addToFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Get the poster path and title for this media item
      const { poster_path, title, name } = await getMediaDetails(mediaId, mediaType);
      
      // Insert into Supabase favorites table
      const { error } = await supabase.from('favorites').insert({ 
        user_id: user.id, 
        media_id: mediaId, 
        media_type: mediaType,
        poster_path,
        title: title || name || 'Sem título'
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para remover dos favoritos
  const removeFromFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Remove from Supabase favorites table
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar se um item específico é favorito
  const isFavorite = async (mediaId: number, mediaType: string) => {
    if (!user) return false;
    
    try {
      // Check if item exists in Supabase favorites table
      const { data, error } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', user.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .maybeSingle();
      
      if (error) throw error;
      
      return !!data;
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      return false;
    }
  };
  
  // Obter todos os favoritos do usuário
  const getFavorites = async (): Promise<MediaItem[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    try {
      // Get all favorites from Supabase
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Convert to MediaItem format
      return (data || []).map(fav => ({
        id: fav.media_id,
        media_type: fav.media_type,
        poster_path: fav.poster_path,
        title: fav.title,
        vote_average: 0,
        // Add required fields for MediaItem type
        overview: '',
        backdrop_path: '',
        release_date: '',
      })) as MediaItem[];
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      return [];
    } finally {
      setIsLoading(false);
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
  
  return {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    isLoading
  };
};
