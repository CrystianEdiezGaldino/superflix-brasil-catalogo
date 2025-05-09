
import { useEffect, useState } from "react";
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
  const [playerKey, setPlayerKey] = useState<string>(`${imdbId}-${selectedSeason}-${selectedEpisode}`);
  
  // Update player key when source changes to force proper reload
  useEffect(() => {
    if (showPlayer && imdbId) {
      setPlayerKey(`${imdbId}-${selectedSeason}-${selectedEpisode}-${Date.now()}`);
    }
  }, [showPlayer, imdbId, selectedSeason, selectedEpisode]);
  
  // Store player state in session storage to persist through refreshes and tab changes
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
      
      // Handle tab visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // Tab is now visible, don't reload player unnecessarily
          const currentState = sessionStorage.getItem('playerState');
          if (currentState) {
            try {
              const parsedState = JSON.parse(currentState);
              if (parsedState.imdbId === imdbId &&
                  parsedState.selectedSeason === selectedSeason &&
                  parsedState.selectedEpisode === selectedEpisode) {
                // Same content, maintain player state
                console.log("Maintaining player state on tab visibility change");
              }
            } catch (error) {
              console.error("Error parsing player state:", error);
            }
          }
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
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
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pageshow', handlePageShow);
      };
    }
  }, [showPlayer, imdbId, selectedSeason, selectedEpisode]);
  
  if (!showPlayer || !imdbId || !hasAccess) return null;
  
  return (
    <div className="w-full">
      <VideoPlayer 
        key={playerKey}
        type="serie" 
        imdbId={imdbId} 
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  );
};

export default SeriesVideoPlayer;
