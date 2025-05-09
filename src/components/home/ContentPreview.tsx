
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface ContentPreviewProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
}

const ContentPreview = ({ movies, series, anime }: ContentPreviewProps) => {
  return (
    <>
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Prévia do conteúdo</h2>
        <p className="text-gray-400 mb-4">
          Assine para ter acesso completo a todos os títulos. Confira uma pequena prévia abaixo:
        </p>
      </div>
      
      <MediaSection 
        title="Filmes Populares (Prévia)" 
        medias={movies.slice(0, 4)} 
      />
      
      <MediaSection 
        title="Séries Populares (Prévia)" 
        medias={series.slice(0, 4)} 
      />
      
      <MediaSection 
        title="Anime em Alta (Prévia)" 
        medias={anime.slice(0, 4)} 
      />
    </>
  );
};

export default ContentPreview;
