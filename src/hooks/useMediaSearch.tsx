
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { searchMedia } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

export const useMediaSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search function
  const handleSearch = async (query: string) => {
    if (!user) {
      toast.error("É necessário fazer login para pesquisar");
      navigate("/auth");
      return [];
    }
    
    try {
      // If query is empty, return empty array instead of making an API call
      if (!query || query.trim() === "") {
        return [];
      }
      
      const results = await searchMedia(query);
      
      if (results.length === 0) {
        toast.info("Nenhum resultado encontrado para sua pesquisa.");
      }
      
      return results;
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
      return [];
    }
  };

  return { handleSearch };
};
