
import VideoPlayer from "@/components/VideoPlayer";
import { useSubscription } from "@/contexts/SubscriptionContext";

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
  const { isSubscribed, hasTrialAccess, hasTempAccess, isAdmin } = useSubscription();
  
  // Consider all valid access types
  const hasValidAccess = hasAccess || isSubscribed || hasTrialAccess || hasTempAccess || isAdmin;
  
  if (!showPlayer || !imdbId || !hasValidAccess) return null;
  
  return (
    <div className="mt-10">
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
