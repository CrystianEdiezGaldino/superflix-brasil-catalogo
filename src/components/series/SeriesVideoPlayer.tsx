
import { useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";

interface SeriesVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  selectedSeason: number;
  selectedEpisode: number;
  hasAccess: boolean;
}

const SeriesVideoPlayer = ({ 
  showPlayer, 
  imdbId, 
  selectedSeason, 
  selectedEpisode,
  hasAccess
}: SeriesVideoPlayerProps) => {
  // Store player state in session storage to persist through refreshes
  useEffect(() => {
    if (showPlayer && imdbId) {
      sessionStorage.setItem('playerState', JSON.stringify({
        imdbId,
        selectedSeason,
        selectedEpisode,
        showPlayer
      }));
    }
  }, [showPlayer, imdbId, selectedSeason, selectedEpisode]);
  
  if (!showPlayer || !imdbId || !hasAccess) return null;
  
  return (
    <div className="w-full">
      <VideoPlayer 
        type="serie" 
        imdbId={imdbId} 
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  );
};

export default SeriesVideoPlayer;
