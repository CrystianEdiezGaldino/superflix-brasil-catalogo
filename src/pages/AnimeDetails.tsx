import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import AnimeHeader from "@/components/anime/AnimeHeader";
import AnimeContent from "@/components/anime/AnimeContent";
import AnimeActions from "@/components/anime/AnimeActions";
import AnimeLoadingState from "@/components/anime/AnimeLoadingState";
import ContentNotAvailable from "@/components/ContentNotAvailable";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import { useAnimeDetails } from "@/hooks/anime/useAnimeDetails";
import { Series } from "@/types/movie";
import SuperFlixPlayer from "@/components/series/SuperFlixPlayer";
import AnimeRecommendations from "@/components/anime/AnimeRecommendations";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
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
  const { isFavorite, toggleFavorite } = useFavorites();

  // Use the anime details hook
  const { 
    anime, 
    seasonData, 
    isLoading, 
    error, 
    isAnimeFavorite, 
    toggleAnimeFavorite,
    fetchSeasonData 
  } = useAnimeDetails();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Memoize player options to prevent unnecessary re-renders
  const playerOptions = useMemo(() => ({
    transparent: true,
    noLink: true,
    noEpList: true
  }), []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Verify if content is available
  useEffect(() => {
    if (anime && !anime.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    } else {
      setIsContentAvailable(true);
    }
  }, [anime]);

  // Handle season change
  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
    
    if (anime && anime.id) {
      await fetchSeasonData(anime.id, seasonNumber);
    }
  };

  // Handle episode selection
  const handleEpisodeSelect = (episode: number) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
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

  // Convert anime to Series type for components that expect it
  const animeSeries = anime as Series;
  
  // Create seasons array based on anime data
  const seasons = animeSeries?.number_of_seasons 
    ? Array.from({ length: animeSeries.number_of_seasons }, (_, i) => i + 1) 
    : [1];

  if (isLoading || authLoading || subscriptionLoading) {
    return <AnimeLoadingState />;
  }

  if (error || !anime) {
    return (
      <div className="pt-24 px-4 text-center text-white">
        <h2 className="text-2xl font-bold">Erro ao carregar anime</h2>
        <p className="mt-2 text-gray-400">Não foi possível carregar os detalhes deste anime.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <AnimeHeader 
        anime={animeSeries}
        isFavorite={isAnimeFavorite}
        toggleFavorite={toggleAnimeFavorite}
      />

      <div className="px-6 md:px-10">
        <AdblockSuggestion />
      </div>

      <AnimeActions 
        showPlayer={showPlayer} 
        hasAccess={hasAccess} 
        togglePlayer={handleWatchClick}
        isFavorite={isAnimeFavorite}
        onToggleFavorite={toggleAnimeFavorite}
      />

      {showPlayer && animeSeries && animeSeries.external_ids?.imdb_id && (
        <div id="video-player" className="px-6 md:px-10 mb-10">
          <SuperFlixPlayer
            key={`player-${animeSeries.id}-${selectedSeason}-${selectedEpisode}`}
            type="serie"
            imdb={animeSeries.external_ids.imdb_id}
            season={selectedSeason.toString()}
            episode={selectedEpisode.toString()}
            options={playerOptions}
          />
        </div>
      )}

      {!isContentAvailable && (
        <div className="px-6 md:px-10 mb-10">
          <ContentNotAvailable onAddToFavorites={toggleAnimeFavorite} />
        </div>
      )}

      <AnimeContent 
        anime={animeSeries}
        seasonData={seasonData || undefined}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        seasons={seasons}
        setSelectedSeason={handleSeasonChange}
        handleEpisodeSelect={handleEpisodeSelect}
        isLoadingSeason={false}
        subscriptionLoading={subscriptionLoading}
        hasAccess={hasAccess}
      />

      <AnimeRecommendations anime={animeSeries} />
    </div>
  );
};

export default AnimeDetails;
