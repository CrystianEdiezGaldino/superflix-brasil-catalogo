
import { useParams, Link } from "react-router-dom";
import { Heart, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeriesBanner from "@/components/series/SeriesBanner";
import EpisodesList from "@/components/series/EpisodesList";
import SeriesAccessPrompt from "@/components/series/SeriesAccessPrompt";
import SeriesVideoPlayer from "@/components/series/SeriesVideoPlayer";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import { useSeriesDetails } from "@/hooks/useSeriesDetails";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const {
    series,
    seasonData,
    showPlayer,
    selectedSeason,
    selectedEpisode,
    setSelectedSeason,
    handleEpisodeSelect,
    togglePlayer,
    isLoadingSeries,
    isLoadingSeason,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess
  } = useSeriesDetails(id);

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

  // Loading, auth and error states
  const isLoading = authLoading || subscriptionLoading || isLoadingSeries || isLoadingSeason;
  const hasError = !isLoading && !series;
  
  if (isLoading || !user || hasError) {
    return (
      <SeriesLoadingState 
        isLoading={isLoading}
        hasUser={!!user}
        hasError={hasError}
      />
    );
  }

  const seasons = Array.from(
    { length: series.number_of_seasons || 0 }, 
    (_, i) => i + 1
  );
  
  const imdbId = series.external_ids?.imdb_id;

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Banner da série com favorite button */}
      <SeriesBanner 
        series={series} 
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* Watch Button - Prominent Call to Action */}
      <div className="relative z-10 -mt-10 px-6 md:px-10 mb-8">
        <Button 
          onClick={togglePlayer} 
          className={`${hasAccess ? "bg-netflix-red" : "bg-gray-700"} hover:bg-red-700 text-lg py-6 px-8 rounded-xl flex items-center gap-2`}
          disabled={!hasAccess}
        >
          <Play fill="white" size={20} />
          {showPlayer ? "Ocultar Player" : "Assistir Agora"}
        </Button>
      </div>

      {/* Player de vídeo - More visible position */}
      {showPlayer && (
        <div id="video-player" className="px-6 md:px-10 mb-10">
          <SeriesVideoPlayer 
            showPlayer={true}
            imdbId={imdbId}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            hasAccess={hasAccess}
          />
        </div>
      )}

      {/* Conteúdo da série */}
      <div className="container max-w-5xl mx-auto px-6">
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
            
            <SeriesAccessPrompt hasAccess={hasAccess} />
          </div>

          {/* Informações da série */}
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
                <p className="text-gray-300 mb-6">{series.overview || "Nenhuma sinopse disponível."}</p>
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

        {/* Lista de episódios com melhor UX */}
        {series.number_of_seasons > 0 && (
          <div className="mt-8">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
