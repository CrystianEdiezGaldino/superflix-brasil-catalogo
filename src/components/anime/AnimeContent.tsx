
import { Link } from "react-router-dom";
import { Series, Season } from "@/types/movie";
import { Button } from "@/components/ui/button";
import EpisodesList from "../series/EpisodesList";

interface AnimeContentProps {
  anime: Series;
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

const AnimeContent = ({
  anime,
  seasonData,
  selectedSeason,
  selectedEpisode,
  seasons,
  setSelectedSeason,
  handleEpisodeSelect,
  isLoadingSeason,
  subscriptionLoading,
  hasAccess
}: AnimeContentProps) => {
  return (
    <div className="container max-w-5xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          {anime.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${anime.poster_path}`}
              alt={anime.name}
              className="w-full rounded-md shadow-xl"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-gray-500">{anime.name}</span>
            </div>
          )}
          
          {/* Access status indicator */}
          {subscriptionLoading ? (
            <div className="mt-4 p-3 bg-gray-800 rounded-md flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-gray-300">Verificando acesso...</span>
            </div>
          ) : hasAccess ? (
            <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded-md">
              <p className="text-green-400 text-sm flex items-center">
                <span className="mr-2">✓</span>
                Você tem acesso a este conteúdo
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-amber-900/30 border border-amber-700/50 rounded-md">
              <p className="text-amber-400 text-sm">
                É necessário ter uma assinatura para assistir este conteúdo.
              </p>
              <Link to="/subscribe" className="block mt-2">
                <Button className="w-full bg-netflix-red hover:bg-red-700">
                  Ver Planos
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Anime information */}
        <div className="flex-1">
          <div className="w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Sinopse</h2>
            <p className="text-gray-300 mb-6">{anime.overview || "Nenhuma sinopse disponível."}</p>
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

      {/* Episodes list */}
      {anime.number_of_seasons > 0 && (
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

export default AnimeContent;
