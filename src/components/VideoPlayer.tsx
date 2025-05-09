
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

  // Prevent new tabs from opening and handle iframe navigation
  useEffect(() => {
    const handleIframeLoad = () => {
      setLoading(false);
      
      // Add event listener to prevent default navigation
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Try to add click interceptor to iframe
      if (iframeRef.current) {
        try {
          const iframe = iframeRef.current;
          
          // Try to access iframe content and add event listener
          iframe.addEventListener('load', () => {
            try {
              const iframeDocument = iframe.contentDocument || 
                                    (iframe.contentWindow?.document);
                
              if (iframeDocument) {
                iframeDocument.addEventListener('click', handleClick, true);
                // Prevent context menu to block right-click new tabs
                iframeDocument.addEventListener('contextmenu', handleClick, true);
              }
            } catch (error) {
              console.log("Could not access iframe document: cross-origin restriction");
            }
          });
        } catch (error) {
          console.log("Error setting up iframe event handlers:", error);
        }
      }
    };
    
    if (iframeRef.current) {
      handleIframeLoad();
    }

    // Page visibility change handler with improved state preservation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && visibilityChangeRef.current) {
        // Avoid complete reload when returning to the tab
        visibilityChangeRef.current = false;
        
        // Try to restore player state if we saved it
        try {
          const savedState = sessionStorage.getItem('videoPlayerState');
          if (savedState && iframeRef.current?.contentWindow) {
            const parsedState = JSON.parse(savedState);
            if (parsedState.imdbId === imdbId && 
                parsedState.type === type &&
                parsedState.season === season && 
                parsedState.episode === episode) {
              
              // We won't reload the iframe, just use existing one
              console.log("Tab visible again, maintaining player state");
            }
          }
        } catch (error) {
          console.error("Error restoring player state:", error);
        }
      } else if (document.visibilityState === 'hidden') {
        visibilityChangeRef.current = true;
        
        // Save current state before leaving
        try {
          const state = {
            type,
            imdbId,
            season,
            episode,
            lastActive: new Date().getTime(),
            ...playerStateRef.current
          };
          sessionStorage.setItem('videoPlayerState', JSON.stringify(state));
          console.log("Tab hidden, saved player state");
        } catch (error) {
          console.error("Error saving player state:", error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Save player state on unload
    const handleBeforeUnload = () => {
      try {
        const state = {
          type,
          imdbId,
          season,
          episode,
          lastActive: new Date().getTime(),
          ...playerStateRef.current
        };
        sessionStorage.setItem('videoPlayerState', JSON.stringify(state));
      } catch (error) {
        // Silent error in unload event
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup attempt (will likely fail due to cross-origin)
      if (iframeRef.current) {
        try {
          const iframeDocument = iframeRef.current.contentDocument || 
                               (iframeRef.current.contentWindow?.document);
          if (iframeDocument) {
            iframeDocument.removeEventListener('click', () => {});
            iframeDocument.removeEventListener('contextmenu', () => {});
          }
        } catch (error) {
          // Silently fail as this is just cleanup
        }
      }
    };
  }, [type, imdbId, season, episode]);

  // Improve state persistence with postMessage API
  useEffect(() => {
    // Try to communicate with iframe using postMessage
    const messageHandler = (event: MessageEvent) => {
      // Check origin for security (adapt to your video player's domain)
      try {
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'videoState') {
            playerStateRef.current = {
              currentTime: event.data.currentTime,
              paused: event.data.paused
            };
          }
        }
      } catch (error) {
        console.error("Error handling message from iframe:", error);
      }
    };
    
    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  // Persist player state in sessionStorage with improved handling
  useEffect(() => {
    // Load previous state if available
    try {
      const savedState = sessionStorage.getItem('videoPlayerState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Only restore for same content
        if (parsedState.imdbId === imdbId && 
            parsedState.type === type &&
            parsedState.season === season && 
            parsedState.episode === episode) {
          
          playerStateRef.current = {
            currentTime: parsedState.currentTime,
            paused: parsedState.paused
          };
          
          // If we have time info, we could potentially seek the player here
          // But this requires iframe cooperation
        }
      }
    } catch (error) {
      console.error("Error loading player state:", error);
    }
    
    // Save current video state on component mount
    sessionStorage.setItem('currentVideoState', JSON.stringify({
      type,
      imdbId,
      season,
      episode,
      scrollPosition: window.scrollY,
      lastActive: new Date().getTime()
    }));
    
    // Handle beforeunload to save state
    const handleBeforeUnload = () => {
      sessionStorage.setItem('currentVideoState', JSON.stringify({
        type,
        imdbId,
        season,
        episode,
        scrollPosition: window.scrollY,
        lastActive: new Date().getTime(),
        ...playerStateRef.current
      }));
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [type, imdbId, season, episode]);

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
        // Additional security attributes but NOT sandbox which blocks functionality
        referrerPolicy="no-referrer"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
