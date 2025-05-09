
import { useState, useEffect, useRef } from "react";

interface VideoPlayerProps {
  type: "filme" | "serie";
  imdbId: string;
  season?: number;
  episode?: number;
}

const VideoPlayer = ({ type, imdbId, season, episode }: VideoPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const visibilityChangeRef = useRef<boolean>(false);
  const playerStateRef = useRef<{
    currentTime?: number;
    paused?: boolean;
  }>({});

  // Construir a URL do player
  let playerUrl = `https://superflixapi.nexus/${type}/${imdbId}`;
  
  // Adicionar temporada e episódio se for série
  if (type === "serie" && season !== undefined) {
    playerUrl += `/${season}`;
    
    if (episode !== undefined) {
      playerUrl += `/${episode}`;
    }
  }
  
  // Adicionar parâmetros para otimizar a visualização
  playerUrl += "#noBackground";

  // Store current video state in sessionStorage to preserve across tab switches
  useEffect(() => {
    const storeKey = `video_${type}_${imdbId}_${season || ''}_${episode || ''}`;
    
    // Load previous state if available
    try {
      const savedState = sessionStorage.getItem(storeKey);
      if (savedState) {
        playerStateRef.current = JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Error loading player state:", error);
    }
    
    // Store state when component unmounts or tab switches
    const saveState = () => {
      try {
        sessionStorage.setItem(storeKey, JSON.stringify(playerStateRef.current));
      } catch (error) {
        console.error("Error saving player state:", error);
      }
    };
    
    // Handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveState();
      }
    };
    
    window.addEventListener('beforeunload', saveState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      saveState();
      window.removeEventListener('beforeunload', saveState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [type, imdbId, season, episode]);

  // Prevent iframe from reloading when switching tabs
  useEffect(() => {
    if (!iframeRef.current) return;

    const handleIframeLoad = () => {
      setLoading(false);
    };
    
    iframeRef.current.addEventListener('load', handleIframeLoad);
    
    // Handle visibility changes to prevent iframe reloading
    const handleVisibilityChange = () => {
      visibilityChangeRef.current = document.visibilityState === 'hidden';
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  return (
    <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-xl border-2 border-gray-800">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Carregando player...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={playerUrl}
        title="SuperFlix Player"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        onLoad={() => setLoading(false)}
        referrerPolicy="no-referrer"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
