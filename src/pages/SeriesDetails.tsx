
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdbApi";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showEpisodes, setShowEpisodes] = useState(false);

  const { data: series, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series", id],
    queryFn: () => fetchSeriesDetails(Number(id)),
    enabled: !!id,
  });

  const { data: seasonData, isLoading: isLoadingSeason } = useQuery({
    queryKey: ["season", id, selectedSeason],
    queryFn: () => fetchSeasonDetails(Number(id), selectedSeason),
    enabled: !!id && !!series,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
      setSelectedEpisode(seasonData.episodes[0].episode_number);
    }
  }, [seasonData]);

  if (isLoadingSeries || isLoadingSeason) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Série não encontrada</h1>
        <Link to="/" className="text-netflix-red hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const releaseYear = series.first_air_date
    ? new Date(series.first_air_date).getFullYear()
    : null;

  const seasons = Array.from({ length: series.number_of_seasons || 0 }, (_, i) => i + 1);
  const imdbId = series.external_ids?.imdb_id;

  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Header com backdrop da série */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          {series.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
              alt={series.name}
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
          </div>

          {/* Detalhes */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {series.name} {releaseYear && <span className="font-normal text-gray-400">({releaseYear})</span>}
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

            {imdbId && (
              <div className="mt-8">
                <Button 
                  onClick={() => setShowPlayer(!showPlayer)} 
                  className="bg-netflix-red hover:bg-red-700"
                >
                  {showPlayer ? "Ocultar Player" : "Assistir Agora"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Player de vídeo */}
        {showPlayer && imdbId && (
          <div className="mt-10">
            <VideoPlayer 
              type="serie" 
              imdbId={imdbId} 
              season={selectedSeason}
              episode={selectedEpisode}
            />
          </div>
        )}

        {/* Seleção de temporadas */}
        {series.number_of_seasons > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Episódios</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white"
                onClick={() => setShowEpisodes(!showEpisodes)}
              >
                {showEpisodes ? (
                  <>
                    <ChevronUp className="mr-2" size={18} />
                    Ocultar
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2" size={18} />
                    Mostrar
                  </>
                )}
              </Button>
            </div>
            
            {showEpisodes && (
              <div className="mt-4">
                <Tabs defaultValue={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(Number(value))}>
                  <TabsList className="bg-gray-900 mb-4 overflow-x-auto flex-wrap">
                    {seasons.map((season) => (
                      <TabsTrigger key={season} value={season.toString()}>
                        Temporada {season}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {seasons.map((season) => (
                    <TabsContent key={season} value={season.toString()} className="animate-fade-in">
                      {seasonData && seasonData.episodes ? (
                        <div className="space-y-4">
                          {seasonData.episodes.map((episode) => (
                            <div 
                              key={episode.id} 
                              className={`p-4 rounded-md cursor-pointer ${
                                selectedEpisode === episode.episode_number 
                                  ? "bg-gray-800 border border-netflix-red" 
                                  : "bg-gray-900 hover:bg-gray-800"
                              }`}
                              onClick={() => handleEpisodeSelect(episode.episode_number)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-white font-semibold">
                                    {episode.episode_number}. {episode.name}
                                  </h3>
                                  <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                                    {episode.overview || "Nenhuma sinopse disponível."}
                                  </p>
                                </div>
                                
                                {episode.still_path && (
                                  <img 
                                    src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                    alt={episode.name}
                                    className="w-32 h-18 object-cover rounded"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">Carregando episódios...</p>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
