
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
  
  if (!showPlayer || !imdbId) return null;
  
  return (
    <div id="video-player" className="px-6 md:px-10 mb-10">
      <SeriesVideoPlayer 
        showPlayer={true}
        imdbId={imdbId}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default SeriesPlayer;
