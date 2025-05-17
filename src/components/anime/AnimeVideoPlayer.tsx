
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnimeVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  selectedSeason: number;
  selectedEpisode: number;
  hasAccess: boolean;
}

const AnimeVideoPlayer = ({ 
  showPlayer, 
  imdbId, 
  selectedSeason, 
  selectedEpisode,
  hasAccess
}: AnimeVideoPlayerProps) => {
  if (!showPlayer || !imdbId) return null;
  
  // Display restricted access message if user doesn't have access
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
        key={`${imdbId}-${selectedSeason}-${selectedEpisode}`}
        type="serie" 
        imdbId={imdbId} 
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  );
};

export default AnimeVideoPlayer;
