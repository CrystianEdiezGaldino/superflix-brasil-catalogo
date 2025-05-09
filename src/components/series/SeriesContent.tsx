
import { Link } from "react-router-dom";
import { Series, Season } from "@/types/movie";
import { Button } from "@/components/ui/button";
import EpisodesList from "./EpisodesList";
import SeriesAccessPrompt from "./SeriesAccessPrompt";

interface SeriesContentProps {
  series: Series;
  seasonData: Season | undefined;
  selectedSeason: number;
  selectedEpisode: number;
  seasons: number[];
  setSelectedSeason: (season: number) => void;
  handleEpisodeSelect: (episode: number) => void;
  isLoadingSeason: boolean;
  subscriptionLoading: boolean;
  hasAccess: boolean;
}

const SeriesContent = ({
  series,
  seasonData,
  selectedSeason,
  selectedEpisode,
  seasons,
  setSelectedSeason,
  handleEpisodeSelect,
  isLoadingSeason,
  subscriptionLoading,
  hasAccess
}: SeriesContentProps) => {
  return (
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
          
          <SeriesAccessPrompt hasAccess={hasAccess} isLoading={subscriptionLoading} />
        </div>

        {/* Informações da série */}
        <div className="flex-1">
          <div className="w-full" defaultOpen={true}>
            <h2 className="text-xl font-semibold text-white mb-4">Sinopse</h2>
            <p className="text-gray-300 mb-6">{series.overview || "Nenhuma sinopse disponível."}</p>
          </div>
          
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

      {/* Lista de episódios */}
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
  );
};

export default SeriesContent;
