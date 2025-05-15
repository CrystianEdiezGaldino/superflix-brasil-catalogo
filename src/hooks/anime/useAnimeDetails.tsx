
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Series, Season } from "@/types/movie";
import { useFavorites } from "@/hooks/useFavorites";
import { TMDB_API_URL, TMDB_API_KEY } from "@/config/tmdb";

// Adicionar a URL da API do SuperFlix
const SUPERFLIX_API_URL = "https://superflixapi.fyi";

export const useAnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Series | null>(null);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasValidImdbId, setHasValidImdbId] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Convert id to number for isFavorite function
  const numericId = id ? parseInt(id) : 0;
  // Using single argument version of isFavorite
  const isAnimeFavorite = numericId ? isFavorite(numericId) : false;
  
  const toggleAnimeFavorite = () => {
    if (id && anime) {
      toggleFavorite(numericId);
    }
  };

  // Verificar se o anime tem um ID IMDB válido
  useEffect(() => {
    if (anime) {
      const imdbId = anime.external_ids?.imdb_id || anime.imdb_id;
      setHasValidImdbId(!!imdbId);
    }
  }, [anime]);

  // Buscar detalhes do anime
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Buscar detalhes do anime usando a API do TMDB
        const response = await fetch(
          `${TMDB_API_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=external_ids,videos,credits,recommendations`
        );
        
        if (!response.ok) {
          throw new Error("Falha ao buscar detalhes do anime");
        }
        
        const data = await response.json();
        
        // Garantir que temos um ID IMDB válido
        if (!data.external_ids?.imdb_id && !data.imdb_id) {
          console.warn("Anime sem ID IMDB válido:", data.name);
          // Tentar buscar o ID IMDB de outra forma ou gerar um ID temporário
          // Por exemplo, usar o ID do TMDB como fallback
          data.imdb_id = `tmdb-${data.id}`;
        }
        
        setAnime(data);
        
        // Buscar dados da primeira temporada
        if (data.number_of_seasons > 0) {
          await fetchSeasonData(data.id, 1);
        } else {
          // Se não tiver temporadas, criar uma temporada padrão
          const defaultSeason: Season = {
            id: data.id,
            name: "Temporada 1",
            season_number: 1,
            episodes: [],
            poster_path: data.poster_path,
            overview: data.overview,
            air_date: data.first_air_date || "" // Adding required air_date property
          };
          setSeasonData(defaultSeason);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar detalhes do anime:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
        setIsLoading(false);
      }
    };
    
    fetchAnimeDetails();
  }, [id]);
  
  // Função para buscar dados de uma temporada específica
  const fetchSeasonData = async (animeId: number, seasonNumber: number) => {
    try {
      // Primeiro, tentar buscar da API do TMDB
      const response = await fetch(
        `${TMDB_API_URL}/tv/${animeId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=pt-BR`
      );
      
      if (!response.ok) {
        throw new Error(`Falha ao buscar dados da temporada ${seasonNumber}`);
      }
      
      const data = await response.json();
      
      // Se não tiver episódios, tentar buscar da API do SuperFlix
      if (!data.episodes || data.episodes.length === 0) {
        if (anime && (anime.external_ids?.imdb_id || anime.imdb_id)) {
          try {
            // Tentar buscar episódios da API do SuperFlix
            const imdbId = anime.external_ids?.imdb_id || anime.imdb_id;
            const superflixResponse = await fetch(
              `${SUPERFLIX_API_URL}/serie/${imdbId}/${seasonNumber}`
            );
            
            if (superflixResponse.ok) {
              const superflixData = await superflixResponse.json();
              if (superflixData && superflixData.episodes) {
                // Mesclar dados do TMDB com os episódios do SuperFlix
                data.episodes = superflixData.episodes;
              }
            }
          } catch (superflixErr) {
            console.error("Erro ao buscar episódios do SuperFlix:", superflixErr);
          }
        }
      }
      
      setSeasonData(data);
      return data;
    } catch (err) {
      console.error(`Erro ao buscar dados da temporada ${seasonNumber}:`, err);
      
      // Se falhar, criar uma temporada padrão
      if (anime) {
        const defaultSeason: Season = {
          id: anime.id || 0,
          name: `Temporada ${seasonNumber}`,
          season_number: seasonNumber,
          episodes: [],
          poster_path: anime.poster_path || "",
          overview: anime.overview || "",
          air_date: anime.first_air_date || "" // Adding required air_date property
        };
        
        setSeasonData(defaultSeason);
        return defaultSeason;
      }
      
      return null;
    }
  };
  
  return {
    anime,
    seasonData,
    isLoading,
    error,
    isAnimeFavorite,
    toggleAnimeFavorite,
    fetchSeasonData,
    hasValidImdbId
  };
};
