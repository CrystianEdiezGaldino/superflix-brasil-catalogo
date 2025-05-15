import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdb/series";
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
import SuperFlixPlayer from "@/components/series/SuperFlixPlayer";
import AnimeRecommendations from "@/components/anime/AnimeRecommendations";
import { Series } from "@/types/movie";

const AnimeDetails = () => {
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

  const { data: anime, isLoading, error } = useQuery({
    queryKey: ["anime", id],
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
    queryKey: ["anime-season", id, selectedSeason],
    queryFn: () => fetchSeasonDetails(id as string, selectedSeason),
    enabled: !!id && !!anime,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Verify if content is available
  useEffect(() => {
    if (anime && !anime.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    } else {
      setIsContentAvailable(true);
    }
  }, [anime]);

  // Scroll to player when it becomes visible or when episode changes
  useEffect(() => {
    if (showPlayer) {
      const playerElement = document.getElementById('SuperFlixAPIContainerVideo');
      if (playerElement) {
        setTimeout(() => {
          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [showPlayer, selectedEpisode]);

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
    
    if (anime) {
      if (isFavorite(anime.id)) {
        removeFromFavorites(anime.id);
        toast.success("Removido dos favoritos");
      } else {
        addToFavorites(anime.id);
        toast.success("Adicionado aos favoritos");
      }
    }
  };

  if (isLoading || !anime) {
    return <AnimeLoadingState isLoading={true} hasUser={!!user} hasError={false} />;
  }

  // Create seasons array based on anime data
  const seasons = anime.number_of_seasons 
    ? Array.from({ length: anime.number_of_seasons }, (_, i) => i + 1) 
    : [1];

  return (
    <div className="min-h-screen bg-netflix-background">
   
      
      <AnimeLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !anime}
      />

      {anime && (
        <>
          <AnimeHeader 
            anime={anime} 
            isFavorite={isFavorite(anime.id)} 
            toggleFavorite={handleToggleFavorite} 
          />

          <div className="px-4 sm:px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <div className="px-4 sm:px-6 md:px-10 mb-4 sm:mb-6">
            <AnimeActions 
              showPlayer={showPlayer} 
              hasAccess={hasAccess} 
              togglePlayer={handleWatchClick}
              isFavorite={isFavorite(anime.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {showPlayer && (
            <div className="px-4 sm:px-6 md:px-10 mb-6 sm:mb-10">
              <div className="max-w-7xl mx-auto">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
                  <SuperFlixPlayer
                    key={`player-${anime.id}-${selectedSeason}-${selectedEpisode}`}
                    type="serie"
                    imdb={anime.id.toString()}
                    season={selectedSeason}
                    episode={selectedEpisode}
                    options={{
                      transparent: true,
                      noLink: true,
                      noEpList: true
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isContentAvailable && (
            <div className="px-4 sm:px-6 md:px-10 mb-6 sm:mb-10">
              <div className="max-w-7xl mx-auto">
                <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
              </div>
            </div>
          )}

          <div className="px-4 sm:px-6 md:px-10 mb-6 sm:mb-10">
            <AnimeContent 
              anime={anime} 
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
          </div>

          <div className="px-4 sm:px-6 md:px-10 mb-6 sm:mb-10">
            <AnimeRecommendations anime={anime} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeDetails;
