import { useState, useEffect, useRef } from "react";
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
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
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
      removeFromFavorites(movie.id, 'movie');
      toast.success("Removido dos favoritos");
    } else {
      addToFavorites(movie.id, 'movie');
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar onSearch={() => {}} />
      <MovieLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !movie}
      />

      {movie && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={headerRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('header');
              setFocusedButton(null);
            }}
            className="mb-8 sm:mb-12"
          >
            <MovieHeader 
              movie={movie} 
            />
          </div>
          
          <div className="mb-6 sm:mb-8">
            <AdblockSuggestion />
          </div>

          <div 
            ref={actionsRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('actions');
              setFocusedButton(null);
            }}
            className="mb-8 sm:mb-10"
          >
            <MediaActions 
              onPlayClick={handleWatchClick}
              onFavoriteClick={handleToggleFavorite}
              isFavorite={isFavorite(movie.id)}
              hasAccess={hasAccess}
              tmdbId={movie.id}
              mediaType="movie"
              showPlayer={showPlayer}
              focusedButton={focusedButton}
              onButtonFocus={setFocusedButton}
              imdbId={movie.imdb_id || movie.external_ids?.imdb_id}
            />
          </div>

          {showPlayer && ((movie.imdb_id || movie.external_ids?.imdb_id)) && (
            <div 
              ref={playerRef}
              id="video-player" 
              tabIndex={0}
              className="mb-10 sm:mb-12"
              onFocus={() => {
                setFocusedElement('player');
                setFocusedButton(null);
              }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
                <div className="aspect-[16/9] sm:aspect-video w-full bg-black">
                  <MovieVideoPlayer 
                    showPlayer={true}
                    imdbId={movie.imdb_id || movie.external_ids?.imdb_id}
                    hasAccess={hasAccess}
                  />
                </div>
              </div>
            </div>
          )}

          {!isContentAvailable && (
            <div className="mb-10 sm:mb-12">
              <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
            </div>
          )}

          <div 
            ref={contentRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('content');
              setFocusedButton(null);
            }}
            className="mb-12 sm:mb-16"
          >
            <MovieContent movie={movie} hasAccess={hasAccess} />
          </div>

          {recommendations.length > 0 && (
            <div 
              ref={recommendationsRef}
              tabIndex={0}
              className="mt-12 sm:mt-16 mb-16 sm:mb-20"
              onFocus={() => {
                setFocusedElement('recommendations');
                setFocusedButton(null);
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 border-l-4 border-netflix-red pl-4">
                Recomendados para Você
              </h2>
              <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
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
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
