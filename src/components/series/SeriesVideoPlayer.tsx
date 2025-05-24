import { useEffect, useState, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tv, Cast } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initializeCast, castToTV } from "@/utils/cast";
import { cn } from "@/lib/utils";

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
  const [isCastingAvailable, setIsCastingAvailable] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  
  useEffect(() => {
    const initCast = async () => {
      try {
        await initializeCast();
        setIsCastingAvailable(true);
      } catch (error) {
        console.log('Cast não disponível:', error);
      }
    };

    initCast();
  }, []);

  const handleCast = async () => {
    if (!imdbId) return;

    try {
      const videoUrl = `https://seu-servidor.com/watch/${imdbId}/season/${selectedSeason}/episode/${selectedEpisode}`;
      await castToTV(videoUrl);
      setIsCasting(true);
      toast.success('Transmitindo para TV');
    } catch (error) {
      console.error('Erro ao iniciar cast:', error);
      toast.error('Erro ao transmitir para TV');
    }
  };

  const stopCasting = () => {
    setIsCasting(false);
    toast.success('Transmissão encerrada');
  };
  
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
    <div className="w-full relative group">
      <VideoPlayer 
        key={playerKey}
        type="serie" 
        imdbId={imdbId} 
        season={selectedSeason}
        episode={selectedEpisode}
      />

      {/* Botão de Cast */}
      {isCastingAvailable && (
        <div className="absolute top-4 right-4 z-[9999] opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "rounded-full px-4 py-2 flex items-center justify-center gap-2 text-white font-medium shadow-lg hover:scale-105 transition-all min-w-[120px]",
                  isCasting
                    ? "bg-white/10 border border-white hover:bg-white/20"
                    : "bg-black/60 backdrop-blur border border-gray-600 hover:border-white"
                )}
              >
                {isCasting ? (
                  <>
                    <Cast 
                      size={20} 
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isCasting && "text-netflix-red"
                      )}
                    />
                    <span className="text-sm font-medium">Transmitindo</span>
                  </>
                ) : (
                  <>
                    <Tv size={20} className="h-5 w-5" />
                    <span className="text-sm font-medium">Ver na TV</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-black/95 backdrop-blur-sm border border-gray-800 shadow-2xl"
            >
              <DropdownMenuItem
                onClick={isCasting ? stopCasting : handleCast}
                className="text-white hover:bg-white/10 cursor-pointer transition-colors duration-200"
              >
                {isCasting ? (
                  <>
                    <Cast className="h-4 w-4 mr-2 text-netflix-red" />
                    <span className="font-medium">Parar de Transmitir</span>
                  </>
                ) : (
                  <>
                    <Tv className="h-4 w-4 mr-2 text-netflix-red" />
                    <span className="font-medium">Assistir na TV</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default SeriesVideoPlayer;
