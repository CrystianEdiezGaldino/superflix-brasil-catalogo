import { useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovieVideoPlayerProps {
  showPlayer: boolean;
  imdbId: string | undefined;
  hasAccess: boolean;
}

const MovieVideoPlayer = ({ showPlayer, imdbId, hasAccess }: MovieVideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);

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
      <div ref={playerRef} className="w-full aspect-video">
        <VideoPlayer
          type="filme"
          imdbId={imdbId}
        />
      </div>
    </div>
  );
};

export default MovieVideoPlayer;
