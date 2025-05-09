
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface ContentPreviewProps {
  movies: MediaItem[];
  series?: MediaItem[];
  anime?: MediaItem[];
}

const ContentPreview = ({ movies, series = [], anime = [] }: ContentPreviewProps) => {
  return (
    <div className="space-y-8">
      <MediaSection 
        title="Filmes Populares (Prévia)" 
        medias={movies.slice(0, 10)} 
      />
      
      {series.length > 0 && (
        <MediaSection 
          title="Séries Populares (Prévia)" 
          medias={series.slice(0, 10)} 
        />
      )}
      
      {anime.length > 0 && (
        <MediaSection 
          title="Anime em Alta (Prévia)" 
          medias={anime.slice(0, 10)} 
        />
      )}
    </div>
  );
};

export default ContentPreview;
