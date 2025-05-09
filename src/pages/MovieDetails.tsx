
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Play, ChevronDown } from "lucide-react";
import { fetchMovieDetails } from "@/services/tmdbApi";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const MovieDetails = () => {
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

  if (authLoading || subscriptionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Faça login para acessar</h1>
        <Button onClick={() => navigate("/auth")} className="bg-netflix-red hover:bg-red-700">
          Ir para login
        </Button>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Filme não encontrado</h1>
        <Link to="/" className="text-netflix-red hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Header com backdrop do filme */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/70 to-transparent"></div>
        </div>
        
        <div className="absolute top-6 left-6 z-10 flex gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
              <ArrowLeft className="text-white" />
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${isFavorite ? 'bg-netflix-red' : 'bg-black/50 hover:bg-black/70'}`}
            onClick={toggleFavorite}
          >
            <Heart className={`${isFavorite ? 'text-white fill-current' : 'text-white'}`} />
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{releaseYear}</span>
            <span className="px-2 py-1 bg-netflix-red rounded text-xs text-white">
              {Math.round(movie.vote_average * 10)}% Aprovação
            </span>
          </div>
        </div>
      </div>

      {/* Watch Button - Ajustado para ficar mais abaixo */}
      <div className="relative z-10 mt-6 px-6 md:px-10 mb-8">
        <Button 
          onClick={handleWatchClick} 
          className={`${hasAccess ? "bg-netflix-red" : "bg-gray-700"} hover:bg-red-700 text-lg py-6 px-8 rounded-xl flex items-center gap-2`}
          disabled={!hasAccess}
        >
          <Play fill="white" size={20} />
          {showPlayer ? "Ocultar Player" : "Assistir Agora"}
        </Button>
      </div>

      {/* Player de vídeo */}
      {showPlayer && movie.imdb_id && hasAccess && (
        <div id="video-player" className="px-6 md:px-10 mb-10">
          <VideoPlayer type="filme" imdbId={movie.imdb_id} />
        </div>
      )}

      {/* Conteúdo do filme */}
      <div className="container max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-md shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-md flex items-center justify-center">
                <span className="text-gray-500">{movie.title}</span>
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="flex-1">
            <Collapsible className="w-full" defaultOpen={true}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Sinopse</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <p className="text-gray-300 mb-6">{movie.overview || "Nenhuma sinopse disponível."}</p>
              </CollapsibleContent>
            </Collapsible>
            
            {!hasAccess && (
              <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
                <p className="text-amber-400 text-sm">
                  É necessário ter uma assinatura ativa para assistir a este conteúdo.
                  Assine um de nossos planos para ter acesso ilimitado.
                </p>
                <Link to="/subscribe" className="mt-2 block">
                  <Button 
                    variant="outline" 
                    className="border-netflix-red text-netflix-red hover:bg-netflix-red/10"
                  >
                    Ver Planos
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
