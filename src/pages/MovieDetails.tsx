
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "@/services/tmdbApi";
import { fetchRecommendations } from "@/services/tmdb/search";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import MovieHeader from "@/components/movies/MovieHeader";
import MovieContent from "@/components/movies/MovieContent";
import MediaActions from "@/components/shared/MediaActions";
import MovieLoadingState from "@/components/movies/MovieLoadingState";
import MovieVideoPlayer from "@/components/movies/MovieVideoPlayer";
import ContentNotAvailable from "@/components/ContentNotAvailable";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import Navbar from "@/components/Navbar";
import MediaGrid from "@/components/media/MediaGrid";
import { Movie } from "@/types/movie";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
  
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

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id as string),
    enabled: !!id && !!user,
  });

  // Buscar recomendações baseadas no ID do filme
  const { data: recommendations = [], isLoading: loadingRecommendations } = useQuery({
    queryKey: ["movie-recommendations", id],
    queryFn: () => fetchRecommendations(id as string, "movie"),
    enabled: !!id && !!movie,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Verificar se o conteúdo está disponível
  useEffect(() => {
    if (movie && !movie.external_ids?.imdb_id && !movie.imdb_id) {
      setIsContentAvailable(false);
    }
  }, [movie]);

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
  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
      toast.success("Removido dos favoritos");
    } else {
      addToFavorites(movie.id);
      toast.success("Adicionado aos favoritos");
    }
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

  const handleMovieClick = (movie: Movie) => {
    navigate(`/filme/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Navbar onSearch={() => {}} />
      <MovieLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !movie}
      />

      {movie && (
        <>
          <MovieHeader 
            movie={movie} 
          />
          
          <div className="px-4 sm:px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <MediaActions 
            onPlayClick={handleWatchClick}
            onFavoriteClick={handleToggleFavorite}
            isFavorite={isFavorite(movie.id)}
            hasAccess={hasAccess}
          />

          {/* Player de vídeo */}
          {showPlayer && ((movie.imdb_id || movie.external_ids?.imdb_id)) && (
            <div id="video-player" className="px-4 sm:px-6 md:px-10 mb-8 sm:mb-10">
              <div className="max-w-6xl mx-auto">
                <MovieVideoPlayer 
                  showPlayer={true}
                  imdbId={movie.imdb_id || movie.external_ids?.imdb_id || ''}
                  hasAccess={hasAccess}
                />
              </div>
            </div>
          )}

          {!isContentAvailable && (
            <div className="px-4 sm:px-6 md:px-10 mb-8 sm:mb-10">
              <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
            </div>
          )}

          <MovieContent movie={movie} hasAccess={hasAccess} />

          {/* Seção de Recomendações */}
          {recommendations.length > 0 && (
            <div className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-12 mb-12 sm:mb-16">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-netflix-red pl-3">
                  Recomendados para Você
                </h2>
                <MediaGrid
                  mediaItems={recommendations.slice(0, 6)}
                  onMediaClick={handleMovieClick}
                  isLoading={loadingRecommendations}
                  isLoadingMore={false}
                  hasMore={false}
                  isSearching={false}
                  isFiltering={false}
                  onLoadMore={() => {}}
                  onResetFilters={() => {}}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetails;
