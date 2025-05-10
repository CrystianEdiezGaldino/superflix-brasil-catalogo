import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "@/services/tmdbApi";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Navbar from "@/components/Navbar";
import MovieHeader from "@/components/movies/MovieHeader";
import MovieContent from "@/components/movies/MovieContent";
import MovieActions from "@/components/movies/MovieActions";
import MovieLoadingState from "@/components/movies/MovieLoadingState";
import MovieVideoPlayer from "@/components/movies/MovieVideoPlayer";
import ContentNotAvailable from "@/components/ContentNotAvailable";

const DoramaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
  
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

  const { data: dorama, isLoading, error } = useQuery({
    queryKey: ["dorama", id],
    queryFn: () => fetchMovieDetails(id as string),
    enabled: !!id && !!user,
  });

  // Verificar se o conteúdo está disponível
  useEffect(() => {
    if (dorama && !dorama.imdb_id && !dorama.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    }
  }, [dorama]);

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

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <MovieLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !dorama}
      />

      {dorama && (
        <>
          <MovieHeader 
            movie={dorama} 
            isFavorite={isFavorite} 
            toggleFavorite={toggleFavorite} 
          />

          <MovieActions 
            showPlayer={showPlayer} 
            hasAccess={hasAccess} 
            onPlayClick={handleWatchClick} 
          />

          {/* Player de vídeo usando componente dedicado */}
          {showPlayer && (dorama.imdb_id || dorama.external_ids?.imdb_id) && (
            <div className="px-6 md:px-10 mb-10">
              <MovieVideoPlayer 
                showPlayer={true}
                imdbId={dorama.imdb_id || dorama.external_ids?.imdb_id || ''}
                hasAccess={hasAccess}
              />
            </div>
          )}

          {!isContentAvailable && (
            <div className="px-6 md:px-10 mb-10">
              <ContentNotAvailable onAddToFavorites={toggleFavorite} />
            </div>
          )}

          <MovieContent movie={dorama} hasAccess={hasAccess} />
        </>
      )}
    </div>
  );
};

export default DoramaDetails; 