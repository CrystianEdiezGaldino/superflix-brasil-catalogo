
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchMovieDetails } from "@/services/tmdbApi";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const MovieDetails = () => {
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
    queryFn: () => fetchMovieDetails(Number(id)),
    enabled: !!id && !!user,
  });

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
        
        <Link to="/" className="absolute top-6 left-6 z-10">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50">
            <ArrowLeft className="text-white" />
          </Button>
        </Link>
      </div>

      {/* Conteúdo do filme */}
      <div className="container max-w-5xl mx-auto px-6 -mt-32 relative z-10">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {movie.title} <span className="font-normal text-gray-400">({releaseYear})</span>
            </h1>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="px-2 py-1 bg-netflix-red rounded text-xs text-white">
                {Math.round(movie.vote_average * 10)}% Aprovação
              </span>
              <span className="text-gray-400">{movie.release_date}</span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Sinopse</h2>
              <p className="text-gray-300">{movie.overview || "Nenhuma sinopse disponível."}</p>
            </div>

            {movie.imdb_id && (
              <div className="mt-8">
                <Button 
                  onClick={handleWatchClick} 
                  className={hasAccess ? "bg-netflix-red hover:bg-red-700" : "bg-gray-500 hover:bg-gray-600"}
                >
                  {showPlayer ? "Ocultar Player" : hasAccess ? "Assistir Agora" : "Assinar para Assistir"}
                </Button>
                
                {!hasAccess && (
                  <Link to="/subscribe">
                    <Button 
                      variant="outline" 
                      className="ml-4 border-netflix-red text-netflix-red hover:bg-netflix-red/10"
                    >
                      Ver Planos
                    </Button>
                  </Link>
                )}
              </div>
            )}
            
            {!hasAccess && (
              <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
                <p className="text-amber-400 text-sm">
                  É necessário ter uma assinatura ativa para assistir a este conteúdo.
                  Assine um de nossos planos para ter acesso ilimitado.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Player de vídeo */}
        {showPlayer && movie.imdb_id && hasAccess && (
          <div className="mt-10">
            <VideoPlayer type="filme" imdbId={movie.imdb_id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
