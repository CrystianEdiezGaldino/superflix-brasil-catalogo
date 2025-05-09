
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

  // This effect handles page visibility changes and prevents iframe reload
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

    // Special handling for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When tab becomes inactive, mark this state but don't do anything that
        // could cause a reload
        visibilityChangeRef.current = true;
      } else if (visibilityChangeRef.current) {
        // Tab is now visible again, but don't reload anything
        visibilityChangeRef.current = false;
      }
    };

    // Listen for visibility changes but don't trigger any reloads
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set cache control headers to prevent reloading
    if (iframeRef.current) {
      // Apply attributes to help prevent reloading
      iframeRef.current.setAttribute('loading', 'eager');
      // Add special style to ensure iframe stays intact during tab switches
      iframeRef.current.style.willChange = 'transform';
    }

    // Memory management - Clean up event listeners on component unmount only
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Only store state on real page unloads, not tab switches
      if (!visibilityChangeRef.current) {
        try {
          sessionStorage.setItem(storeKey, JSON.stringify(playerStateRef.current));
        } catch (error) {
          console.error("Error saving player state:", error);
        }
      }
    };
  }, [type, imdbId, season, episode]);

  // This effect handles iframe interactions without causing reloads
  useEffect(() => {
    if (!iframeRef.current) return;

    const handleIframeLoad = () => {
      setLoading(false);
      
      // Listen for state messages from the iframe
      const messageHandler = (event: MessageEvent) => {
        // Only accept messages from our iframe source
        if (event.source !== iframeRef.current?.contentWindow) return;
        
        try {
          // Store player state if provided
          if (event.data && typeof event.data === 'object' && 'playerState' in event.data) {
            playerStateRef.current = event.data.playerState;
          }
        } catch (error) {
          console.error("Error processing player message:", error);
        }
      };

      // Add event listener for messages from iframe
      window.addEventListener('message', messageHandler);
      
      // Return cleanup function to remove event listener
      return () => {
        window.removeEventListener('message', messageHandler);
      };
    };
    
    // Add load event for initial setup
    const iframe = iframeRef.current;
    iframe.addEventListener('load', handleIframeLoad);
    
    // Cleanup function removes listeners
    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
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
        style={{ display: 'block' }}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
