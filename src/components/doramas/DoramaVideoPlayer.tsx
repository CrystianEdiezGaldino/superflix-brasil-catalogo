
import { useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DoramaVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  hasAccess?: boolean;
}

const DoramaVideoPlayer = ({ 
  showPlayer, 
  imdbId,
  hasAccess = true // Default to true if not specified
}: DoramaVideoPlayerProps) => {
  const playerKeyRef = useRef<string>(`dorama-${imdbId}`);
  
  if (!showPlayer || !imdbId) return null;
  
  // Check access restrictions
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
  
  return (
    <div className="w-full">
      <VideoPlayer 
        key={playerKeyRef.current}
        type="serie" // Doramas are treated as series in the API
        imdbId={imdbId}
      />
    </div>
  );
};

export default DoramaVideoPlayer;
