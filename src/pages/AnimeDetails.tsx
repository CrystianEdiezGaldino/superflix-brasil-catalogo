import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAnimeDetails } from "@/hooks/anime/useAnimeDetails";
import AnimeHeader from "@/components/anime/AnimeHeader";
import AnimeActions from "@/components/anime/AnimeActions";
import AnimeContent from "@/components/anime/AnimeContent";
import AnimePlayer from "@/components/anime/AnimePlayer";
import AnimeLoadingState from "@/components/anime/AnimeLoadingState";

const AnimeDetails = () => {
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
    anime,
    selectedSeason,
    selectedEpisode,
    handleEpisodeSelect,
    isLoadingSeries,
    isLoadingSeason,
    seasons,
    seasonData,
    isFavorite: checkFavorite,
    toggleFavoriteAnime
  } = useAnimeDetails(id);

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

  // Check if anime is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (anime?.id) {
        const result = await checkFavorite();
        setIsFavorite(result);
      }
    };
    
    if (anime) {
      checkFavoriteStatus();
    }
  }, [anime, checkFavorite]);

  // Toggle favorite
  const toggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    toggleFavoriteAnime();
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

  // Loading, auth and error states
  const isLoading = authLoading || subscriptionLoading || isLoadingSeries || isLoadingSeason;
  const hasError = !isLoading && !anime;

  if (isLoading || !user || hasError) {
    return (
      <AnimeLoadingState 
        isLoading={isLoading}
        hasUser={!!user}
        hasError={hasError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <AnimeHeader 
        anime={anime} 
        isFavorite={isFavorite} 
        toggleFavorite={toggleFavorite} 
      />

      <AnimeActions 
        showPlayer={showPlayer} 
        hasAccess={hasAccess} 
        onPlayClick={handleWatchClick} 
      />

      {showPlayer && (
        <div className="px-6 md:px-10 mb-10">
          <AnimePlayer
            showPlayer={true}
            anime={anime}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            hasAccess={hasAccess}
          />
        </div>
      )}

      <AnimeContent
        anime={anime}
        seasonData={seasonData}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        seasons={seasons}
        setSelectedSeason={(season) => handleEpisodeSelect(season, 1)}
        handleEpisodeSelect={(episode) => handleEpisodeSelect(selectedSeason, episode)}
        isLoadingSeason={isLoadingSeason}
        subscriptionLoading={subscriptionLoading}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default AnimeDetails;
