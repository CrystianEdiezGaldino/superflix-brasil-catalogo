import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useSeriesDetails } from "@/hooks/useSeriesDetails";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import SeriesHeader from "@/components/series/SeriesHeader";
import SeriesActions from "@/components/series/SeriesActions";
import SeriesPlayer from "@/components/series/SeriesPlayer";
import SeriesContent from "@/components/series/SeriesContent";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading 
  } = useSubscription();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;
  
  const {
    series,
    seasonData,
    selectedSeason,
    selectedEpisode,
    setSelectedSeason,
    handleEpisodeSelect,
    isLoadingSeries,
    isLoadingSeason,
  } = useSeriesDetails(id);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

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
    // Here you would integrate with a favorites API
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

  // Loading, auth and error states
  const isLoading = authLoading || subscriptionLoading || isLoadingSeries || isLoadingSeason;
  const hasError = !isLoading && !series;

  if (isLoading || !user || hasError) {
    return (
      <SeriesLoadingState 
        isLoading={isLoading}
        hasUser={!!user}
        hasError={hasError}
      />
    );
  }

  const seasons = Array.from(
    { length: series.number_of_seasons || 0 }, 
    (_, i) => i + 1
  );

  return (
    <div className="min-h-screen bg-netflix-background">
      <SeriesHeader 
        series={series} 
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />

      <SeriesActions 
        showPlayer={showPlayer} 
        hasAccess={hasAccess}
        onPlayClick={handleWatchClick}
      />

      {showPlayer && (
        <div className="px-6 md:px-10 mb-10">
          <SeriesPlayer 
            showPlayer={true}
            series={series}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            hasAccess={hasAccess}
          />
        </div>
      )}

      <SeriesContent 
        series={series}
        seasonData={seasonData}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        seasons={seasons}
        setSelectedSeason={setSelectedSeason}
        handleEpisodeSelect={handleEpisodeSelect}
        isLoadingSeason={isLoadingSeason}
        subscriptionLoading={subscriptionLoading}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default SeriesDetails;
