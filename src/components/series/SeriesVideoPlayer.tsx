
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
      const playerState = {
        type: 'serie',
        imdbId,
        selectedSeason,
        selectedEpisode,
        showPlayer,
        lastUpdated: new Date().toISOString(),
        scrollPosition: window.scrollY
      };
      
      sessionStorage.setItem('playerState', JSON.stringify(playerState));
      
      // Restore scroll position if returning to this page
      const handlePageShow = (e: PageTransitionEvent) => {
        try {
          // Verifica se está voltando de uma mudança de aba
          if (e.persisted) {
            const savedState = sessionStorage.getItem('playerState');
            if (savedState) {
              const parsedState = JSON.parse(savedState);
              if (parsedState.scrollPosition) {
                setTimeout(() => {
                  window.scrollTo(0, parsedState.scrollPosition);
                }, 100);
              }
            }
          }
        } catch (error) {
          console.error("Error restoring player state:", error);
        }
      };
      
      window.addEventListener('pageshow', handlePageShow);
      
      return () => {
        window.removeEventListener('pageshow', handlePageShow);
      };
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
