
import React, { useState, useEffect, useRef } from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react";

interface AnimeVideoPlayerProps {
  anime: MediaItem;
  videoKey: string;
  onClose: () => void;
}

const AnimeVideoPlayer: React.FC<AnimeVideoPlayerProps> = ({
  anime,
  videoKey,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Here you would actually mute the player in a real implementation
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div 
      ref={playerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-netflix-red animate-spin mb-4" />
            <p className="text-white">Carregando episódio...</p>
            <p className="text-sm text-gray-400">{getMediaTitle(anime)}</p>
          </div>
        </div>
      ) : (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
            title={getMediaTitle(anime)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => {/* Rewind 10s */}}
              >
                <SkipBack size={18} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
              >
                <Play size={18} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => {/* Forward 10s */}}
              >
                <SkipForward size={18} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
            </div>
            
            <div className="flex items-center">
              <Button
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </Button>
            </div>
          </div>
        </>
      )}
      
      <Button 
        size="sm" 
        variant="outline" 
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-gray-700"
        onClick={onClose}
      >
        Voltar
      </Button>
    </div>
  );
};

export default AnimeVideoPlayer;
