import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { useFavorites } from "@/hooks/useFavorites";
import { buildApiUrl, fetchFromApi } from "@/services/tmdb/utils";

interface TMDBTVResponse {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genres: Array<{ id: number; name: string }>;
  networks: Array<{ id: number; name: string; logo_path: string | null }>;
  episode_run_time: number[];
  original_language: string;
  external_ids: {
    imdb_id: string | null;
    [key: string]: string | null;
  };
}

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
        // Fetch anime details from TMDB API
        const url = buildApiUrl(`/tv/${id}`);
        const data = await fetchFromApi<TMDBTVResponse>(url);
        
        if (!data) {
          throw new Error('Anime não encontrado');
        }

        // Transform the data to match MediaItem type
        const animeData: MediaItem = {
          id: data.id,
          title: data.name,
          name: data.name,
          overview: data.overview,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          media_type: "tv",
          vote_average: data.vote_average,
          vote_count: data.vote_count,
          release_date: "",
          first_air_date: data.first_air_date,
          genres: data.genres || [],
          networks: data.networks || [],
          episode_run_time: data.episode_run_time || [24],
          original_language: data.original_language || "ja",
          imdb_id: data.external_ids?.imdb_id,
          external_ids: data.external_ids
        };
        
        setAnime(animeData);
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
