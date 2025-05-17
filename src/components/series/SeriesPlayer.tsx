
import SeriesVideoPlayer from "./SeriesVideoPlayer";
import { Series } from "@/types/movie";
import { useEffect } from "react";

interface SeriesPlayerProps {
  showPlayer: boolean;
  series: Series;
  selectedSeason: number;
  selectedEpisode: number;
  hasAccess: boolean;
}

const SeriesPlayer = ({
  showPlayer,
  series,
  selectedSeason,
  selectedEpisode,
  hasAccess
}: SeriesPlayerProps) => {
  const imdbId = series.external_ids?.imdb_id;
  
  if (!showPlayer || !imdbId) return null;
  
  return (
    <div className="px-4 sm:px-6 md:px-10 mb-10 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-800 shadow-xl">
          <SeriesVideoPlayer 
            showPlayer={true}
            imdbId={imdbId}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            hasAccess={hasAccess}
          />
        </div>
        
        <div className="mt-4 px-2 text-gray-400 text-sm">
          <p>Assistindo: Temporada {selectedSeason} | Episódio {selectedEpisode}</p>
        </div>
      </div>
    </div>
  );
};

export default SeriesPlayer;
