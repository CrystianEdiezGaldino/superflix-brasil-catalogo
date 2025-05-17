import { Link } from "react-router-dom";
import { Series, Season } from "@/types/movie";
import { Button } from "@/components/ui/button";
import EpisodesList from "./EpisodesList";
import SeriesAccessPrompt from "./SeriesAccessPrompt";
import { Loader2 } from "lucide-react";

interface SeriesContentProps {
  series: Series;
  hasAccess: boolean;
  seasonData: Season | undefined;
  selectedSeason: number;
  selectedEpisode: number;
  seasons: number[];
  setSelectedSeason: (season: number) => void;
  handleEpisodeSelect: (episode: number) => void;
  isLoadingSeason: boolean;
  subscriptionLoading: boolean;
}

const SeriesContent = ({
  series,
  hasAccess,
  seasonData,
  selectedSeason,
  selectedEpisode,
  seasons,
  setSelectedSeason,
  handleEpisodeSelect,
  isLoadingSeason,
  subscriptionLoading
}: SeriesContentProps) => {
  return (
    <div className="px-4 sm:px-6 md:px-10 mb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left column - Episodes */}
          <div className="w-full lg:w-2/3">
            <div className="bg-netflix-dark rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Episódios
              </h2>

              {/* Season selector */}
              <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-netflix-red scrollbar-track-netflix-gray">
                {seasons.map((season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedSeason === season
                        ? "bg-netflix-red text-white"
                        : "bg-netflix-gray text-gray-300 hover:bg-netflix-gray-hover"
                    }`}
                  >
                    Temporada {season}
                  </button>
                ))}
              </div>

              {/* Episodes list */}
              {isLoadingSeason ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
                </div>
              ) : seasonData?.episodes ? (
                <div className="space-y-3 sm:space-y-4">
                  {seasonData.episodes.map((episode) => (
                    <button
                      key={episode.episode_number}
                      onClick={() => handleEpisodeSelect(episode.episode_number)}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg transition-colors ${
                        selectedEpisode === episode.episode_number
                          ? "bg-netflix-red/20 border border-netflix-red"
                          : "bg-netflix-gray hover:bg-netflix-gray-hover"
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="relative w-32 sm:w-40 h-20 sm:h-24 flex-shrink-0">
                          {episode.still_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                              alt={episode.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-netflix-gray rounded flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Em lançamento</span>
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-netflix-red/80 flex items-center justify-center">
                              <span className="text-white text-xs sm:text-sm">
                                {episode.episode_number}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-medium text-white mb-1 truncate">
                            {episode.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                            {episode.air_date && new Date(episode.air_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                            {episode.overview || "Sem descrição disponível."}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Nenhum episódio disponível para esta temporada.
                </div>
              )}
            </div>
          </div>

          {/* Right column - Series info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-netflix-dark rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Sobre
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    Título Original
                  </h3>
                  <p className="text-sm sm:text-base text-white">{series.original_name}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    Gêneros
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {series.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-2 py-1 bg-netflix-gray text-xs sm:text-sm text-gray-300 rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    Status
                  </h3>
                  <p className="text-sm sm:text-base text-white">
                    {series.status === "Returning Series"
                      ? "Em produção"
                      : series.status === "Ended"
                      ? "Finalizada"
                      : series.status}
                  </p>
                </div>
                {series.first_air_date && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                      Data de Lançamento
                    </h3>
                    <p className="text-sm sm:text-base text-white">
                      {new Date(series.first_air_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    Temporadas
                  </h3>
                  <p className="text-sm sm:text-base text-white">{series.number_of_seasons}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                    Episódios
                  </h3>
                  <p className="text-sm sm:text-base text-white">{series.number_of_episodes}</p>
                </div>
                {series.overview && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                      Sinopse
                    </h3>
                    <p className="text-sm sm:text-base text-white">{series.overview}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesContent;
