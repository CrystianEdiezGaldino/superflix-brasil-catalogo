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

  // Navegação por controle de TV e Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (focusedButton) {
            if (e.shiftKey) {
              setFocusedButton(null);
              setFocusedElement('header');
              headerRef.current?.focus();
            } else {
              setFocusedButton('favorite');
            }
          } else if (focusedElement === 'header') {
            if (e.shiftKey) {
              // Não faz nada, já está no topo
            } else {
              setFocusedElement('actions');
              setFocusedButton('watch');
            }
          } else if (focusedElement === 'actions') {
            if (e.shiftKey) {
              setFocusedElement('header');
              headerRef.current?.focus();
            } else {
              setFocusedElement('content');
              contentRef.current?.focus();
            }
          } else if (focusedElement === 'content') {
            if (e.shiftKey) {
              setFocusedElement('actions');
              setFocusedButton('watch');
            } else {
              setFocusedElement('recommendations');
              recommendationsRef.current?.focus();
            }
          } else if (focusedElement === 'recommendations') {
            if (e.shiftKey) {
              setFocusedElement('content');
              contentRef.current?.focus();
            }
            // Não faz nada se for para frente, já está no final
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (focusedButton) {
            setFocusedButton(null);
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else if (focusedElement === 'actions') {
            setFocusedElement('header');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (focusedElement === 'content') {
            setFocusedElement('actions');
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else if (focusedElement === 'recommendations') {
            setFocusedElement('content');
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (focusedButton) {
            setFocusedButton(null);
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else if (focusedElement === 'header') {
            setFocusedElement('actions');
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else if (focusedElement === 'actions') {
            if (showPlayer) {
              setFocusedElement('player');
              if (playerRef.current) {
                playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            } else {
              setFocusedElement('content');
              window.scrollBy({ top: 300, behavior: 'smooth' });
            }
          } else if (focusedElement === 'content') {
            setFocusedElement('recommendations');
            window.scrollBy({ top: 300, behavior: 'smooth' });
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (focusedButton === 'favorite') {
            setFocusedButton('watch');
          } else if (focusedButton === 'watch') {
            setFocusedButton(null);
            setFocusedElement('header');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (focusedElement === 'actions') {
            setFocusedElement('header');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (focusedButton === 'watch') {
            setFocusedButton('favorite');
          } else if (focusedButton === null && focusedElement === 'actions') {
            setFocusedButton('watch');
          } else if (focusedElement === 'header') {
            setFocusedElement('actions');
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedButton === 'watch') {
            handleWatchClick();
          } else if (focusedButton === 'favorite') {
            handleToggleFavorite();
          } else if (focusedElement === 'recommendations') {
            const selectedMovie = recommendations[0];
            if (selectedMovie) {
              handleMovieClick(selectedMovie);
            }
          }
          break;
        case 'Backspace':
          e.preventDefault();
          if (focusedButton) {
            setFocusedButton(null);
          } else if (showPlayer) {
            setShowPlayer(false);
            setFocusedElement('actions');
            if (actionsRef.current) {
              actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            navigate(-1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement, focusedButton, showPlayer, navigate, recommendations]);

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
            ref={headerRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('header');
              setFocusedButton(null);
            }}
          >
            <MovieHeader 
              movie={movie} 
            />
          </div>
          
          <div className="px-4 sm:px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          <div 
            ref={actionsRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('actions');
              setFocusedButton(null);
            }}
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
            />
          </div>

          {showPlayer && ((movie.imdb_id || movie.external_ids?.imdb_id)) && (
            <div 
              ref={playerRef}
              id="video-player" 
              tabIndex={0}
              className={`${isMobile ? 'fixed inset-0 z-50 bg-black' : 'px-4 sm:px-6 md:px-10 mb-8 sm:mb-10'}`}
              onFocus={() => {
                setFocusedElement('player');
                setFocusedButton(null);
              }}
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
            ref={contentRef}
            tabIndex={0}
            onFocus={() => {
              setFocusedElement('content');
              setFocusedButton(null);
            }}
          >
            <MovieContent movie={movie} hasAccess={hasAccess} />
          </div>

          {recommendations.length > 0 && (
            <div 
              ref={recommendationsRef}
              tabIndex={0}
              className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-12 mb-12 sm:mb-16"
              onFocus={() => {
                setFocusedElement('recommendations');
                setFocusedButton(null);
              }}
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
