
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails } from "@/services/tmdb/series";
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
import { Series } from "@/types/movie";

const DoramaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
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
  const { isFavorite, addToFavorites, removeFromFavorites, toggleFavorite } = useFavorites();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

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
    enabled: !!id
  });

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
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

          <div className="px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <SeriesActions 
            showPlayer={showPlayer} 
            hasAccess={hasAccess} 
            togglePlayer={handleWatchClick} 
          />

          {/* Player de vídeo do SuperFlix */}
          {showPlayer && (
            <div className="px-6 md:px-10 mb-10">
              <SuperFlixPlayer
                type="serie"
                imdb={dorama.id.toString()}
                season={selectedSeason.toString()}
                episode={selectedEpisode.toString()}
                options={{
                  transparent: true,
                  noLink: true,
                  noEpList: true
                }}
              />
            </div>
          )}

          <SeriesContent 
            series={dorama} 
            hasAccess={hasAccess}
            seasonData={undefined}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            seasons={[1]}
            setSelectedSeason={setSelectedSeason}
            handleEpisodeSelect={setSelectedEpisode}
            isLoadingSeason={false}
            subscriptionLoading={subscriptionLoading}
          />
        </>
      )}
    </div>
  );
};

export default DoramaDetails;
