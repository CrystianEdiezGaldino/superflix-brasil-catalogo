
import { useState } from "react";

interface VideoPlayerProps {
  type: "filme" | "serie";
  imdbId: string;
  season?: number;
  episode?: number;
}

const VideoPlayer = ({ type, imdbId, season, episode }: VideoPlayerProps) => {
  const [loading, setLoading] = useState(true);

  // Construir a URL do player
  let playerUrl = `https://superflixapi.nexus/${type}/${imdbId}`;
  
  // Adicionar temporada e episódio se for série
  if (type === "serie" && season !== undefined) {
    playerUrl += `/${season}`;
    
    if (episode !== undefined) {
      playerUrl += `/${episode}`;
    }
  }
  
  // Adicionar parâmetros para otimizar a visualização
  playerUrl += "#noBackground";

  return (
    <div className="w-full aspect-video relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <iframe
        src={playerUrl}
        title="SuperFlix Player"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        onLoad={() => setLoading(false)}
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
