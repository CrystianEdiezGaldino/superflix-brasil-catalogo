import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeriesSeasonDetails } from "@/services/tmdbApi";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import SeriesHeader from "@/components/series/SeriesHeader";
import SeriesContent from "@/components/series/SeriesContent";
import SeriesActions from "@/components/series/SeriesActions";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import SeriesVideoPlayer from "@/components/series/SeriesVideoPlayer";
import { Series, Season } from "@/types/movie";
import Navbar from "@/components/Navbar";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading 
  } = useSubscription();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: series, isLoading, error } = useQuery<Series>({
    queryKey: ["series", id],
    queryFn: () => fetchSeriesDetails(id as string, 1),
    enabled: !!id && !!user,
  });

  const { data: seasonData, isLoading: isLoadingSeason } = useQuery<Season>({
    queryKey: ["series-season", id, selectedSeason],
    queryFn: () => fetchSeriesSeasonDetails(id as string, selectedSeason),
    enabled: !!id && !!user && !!selectedSeason,
  });

  // Scroll to player when it becomes visible
  useEffect(() => {
    if (showPlayer) {
      const playerElement = document.getElementById('video-player');
      if (playerElement) {
        setTimeout(() => {
          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [showPlayer]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Toggle favorite
  const toggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  // Show subscription modal if trying to watch without access
  const handleWatchClick = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
    } else {
      setShowPlayer(!showPlayer);
    }
  };

  const handleEpisodeSelect = (episode: number) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  const seasons = Array.from(
    { length: series?.number_of_seasons || 0 }, 
    (_, i) => i + 1
  );

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <SeriesLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !series}
      />

      {series && (
        <>
          <SeriesHeader 
            series={series} 
            isFavorite={isFavorite} 
            toggleFavorite={toggleFavorite} 
          />

          <SeriesActions 
            showPlayer={showPlayer} 
            hasAccess={hasAccess} 
            togglePlayer={handleWatchClick} 
          />

          {/* Player de vídeo usando componente dedicado */}
          {showPlayer && series.external_ids?.imdb_id && (
            <div className="px-6 md:px-10 mb-10">
              <SeriesVideoPlayer 
                showPlayer={true}
                imdbId={series.external_ids.imdb_id}
                hasAccess={hasAccess}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
              />
            </div>
          )}

          <SeriesContent 
            series={series} 
            hasAccess={hasAccess}
            seasonData={seasonData}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            seasons={seasons}
            setSelectedSeason={handleSeasonSelect}
            handleEpisodeSelect={handleEpisodeSelect}
            isLoadingSeason={isLoadingSeason}
            subscriptionLoading={subscriptionLoading}
          />
        </>
      )}
    </div>
  );
};

export default SeriesDetails; 