
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeriesDetails, fetchSeriesSeasonDetails } from "@/services/tmdbApi";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { toast } from "sonner";
import { Series, Season } from "@/types/movie";

export const useSeriesDetails = (providedId?: string) => {
  const { id: urlId } = useParams<{ id: string }>();
  const id = providedId || urlId;
  
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const navigate = useNavigate();
  
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, subscriptionLoading } = useAccessControl();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: series, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series", id],
    queryFn: () => fetchSeriesDetails(id || ""),
    enabled: !!id && !!user,
  });

  const { data: seasonData, isLoading: isLoadingSeason } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: () => fetchSeriesSeasonDetails(id || "", selectedSeason),
    enabled: !!id && !!series && !!user,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      setSelectedEpisode(seasonData.episodes[0].episode_number);
    }
  }, [seasonData]);

  const handleEpisodeSelect = (episodeNumber: number) => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePlayer = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    setShowPlayer(!showPlayer);
  };

  return {
    series: series as Series | undefined,
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
    hasAccess
  };
};
