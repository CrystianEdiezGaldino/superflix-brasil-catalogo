
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import AnimeHeader from "@/components/anime/AnimeHeader";
import AnimeContent from "@/components/anime/AnimeContent";
import AnimePlayer from "@/components/anime/AnimePlayer";
import AnimeActions from "@/components/anime/AnimeActions";
import AnimeLoadingState from "@/components/anime/AnimeLoadingState";
import ContentNotAvailable from "@/components/ContentNotAvailable";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import { useAnimeDetails } from "@/hooks/anime/useAnimeDetails";

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
  const { anime, isLoading, error } = useAnimeDetails();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Verify if content is available
  useEffect(() => {
    if (anime && !anime.imdb_id && !anime.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    } else {
      setIsContentAvailable(true);
    }
  }, [anime]);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle episode selection
  const handleEpisodeSelect = (episode: number) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!anime) return;
    toggleFavorite(anime.id);
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

  const seasons = anime?.number_of_seasons ? Array.from({ length: anime.number_of_seasons }, (_, i) => i + 1) : [1];
  const seasonData = {
    id: 1,
    name: "Temporada 1",
    overview: "Primeira temporada do anime",
    poster_path: anime?.poster_path || "",
    season_number: 1,
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Episódio ${i + 1}`,
      overview: `Descrição do episódio ${i + 1}`,
      still_path: anime?.backdrop_path || "",
      episode_number: i + 1,
      season_number: 1,
      vote_average: 8.0
    }))
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      {isLoading || authLoading || subscriptionLoading ? (
        <AnimeLoadingState />
      ) : error || !anime ? (
        <div className="pt-24 px-4 text-center text-white">
          <h2 className="text-2xl font-bold">Erro ao carregar anime</h2>
          <p className="mt-2 text-gray-400">Não foi possível carregar os detalhes deste anime.</p>
        </div>
      ) : (
        <>
          <AnimeHeader 
            anime={anime}
            isFavorite={isFavorite(anime.id)}
            toggleFavorite={handleToggleFavorite}
          />

          <div className="px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <AnimeActions 
            showPlayer={showPlayer} 
            hasAccess={hasAccess} 
            togglePlayer={handleWatchClick} 
          />

          <AnimePlayer 
            showPlayer={showPlayer}
            anime={anime}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            hasAccess={hasAccess}
          />

          {!isContentAvailable && (
            <div className="px-6 md:px-10 mb-10">
              <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
            </div>
          )}

          <AnimeContent 
            anime={anime}
            seasonData={seasonData}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            seasons={seasons}
            setSelectedSeason={setSelectedSeason}
            handleEpisodeSelect={handleEpisodeSelect}
            isLoadingSeason={false}
            subscriptionLoading={subscriptionLoading}
            hasAccess={hasAccess}
          />
        </>
      )}
    </div>
  );
};

export default AnimeDetails;
