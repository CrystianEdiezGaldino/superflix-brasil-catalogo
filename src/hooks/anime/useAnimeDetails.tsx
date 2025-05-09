
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchSeriesDetails, fetchSeriesSeasonDetails } from "@/services/tmdbApi";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { Series, Season } from "@/types/movie";

export const useAnimeDetails = (providedId?: string) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasons, setSeasons] = useState<number[]>([]);
  const navigate = useNavigate();
  
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, subscriptionLoading } = useAccessControl();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch anime details (same as series since they are TV shows in TMDB)
  const { data: anime, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["anime", providedId],
    queryFn: () => fetchSeriesDetails(providedId || ""),
    enabled: !!providedId && !!user,
  });

  // When anime details load, set up the available seasons
  useEffect(() => {
    if (anime && anime.number_of_seasons) {
      const seasonNumbers: number[] = [];
      for (let i = 1; i <= anime.number_of_seasons; i++) {
        seasonNumbers.push(i);
      }
      setSeasons(seasonNumbers);
    }
  }, [anime]);

  // Fetch season data for the selected season
  const { data: seasonData, isLoading: isLoadingSeason } = useQuery({
    queryKey: ["anime-season", providedId, selectedSeason],
    queryFn: () => fetchSeriesSeasonDetails(providedId || "", selectedSeason),
    enabled: !!providedId && !!anime && !!user,
  });

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [providedId]);

  // When season data loads, set the default selected episode to the first one
  useEffect(() => {
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      setSelectedEpisode(seasonData.episodes[0].episode_number);
    }
  }, [seasonData]);

  // Handle episode selection and season changes
  const handleEpisodeSelect = (season: number, episodeNumber: number) => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    if (season !== selectedSeason) {
      setSelectedSeason(season);
      setSelectedEpisode(episodeNumber);
    } else {
      setSelectedEpisode(episodeNumber);
    }
    
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle player visibility
  const togglePlayer = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Check if this anime is in favorites
  const checkIsFavorite = async (id: number) => {
    if (!id) return false;
    try {
      return await isFavorite(id, 'tv');
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  };

  // Toggle favorite status for this anime
  const toggleFavoriteAnime = async () => {
    if (!anime || !anime.id) return;
    
    try {
      const isFav = await checkIsFavorite(anime.id);
      
      if (isFav) {
        await removeFromFavorites(anime.id, 'tv');
        toast.success("Removido dos favoritos");
      } else {
        await addToFavorites(anime.id, 'tv');
        toast.success("Adicionado aos favoritos");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Erro ao atualizar favoritos");
    }
  };

  return {
    anime: anime as Series | undefined,
    seasonData: seasonData as Season | undefined,
    showPlayer,
    selectedSeason,
    selectedEpisode,
    setSelectedSeason,
    handleEpisodeSelect,
    togglePlayer,
    isLoadingSeries,
    isLoadingSeason,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess,
    seasons,
    isFavorite: async () => anime?.id ? await checkIsFavorite(anime.id) : false,
    toggleFavoriteAnime
  };
};
