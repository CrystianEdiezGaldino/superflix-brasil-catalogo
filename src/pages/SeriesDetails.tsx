
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SeriesBanner from "@/components/series/SeriesBanner";
import EpisodesList from "@/components/series/EpisodesList";
import SeriesAccessPrompt from "@/components/series/SeriesAccessPrompt";
import SeriesVideoPlayer from "@/components/series/SeriesVideoPlayer";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import { useSeriesDetails } from "@/hooks/useSeriesDetails";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  
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
            
            <SeriesAccessPrompt hasAccess={hasAccess} />
          </div>

          {/* Informações da série */}
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
        <SeriesVideoPlayer 
          showPlayer={showPlayer}
          imdbId={imdbId}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          hasAccess={hasAccess}
        />

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
