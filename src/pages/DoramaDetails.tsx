
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdb/series";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import SeriesHeader from "@/components/series/SeriesHeader";
import SeriesContent from "@/components/series/SeriesContent";
import SeriesActions from "@/components/series/SeriesActions";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import ContentNotAvailable from "@/components/ContentNotAvailable";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import SuperFlixPlayer from "@/components/series/SuperFlixPlayer";
import SeriesCast from "@/components/series/SeriesCast";
import SeriesRecommendations from "@/components/series/SeriesRecommendations";
import { Series } from "@/types/movie";

const DoramaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading 
  } = useSubscription();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

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

  const { data: dorama, isLoading, error } = useQuery({
    queryKey: ["dorama", id],
    queryFn: () => fetchSeriesDetails(id as string, 'pt-BR'),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Fetch season data
  const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
    queryKey: ["dorama-season", id, selectedSeason],
    queryFn: () => fetchSeasonDetails(id as string, selectedSeason),
    enabled: !!id && !!dorama,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Verify if content is available
  useEffect(() => {
    if (dorama && !dorama.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    } else {
      setIsContentAvailable(true);
    }
  }, [dorama]);

  // Scroll to player when it becomes visible
  useEffect(() => {
    if (showPlayer) {
      const playerElement = document.getElementById('SuperFlixAPIContainerVideo');
      if (playerElement) {
        setTimeout(() => {
          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [showPlayer]);

  // Handle season change
  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
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

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    if (dorama) {
      if (isFavorite(dorama.id)) {
        removeFromFavorites(dorama.id);
        toast.success("Removido dos favoritos");
      } else {
        addToFavorites(dorama.id);
        toast.success("Adicionado aos favoritos");
      }
    }
  };

  if (isLoading || !dorama) {
    return <SeriesLoadingState isLoading={true} hasUser={!!user} hasError={false} />;
  }

  // Create seasons array based on dorama data
  const seasons = dorama.number_of_seasons 
    ? Array.from({ length: dorama.number_of_seasons }, (_, i) => i + 1) 
    : [1];

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <SeriesLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !dorama}
      />

      {dorama && (
        <>
          <SeriesHeader 
            series={dorama} 
            isFavorite={isFavorite(dorama.id)} 
            toggleFavorite={handleToggleFavorite} 
          />

          <div className="px-4 sm:px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <div className="px-4 sm:px-6 md:px-10 mb-6">
            <SeriesActions 
              showPlayer={showPlayer} 
              hasAccess={hasAccess} 
              togglePlayer={handleWatchClick}
              isFavorite={isFavorite(dorama.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {showPlayer && (
            <div className="px-4 sm:px-6 md:px-10 mb-10">
              <div className="max-w-7xl mx-auto">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <SuperFlixPlayer
                    key={`player-${dorama.id}-${selectedSeason}-${selectedEpisode}`}
                    type="serie"
                    imdb={dorama.id.toString()}
                    season={selectedSeason.toString()}
                    episode={selectedEpisode.toString()}
                    options={playerOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {!isContentAvailable && (
            <div className="px-4 sm:px-6 md:px-10 mb-10">
              <div className="max-w-7xl mx-auto">
                <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
              </div>
            </div>
          )}

          <SeriesContent 
            series={dorama} 
            hasAccess={hasAccess}
            seasonData={seasonData}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            seasons={seasons}
            setSelectedSeason={handleSeasonChange}
            handleEpisodeSelect={setSelectedEpisode}
            isLoadingSeason={isSeasonLoading}
            subscriptionLoading={subscriptionLoading}
          />

          <SeriesCast series={dorama} />
          <SeriesRecommendations seriesId={dorama.id.toString()} />
        </>
      )}
    </div>
  );
};

export default DoramaDetails;
