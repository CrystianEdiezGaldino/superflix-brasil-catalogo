import AnimeVideoPlayer from "./AnimeVideoPlayer";
import { Series } from "@/types/movie";
import { useEffect } from "react";
import SuperFlixPlayer from "../series/SuperFlixPlayer";


interface AnimePlayerProps {
  showPlayer: boolean;
  anime: Series;
  selectedSeason: number;
  selectedEpisode: number;
  hasAccess: boolean;
}

const AnimePlayer = ({
  showPlayer,
  anime,
  selectedSeason,
  selectedEpisode,
  hasAccess
}: AnimePlayerProps) => {
  // Verificar se temos um ID IMDB válido
  const imdbId = anime.external_ids?.imdb_id || anime.imdb_id;
  
  // Scroll to player when it becomes visible
  useEffect(() => {
    if (showPlayer) {
      const playerElement = document.getElementById('video-player');
      if (playerElement) {
        setTimeout(() => {
          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [showPlayer]);
  
  // Se não tiver player, ID IMDB ou acesso, não mostrar nada
  if (!showPlayer || !imdbId) return null;
  
  // Se não tiver acesso, mostrar mensagem de acesso restrito
  if (!hasAccess) {
    return (
      <div id="video-player" className="px-6 md:px-10 mb-10">
        <AnimeVideoPlayer
          showPlayer={true}
          imdbId={imdbId}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          hasAccess={false}
        />
      </div>
    );
  }
  
  return (
    <div id="video-player" className="px-6 md:px-10 mb-10">
      {/* Usando VideoPlayer para garantir compatibilidade */}
      <AnimeVideoPlayer
        showPlayer={true}
        imdbId={imdbId}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default AnimePlayer;
