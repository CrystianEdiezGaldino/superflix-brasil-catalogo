
import React, { useEffect } from "react";
import AnimeVideoPlayer from "./AnimeVideoPlayer";
import { Series } from "@/types/movie";

interface AnimePlayerProps {
  showPlayer: boolean;
  anime: Series;
  selectedSeason: number;
  selectedEpisode: number;
  hasAccess: boolean;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({
  showPlayer,
  anime,
  selectedSeason,
  selectedEpisode,
  hasAccess
}) => {
  // Verificar se temos um ID IMDB válido utilizando external_ids ou imdb_id diretamente
  const imdbId = anime.external_ids?.imdb_id || anime.imdb_id;
  const videoKey = "dQw4w9WgXcQ"; // Example video key - in real app this would come from API
  
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
  
  // Se não tiver player ou acesso, não mostrar nada
  if (!showPlayer || !imdbId) return null;
  
  // Se não tiver acesso, mostrar mensagem de acesso restrito
  if (!hasAccess) {
    return (
      <div id="video-player" className="px-6 md:px-10 mb-10">
        <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Conteúdo Restrito</h3>
            <p className="text-gray-300">Você precisa de uma assinatura ativa para assistir a este anime.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div id="video-player" className="px-6 md:px-10 mb-10">
      <AnimeVideoPlayer
        anime={anime}
        videoKey={videoKey}
        onClose={() => {/* Handle close */}}
      />
    </div>
  );
};

export default AnimePlayer;
