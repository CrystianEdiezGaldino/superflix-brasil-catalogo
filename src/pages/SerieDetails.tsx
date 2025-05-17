import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails } from "@/services/tmdb/series";
import { fetchSeriesRecommendations } from "@/services/tmdb/search";
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
import MediaGrid from "@/components/media/MediaGrid";
import { Series } from "@/types/movie";

const SerieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  
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

  const { data: serie, isLoading, error } = useQuery({
    queryKey: ["serie", id],
    queryFn: () => fetchSeriesDetails(id as string),
    enabled: !!id
  });

  // Buscar recomendações
  const { data: recommendations = [] } = useQuery({
    queryKey: ["serie-recommendations", id],
    queryFn: () => fetchSeriesRecommendations(id as string, "tv"),
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
    
    if (serie) {
      if (isFavorite(serie.id)) {
        removeFromFavorites(serie.id);
        toast.success("Removido dos favoritos");
      } else {
        addToFavorites(serie.id);
        toast.success("Adicionado aos favoritos");
      }
    }
  };

const handleMediaClick = (media: Series) => {
  // Converter para número antes de navegar
  const mediaId = typeof media.id === 'string' ? parseInt(media.id, 10) : media.id;
  navigate(`/serie/${mediaId}`);
};

  if (isLoading || !serie) {
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
      
      
      <SeriesLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !serie}
      />

      {serie && (
        <>
          <SeriesHeader 
            series={serie} 
          />

          <div className="px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <SeriesActions 
            showPlayer={showPlayer} 
            hasAccess={hasAccess} 
            onPlayClick={handleWatchClick} 
          />

          {/* Player de vídeo do SuperFlix */}
          {showPlayer && (
            <div className="px-4 sm:px-6 md:px-10 mb-10">
              <div className="max-w-7xl mx-auto">
                <div className="aspect-[16/9] sm:aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
                  <SuperFlixPlayer
                    type="serie"
                    imdb={serie.id.toString()}
                    options={{
                      transparent: true,
                      noLink: true
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <SeriesContent 
            series={serie} 
            hasAccess={hasAccess}
          />

          {/* Seção de Recomendações */}
          {recommendations.length > 0 && (
            <div className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-10 mb-8 sm:mb-10">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Recomendados para Você</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {recommendations.slice(0, 5).map((serie) => (
                    <div 
                      key={serie.id}
                      onClick={() => handleMediaClick(serie)}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                        {serie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                            alt={serie.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Sem poster</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <h3 className="text-white text-sm font-medium truncate">{serie.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-300">
                                {new Date(serie.first_air_date).getFullYear()}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-netflix-red rounded text-white">
                                {Math.round(serie.vote_average * 10)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SerieDetails;
