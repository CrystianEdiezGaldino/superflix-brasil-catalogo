
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

    return () => {
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
  }, []);

  // Persist player state in sessionStorage
  useEffect(() => {
    // Save current player state to session storage
    sessionStorage.setItem('currentVideoState', JSON.stringify({
      type,
      imdbId,
      season,
      episode,
      scrollPosition: window.scrollY
    }));
    
    // Listen for beforeunload to save state
    const handleBeforeUnload = () => {
      sessionStorage.setItem('currentVideoState', JSON.stringify({
        type,
        imdbId,
        season,
        episode,
        scrollPosition: window.scrollY
      }));
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [type, imdbId, season, episode]);

  // Removed sandbox attribute to allow full functionality
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
