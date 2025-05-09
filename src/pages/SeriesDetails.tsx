
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdbApi";
import VideoPlayer from "@/components/VideoPlayer";
import SeriesBanner from "@/components/series/SeriesBanner";
import SeriesInfo from "@/components/series/SeriesInfo";
import EpisodesList from "@/components/series/EpisodesList";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
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

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: series, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series", id],
    queryFn: () => fetchSeriesDetails(Number(id)),
    enabled: !!id && !!user,
  });

  const { data: seasonData, isLoading: isLoadingSeason } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: () => fetchSeasonDetails(Number(id), selectedSeason),
    enabled: !!id && !!series && !!user,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      setSelectedEpisode(seasonData.episodes[0].episode_number);
    }
  }, [seasonData]);

  const handleEpisodeSelect = (episodeNumber: number) => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePlayer = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    setShowPlayer(!showPlayer);
  };

  if (authLoading || subscriptionLoading || isLoadingSeries || isLoadingSeason) {
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

  if (!series) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Série não encontrada</h1>
        <a href="/" className="text-netflix-red hover:underline">
          Voltar para a página inicial
        </a>
      </div>
    );
  }

  const seasons = Array.from({ length: series.number_of_seasons || 0 }, (_, i) => i + 1);
  const imdbId = series.external_ids?.imdb_id;

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Banner da série */}
      <SeriesBanner series={series} />

      {/* Conteúdo da série */}
      <div className="container max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            {series.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="w-full rounded-md shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-md flex items-center justify-center">
                <span className="text-gray-500">{series.name}</span>
              </div>
            )}
            
            {!hasAccess && (
              <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
                <p className="text-amber-400 text-sm">
                  É necessário ter uma assinatura ativa para assistir a este conteúdo.
                  Assine um de nossos planos para ter acesso ilimitado.
                </p>
                <Link to="/subscribe" className="mt-2 inline-block">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-netflix-red text-netflix-red hover:bg-netflix-red/10"
                  >
                    Ver Planos
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Informações da série - modificado para passar a prop togglePlayer */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {series.name}
            </h1>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="px-2 py-1 bg-netflix-red rounded text-xs text-white">
                {Math.round(series.vote_average * 10)}% Aprovação
              </span>
              <span className="text-gray-400">{series.first_air_date}</span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">Sinopse</h2>
              <p className="text-gray-300">{series.overview || "Nenhuma sinopse disponível."}</p>
            </div>

            <div className="mt-8">
              <Button 
                onClick={togglePlayer} 
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
          </div>
        </div>

        {/* Player de vídeo */}
        {showPlayer && imdbId && hasAccess && (
          <div className="mt-10">
            <VideoPlayer 
              type="serie" 
              imdbId={imdbId} 
              season={selectedSeason}
              episode={selectedEpisode}
            />
          </div>
        )}

        {/* Lista de episódios */}
        {series.number_of_seasons > 0 && (
          <EpisodesList
            seasonData={seasonData}
            seasons={seasons}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            setSelectedSeason={setSelectedSeason}
            handleEpisodeSelect={handleEpisodeSelect}
            isLoading={isLoadingSeason}
            hasAccess={hasAccess}
          />
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
