
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdbApi";
import VideoPlayer from "@/components/VideoPlayer";
import SeriesBanner from "@/components/series/SeriesBanner";
import SeriesInfo from "@/components/series/SeriesInfo";
import EpisodesList from "@/components/series/EpisodesList";
import { Series } from "@/types/movie";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

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
        <a href="/" className="text-netflix-red hover:underline">
          Voltar para a página inicial
        </a>
      </div>
    );
  }

  const seasons = Array.from({ length: series.number_of_seasons || 0 }, (_, i) => i + 1);
  const imdbId = series.external_ids?.imdb_id;

  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          </div>

          {/* Informações da série */}
          <SeriesInfo 
            series={series} 
            showPlayer={showPlayer} 
            setShowPlayer={setShowPlayer} 
          />
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
          />
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
