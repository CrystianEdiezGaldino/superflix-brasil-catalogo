
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
      
      // Add event listener to the iframe to prevent default behavior
      if (iframeRef.current) {
        try {
          // This might fail due to cross-origin restrictions
          const iframeDocument = iframeRef.current.contentDocument || 
                               (iframeRef.current.contentWindow?.document);
          
          if (iframeDocument) {
            iframeDocument.addEventListener('click', (e) => {
              e.preventDefault();
              return false;
            });
          }
        } catch (error) {
          console.log("Could not access iframe document due to cross-origin policy");
        }
      }
    };

    // Clean up when component unmounts
    return () => {
      if (iframeRef.current) {
        try {
          const iframeDocument = iframeRef.current.contentDocument || 
                               (iframeRef.current.contentWindow?.document);
          
          if (iframeDocument) {
            iframeDocument.removeEventListener('click', () => {});
          }
        } catch (error) {
          // Silently fail as this is just cleanup
        }
      }
    };
  }, []);

  // Sandbox iframe to prevent opening new windows
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
        sandbox="allow-same-origin allow-scripts allow-forms"
        onLoad={() => setLoading(false)}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
