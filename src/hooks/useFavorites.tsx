
import { useState } from "react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";

// Este é um hook simulado para gerenciar favoritos
// Em uma implementação real, você conectaria isso ao Supabase ou outra solução de backend
export const useFavorites = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para simular adição aos favoritos
  const addToFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Aqui você faria uma chamada real para o backend
      // Ex: await supabase.from('favorites').insert({ user_id: user.id, media_id: mediaId, media_type: mediaType })
      
      // Por enquanto, armazenamos no localStorage como demonstração
      const currentFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const newFav = { userId: user.id, mediaId, mediaType, addedAt: new Date().toISOString() };
      
      localStorage.setItem('favorites', JSON.stringify([...currentFavs, newFav]));
      return true;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para simular remoção dos favoritos
  const removeFromFavorites = async (mediaId: number, mediaType: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Aqui você faria uma chamada real para o backend
      // Ex: await supabase.from('favorites').delete().match({ user_id: user.id, media_id: mediaId, media_type: mediaType })
      
      // Por enquanto, removemos do localStorage
      const currentFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedFavs = currentFavs.filter(
        (fav: any) => !(fav.userId === user.id && fav.mediaId === mediaId && fav.mediaType === mediaType)
      );
      
      localStorage.setItem('favorites', JSON.stringify(updatedFavs));
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
      // Aqui você faria uma chamada real para o backend
      // Ex: const { data } = await supabase.from('favorites').select().match({ user_id: user.id, media_id: mediaId, media_type: mediaType })
      
      // Por enquanto, verificamos no localStorage
      const currentFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return currentFavs.some(
        (fav: any) => fav.userId === user.id && fav.mediaId === mediaId && fav.mediaType === mediaType
      );
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
      // Aqui você faria uma chamada real para o backend
      // Ex: const { data } = await supabase.from('favorites').select().eq('user_id', user.id)
      
      // Por enquanto, obtemos do localStorage
      const currentFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const userFavs = currentFavs.filter((fav: any) => fav.userId === user.id);
      
      // Em uma implementação real, você buscaria os detalhes completos dos itens favoritos
      // Por enquanto, retornamos uma lista vazia já que não temos acesso real aos dados
      return [];
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      return [];
    } finally {
      setIsLoading(false);
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
