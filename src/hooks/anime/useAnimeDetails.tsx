
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { useFavorites } from "@/hooks/useFavorites";

export const useAnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for anime details
        const mockAnime: MediaItem = {
          id: parseInt(id),
          title: `Anime ${id}`,
          name: `Anime ${id}`,
          overview: "Este é um anime de exemplo com uma história épica que envolve aventura, amizade e superação. Acompanhe os personagens em sua jornada através de um mundo fantástico cheio de desafios e descobertas.",
          poster_path: "/placeholder-anime.jpg",
          backdrop_path: "/placeholder-anime-backdrop.jpg",
          media_type: "tv",
          vote_average: 8.7,
          vote_count: 1200,
          release_date: "",
          first_air_date: "2023-01-15",
          genres: [
            { id: 16, name: "Animação" },
            { id: 10759, name: "Ação & Aventura" },
            { id: 10765, name: "Sci-Fi & Fantasia" }
          ],
          networks: [
            { id: 1, name: "Crunchyroll", logo_path: "/logo.jpg" }
          ],
          episode_run_time: [24],
          original_language: "ja"
        };
        
        setAnime(mockAnime);
      } catch (err) {
        console.error("Erro ao buscar detalhes do anime:", err);
        setError("Não foi possível carregar os detalhes do anime. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnimeDetails();
  }, [id]);
  
  // Verifica se o anime está nos favoritos
  const isAnimeFavorite = anime ? isFavorite(anime.id) : false;
  
  // Função para alternar o status de favorito
  const toggleAnimeFavorite = () => {
    if (anime) {
      toggleFavorite(anime.id);
    }
  };
  
  return {
    anime,
    isLoading,
    error,
    isAnimeFavorite,
    toggleAnimeFavorite
  };
};
