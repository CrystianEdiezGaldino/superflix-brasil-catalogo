
import { useEffect, useState, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  const previousEpisodeRef = useRef({ season: selectedSeason, episode: selectedEpisode });
  
  // Only update the player key when essential source data changes
  // Not on every tab switch or visibility change
  useEffect(() => {
    // Compare current episode with previous to detect real changes
    const currentEpisode = { season: selectedSeason, episode: selectedEpisode };
    const episodeChanged = 
      previousEpisodeRef.current.season !== currentEpisode.season || 
      previousEpisodeRef.current.episode !== currentEpisode.episode;
    
    // Only regenerate player key when the actual content changes
    if (showPlayer && imdbId && episodeChanged) {
      setPlayerKey(`${imdbId}-${selectedSeason}-${selectedEpisode}`);
      previousEpisodeRef.current = currentEpisode;
    }
  }, [showPlayer, imdbId, selectedSeason, selectedEpisode]);
  
  if (!showPlayer || !imdbId) return null;
  
  // Exibir uma mensagem de acesso restrito se o usuário não tiver acesso
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
