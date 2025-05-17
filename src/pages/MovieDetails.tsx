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
  const [isMobile, setIsMobile] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
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

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle orientation change
  useEffect(() => {
    if (showPlayer && isMobile) {
      try {
        // Try to lock screen orientation to landscape
        if (screen.orientation && 'lock' in screen.orientation) {
          (screen.orientation as any).lock('landscape').catch(() => {
            // If lock fails, show message to user
            toast.info("Por favor, gire seu dispositivo para modo paisagem para melhor visualização");
          });
        }
      } catch (error) {
        toast.info("Por favor, gire seu dispositivo para modo paisagem para melhor visualização");
      }
    }

    return () => {
      // Unlock orientation when component unmounts or player is closed
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    };
  }, [showPlayer, isMobile]);

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

  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (focusedElement === 'player') {
            setFocusedElement('actions');
          } else if (focusedElement === 'content') {
            setFocusedElement('actions');
          } else if (focusedElement === 'recommendations') {
            setFocusedElement('content');
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (focusedElement === 'actions') {
            if (showPlayer) {
              setFocusedElement('player');
            } else {
              setFocusedElement('content');
            }
          } else if (focusedElement === 'content') {
            setFocusedElement('recommendations');
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (focusedElement === 'actions') {
            setFocusedElement('header');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (focusedElement === 'header') {
            setFocusedElement('actions');
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedElement === 'actions') {
            handleWatchClick();
          }
          break;
        case 'Backspace':
          e.preventDefault();
          if (showPlayer) {
            setShowPlayer(false);
            setFocusedElement('actions');
          } else {
            navigate(-1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement, showPlayer, navigate]);

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
          <div 
            className={`${focusedElement === 'header' ? 'ring-2 ring-netflix-red' : ''}`}
            onFocus={() => setFocusedElement('header')}
          >
            <MovieHeader 
              movie={movie} 
            />
          </div>
          
          <div className="px-4 sm:px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <div 
            className={`${focusedElement === 'actions' ? 'ring-2 ring-netflix-red' : ''}`}
            onFocus={() => setFocusedElement('actions')}
          >
            <MediaActions 
              onPlayClick={handleWatchClick}
              onFavoriteClick={handleToggleFavorite}
              isFavorite={isFavorite(movie.id)}
              hasAccess={hasAccess}
              tmdbId={movie.id}
              mediaType="movie"
              showPlayer={showPlayer}
            />
          </div>

          {/* Player de vídeo */}
          {showPlayer && ((movie.imdb_id || movie.external_ids?.imdb_id)) && (
            <div 
              ref={playerRef}
              id="video-player" 
              className={`${isMobile ? 'fixed inset-0 z-50 bg-black' : 'px-4 sm:px-6 md:px-10 mb-8 sm:mb-10'} ${focusedElement === 'player' ? 'ring-2 ring-netflix-red' : ''}`}
              onFocus={() => setFocusedElement('player')}
            >
              <div className={`${isMobile ? 'h-full w-full' : 'max-w-6xl mx-auto'}`}>
                <div className={`${isMobile ? 'h-full w-full' : 'aspect-[16/9] sm:aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl'}`}>
                  <MovieVideoPlayer 
                    showPlayer={true}
                    imdbId={movie.imdb_id || movie.external_ids?.imdb_id || ''}
                    hasAccess={hasAccess}
                  />
                </div>
              </div>
            </div>
          )}

          {!isContentAvailable && (
            <div className="px-4 sm:px-6 md:px-10 mb-8 sm:mb-10">
              <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
            </div>
          )}

          <div 
            className={`${focusedElement === 'content' ? 'ring-2 ring-netflix-red' : ''}`}
            onFocus={() => setFocusedElement('content')}
          >
            <MovieContent movie={movie} hasAccess={hasAccess} />
          </div>

          {/* Seção de Recomendações */}
          {recommendations.length > 0 && (
            <div 
              className={`px-4 sm:px-6 md:px-10 mt-8 sm:mt-12 mb-12 sm:mb-16 ${focusedElement === 'recommendations' ? 'ring-2 ring-netflix-red' : ''}`}
              onFocus={() => setFocusedElement('recommendations')}
            >
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
