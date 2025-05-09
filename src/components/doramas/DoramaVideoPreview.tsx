
import React, { useState, useRef, useEffect } from "react";
import { useHover } from "@/hooks/useHover";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Series } from "@/types/movie";

interface DoramaVideoPreviewProps {
  dorama: Series;
  videoId?: string;
}

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/";

const DoramaVideoPreview = ({ dorama, videoId }: DoramaVideoPreviewProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const isHoveringRef = useHover(containerRef);

  // If no videoId provided, we won't show a preview
  const hasVideo = !!videoId;

  // Handle hover state with a delay to prevent flickering
  useEffect(() => {
    if (isHoveringRef && !isHovering) {
      timerRef.current = setTimeout(() => {
        setIsHovering(true);
      }, 700); // Delay before showing preview
    } else if (!isHoveringRef && isHovering) {
      clearTimeout(timerRef.current);
      setIsHovering(false);
      setIsLoaded(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHoveringRef, isHovering]);

  // Get title from dorama
  const title = dorama.name;
  
  return (
    <div 
      ref={containerRef}
      className="relative group w-full h-full"
    >
      {/* Base Card Content (Always Visible) */}
      <div className="w-full h-full">
        {dorama.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${dorama.poster_path}`}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      {/* Video Preview (Only shows on hover and if video is available) */}
      {isHovering && hasVideo && (
        <div className="absolute inset-0 bg-black rounded-lg overflow-hidden shadow-2xl z-20 transform transition-transform duration-300 scale-[1.55] origin-center">
          <div className="w-full h-full flex flex-col">
            {/* Video Container */}
            <div className="relative w-full flex-grow bg-black">
              <iframe
                src={`${YOUTUBE_EMBED_URL}${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`}
                title={`${title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className={`w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
              />
              
              {/* Loading state */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Info Bar */}
            <div className="bg-black bg-opacity-90 p-2">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-white text-black hover:bg-white/90"
                    asChild
                  >
                    <Link to={`/serie/${dorama.id}`}>
                      <Play size={16} />
                    </Link>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-gray-700 text-white hover:bg-gray-600"
                    asChild
                  >
                    <Link to={`/serie/${dorama.id}`}>
                      <Info size={16} />
                    </Link>
                  </Button>
                </div>
                
                <Button
                  size="icon"
                  variant="ghost" 
                  className="rounded-full bg-gray-700 text-white hover:bg-gray-600"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>
              
              <div className="mt-1 text-xs text-white font-medium truncate">
                {title}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoramaVideoPreview;
