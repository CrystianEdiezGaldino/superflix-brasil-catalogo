
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
