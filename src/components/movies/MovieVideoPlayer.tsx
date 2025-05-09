
import { useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovieVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  hasAccess: boolean;
}

const MovieVideoPlayer = ({ 
  showPlayer, 
  imdbId,
  hasAccess
}: MovieVideoPlayerProps) => {
  const playerKeyRef = useRef<string>(`${imdbId}`);
  
  if (!showPlayer || !imdbId) return null;
  
  // Restricted access message
  if (!hasAccess) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-gray-900 rounded-lg border-2 border-gray-800">
        <div className="text-center p-8">
          <h3 className="text-xl text-netflix-red font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-white mb-4">Você precisa de uma assinatura ativa para assistir este conteúdo.</p>
          <Link to="/subscribe">
            <Button className="bg-netflix-red hover:bg-red-700">
              Ver Planos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Use a stable reference instead of state to prevent unnecessary rerenders
  return (
    <div id="video-player" className="w-full">
      <VideoPlayer 
        key={playerKeyRef.current}
        type="filme" 
        imdbId={imdbId} 
      />
    </div>
  );
};

export default MovieVideoPlayer;
