import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeriesSeasonDetails, fetchSeriesRecommendations } from "@/services/tmdb/series";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import SeriesHeader from "@/components/series/SeriesHeader";
import SeriesContent from "@/components/series/SeriesContent";
import SeriesPlayer from "@/components/series/SeriesPlayer";
import SeriesLoadingState from "@/components/loading/SeriesLoadingState";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import MediaActions from "@/components/shared/MediaActions";
import MediaGrid from "@/components/media/MediaGrid";
import { Series, Season } from "@/types/movie";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const playerRef = useRef<HTMLDivElement>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading 
  } = useSubscription();
  
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch series details
  const { data: series, isLoading, error } = useQuery({
    queryKey: ["series", id],
    queryFn: () => fetchSeriesDetails(id as string),
    enabled: !!id && !!user,
  });

  // Fetch season details
  const { data: seasonData, isLoading: isLoadingSeason } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: () => fetchSeriesSeasonDetails(id as string, selectedSeason),
    enabled: !!id && !!series && !!user,
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["series-recommendations", id],
    queryFn: () => fetchSeriesRecommendations(id as string),
    enabled: !!id && !!user,
  });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Create an array with season numbers based on series data
  const seasons = Array.from(
    { length: series?.number_of_seasons || 0 },
    (_, i) => i + 1
  );

  // Handle play button click
  const handleWatchClick = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    if (!series?.backdrop_path) {
      toast.info("Esta série ainda não está disponível. Adicione aos favoritos para receber uma notificação quando estiver disponível!");
      return;
    }
    
    setShowPlayer(!showPlayer);
    
    // Scroll to player when it becomes visible
    if (!showPlayer && playerRef.current) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Handle episode selection
  const handleEpisodeSelect = (episodeNumber: number) => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
      return;
    }
    
    if (!series?.backdrop_path) {
      toast.info("Esta série ainda não está disponível. Adicione aos favoritos para receber uma notificação quando estiver disponível!");
      return;
    }
    
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    
    // Scroll to player when episode is selected
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle season selection
  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    if (series) {
      const seriesId = typeof series.id === "string" ? parseInt(series.id) : series.id;
      if (isFavorite(seriesId)) {
        removeFromFavorites(seriesId, 'tv');
        toast.success("Removido dos favoritos");
      } else {
        addToFavorites(seriesId, 'tv');
        if (!series.backdrop_path) {
          toast.success("Adicionado aos favoritos! Você receberá uma notificação quando a série estiver disponível.");
        } else {
          toast.success("Adicionado aos favoritos");
        }
      }
    }
  };

  // Handle recommendation click
  const handleMediaClick = (media: Series) => {
    const mediaId = typeof media.id === 'string' ? parseInt(media.id, 10) : media.id;
    navigate(`/serie/${mediaId}`);
  };

  return (
    <div className="min-h-screen bg-netflix-background pb-10">
      <Navbar onSearch={() => {}} />
      
      <SeriesLoadingState 
        isLoading={authLoading || subscriptionLoading || isLoading}
        hasUser={!!user}
        hasError={!!error || !series}
      />

      {series && (
        <>
          <SeriesHeader 
            series={series}
            isFavorite={isFavorite(series.id)} 
            toggleFavorite={handleToggleFavorite} 
          />
          
          <div className="px-6 md:px-10">
            <AdblockSuggestion />
          </div>

          {/* Botões de ação - assistir e favoritar */}
          <MediaActions
            onPlayClick={handleWatchClick}
            onFavoriteClick={handleToggleFavorite}
            isFavorite={isFavorite(series.id)}
            hasAccess={hasAccess}
            showPlayer={showPlayer}
            tmdbId={series.id}
            mediaType="tv"
          />

          {/* Player de vídeo - com ref para scroll */}
          {series.backdrop_path && (
            <div ref={playerRef} id="player-container" className="px-4 sm:px-6 md:px-10 mb-8 sm:mb-10">
              <div className="max-w-7xl mx-auto">
                <div className="aspect-[16/9] sm:aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
                  <SeriesPlayer
                    showPlayer={showPlayer}
                    series={series}
                    selectedSeason={selectedSeason}
                    selectedEpisode={selectedEpisode}
                    hasAccess={hasAccess}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo da série - informações e episódios */}
          <SeriesContent 
            series={series} 
            hasAccess={hasAccess}
            seasonData={seasonData}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            seasons={seasons}
            setSelectedSeason={handleSeasonSelect}
            handleEpisodeSelect={handleEpisodeSelect}
            isLoadingSeason={isLoadingSeason}
            subscriptionLoading={subscriptionLoading}
          />

          {/* Recomendações */}
          {recommendations?.results && recommendations.results.length > 0 && (
            <div className="px-4 sm:px-6 md:px-10 mt-8 sm:mt-10">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                  <span className="bg-netflix-red h-5 w-1 mr-2 rounded-full"></span>
                  Recomendações para você
                </h2>
                
                <MediaGrid
                  mediaItems={recommendations.results.slice(0, 10)}
                  onMediaClick={handleMediaClick}
                  isLoading={isLoadingRecommendations}
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

export default SeriesDetails;
