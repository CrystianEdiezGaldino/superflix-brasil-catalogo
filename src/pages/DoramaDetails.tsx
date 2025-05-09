import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { fetchDoramaCast } from "@/services/tmdbApi";
import { Series } from "@/types/movie";
import { useDoramaDetails } from "@/hooks/dorama/useDoramaDetails";
import DoramaBanner from "@/components/doramas/DoramaBanner";
import DoramaSynopsis from "@/components/doramas/DoramaSynopsis";
import DoramaCastSection from "@/components/doramas/DoramaCastSection";
import RelatedDoramas from "@/components/doramas/RelatedDoramas";
import DoramaVideoPlayer from "@/components/doramas/DoramaVideoPlayer";
import DoramaLoadingState from "@/components/doramas/DoramaLoadingState";

const DoramaDetails = () => {
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

  // Get dorama details and related functionality
  const {
    dorama,
    similarDoramas,
    isLoadingDorama,
    isLoadingSimilar,
  } = useDoramaDetails();

  // Fetch cast information
  const { data: cast, isLoading: isLoadingCast } = useQuery({
    queryKey: ["dorama-cast", id],
    queryFn: () => fetchDoramaCast(id?.toString() || "", 12),
    enabled: !!id,
  });

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
  const isLoading = authLoading || subscriptionLoading || isLoadingDorama || isLoadingCast;
  const hasError = !isLoading && !dorama;

  if (isLoading || !user || hasError) {
    return (
      <DoramaLoadingState 
        isLoading={isLoading}
        hasUser={!!user}
        hasError={hasError}
      />
    );
  }

  const imdbId = dorama?.external_ids?.imdb_id;

  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="pt-16">
        {/* Video Player or Banner */}
        {showPlayer && imdbId ? (
          <div className="p-4 md:p-8 bg-black">
            <DoramaVideoPlayer 
              showPlayer={true}
              imdbId={imdbId}
              hasAccess={hasAccess}
            />
            <button 
              onClick={() => setShowPlayer(false)}
              className="mt-4 text-white hover:underline"
            >
              Voltar para detalhes
            </button>
          </div>
        ) : (
          <DoramaBanner 
            dorama={dorama} 
            onPlay={handleWatchClick}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <DoramaSynopsis overview={dorama.overview} />
          
          <DoramaCastSection 
            cast={cast || []} 
            isLoading={isLoadingCast} 
          />
          
          <RelatedDoramas 
            doramas={similarDoramas as Series[]} 
            isLoading={isLoadingSimilar} 
          />
        </div>
      </div>
    </div>
  );
};

export default DoramaDetails;
