import { useRef, useState, useEffect } from "react";
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

interface MovieVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  hasAccess: boolean;
}

const MovieVideoPlayer = ({ showPlayer, imdbId, hasAccess }: MovieVideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
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
      const videoUrl = `https://seu-servidor.com/watch/${imdbId}`;
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

  if (!hasAccess) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Você precisa ter uma assinatura para assistir este filme</p>
          <Link to="/subscribe">
            <Button className="bg-netflix-red hover:bg-red-700">
              Assinar Agora
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="relative group">
        <div ref={playerRef} className="w-full aspect-video">
          <VideoPlayer
            type="filme"
            imdbId={imdbId}
          />
        </div>
        
        {/* Botão de Cast */}
        {isCastingAvailable && (
          <div className="absolute top-4 right-4 z-[9999] opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full bg-netflix-red hover:bg-red-700 p-2 flex items-center justify-center text-white font-medium shadow-lg hover:scale-105 transition-all"
                >
                  {isCasting ? (
                    <Cast className="h-5 w-5 text-white" />
                  ) : (
                    <Tv className="h-5 w-5 text-white" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 z-[9999]">
                <DropdownMenuItem
                  onClick={isCasting ? stopCasting : handleCast}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  {isCasting ? (
                    <>
                      <Cast className="h-4 w-4 mr-2 text-netflix-red" />
                      Parar de Transmitir
                    </>
                  ) : (
                    <>
                      <Tv className="h-4 w-4 mr-2 text-netflix-red" />
                      Assistir na TV
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieVideoPlayer;
