
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface VideoPlayerProps {
  type: "filme" | "serie";
  imdbId: string;
  season?: number;
  episode?: number;
}

const VideoPlayer = ({ type, imdbId, season, episode }: VideoPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const [contentUnavailable, setContentUnavailable] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const visibilityChangeRef = useRef<boolean>(false);
  const playerStateRef = useRef<{
    currentTime?: number;
    paused?: boolean;
  }>({});

  // Construir a URL do player usando a API correta
  let playerUrl = `https://superflixapi.ist/${type}/${imdbId}`;
  
  // Adicionar temporada e episódio se for série
  if (type === "serie" && season !== undefined) {
    playerUrl += `/${season}`;
    
    if (episode !== undefined) {
      playerUrl += `/${episode}`;
    }
  }

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

  // Check for error messages in the iframe
  useEffect(() => {
    if (!iframeRef.current) return;

    const checkContentAvailability = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      try {
        // Try to access iframe content after it loads
        setTimeout(() => {
          try {
            if (iframe.contentDocument?.body?.innerText?.includes("Estranho?!") || 
                iframe.contentDocument?.body?.innerText?.includes("warezcdn.link") ||
                iframe.contentDocument?.body?.innerText?.includes("Tem algum problema com o seu video")) {
              setContentUnavailable(true);
            }
          } catch (e) {
            // Cross-origin restrictions might prevent this check
            console.log("Could not check iframe content due to cross-origin policy");
          }
        }, 2000);
      } catch (error) {
        console.error("Error checking iframe content:", error);
      }
    };

    // Add load handler to check content
    const iframe = iframeRef.current;
    iframe.addEventListener('load', checkContentAvailability);
    
    return () => {
      iframe.removeEventListener('load', checkContentAvailability);
    };
  }, [imdbId, season, episode]);

  // If content is unavailable, show a custom message
  if (contentUnavailable) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-gray-900 rounded-lg border-2 border-gray-800">
        <div className="text-center p-8 max-w-lg">
          <h3 className="text-2xl text-netflix-red font-semibold mb-4">Conteúdo Em Breve</h3>
          <p className="text-white text-lg mb-6">
            Este conteúdo ainda não está disponível em nossa plataforma, mas estamos trabalhando para adicioná-lo o quanto antes.
          </p>
          <p className="text-gray-400 mb-8">
            Adicione aos seus favoritos para ser notificado quando estiver disponível para assistir.
          </p>
          <div className="flex justify-center">
            <Button 
              className="bg-netflix-red hover:bg-red-700 flex items-center gap-2"
              onClick={() => {
                // Aqui você pode implementar a lógica para adicionar aos favoritos
                toast.success("Adicionado aos favoritos! Você será notificado quando disponível.");
              }}
            >
              <Heart size={18} /> Adicionar aos Favoritos
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
