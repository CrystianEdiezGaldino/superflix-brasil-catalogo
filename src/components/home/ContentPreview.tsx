
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface ContentPreviewProps {
  movies: MediaItem[];
  series?: MediaItem[];
  anime?: MediaItem[];
}

const ContentPreview = ({ movies, series = [], anime = [] }: ContentPreviewProps) => {
  // Filtrar apenas conteúdos com imagens
  const filteredMovies = movies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = series.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnime = anime.filter(item => item.poster_path || item.backdrop_path);
  
  return (
    <div className="space-y-8">
      {filteredMovies.length > 0 && (
        <MediaSection 
          title="Filmes Populares (Prévia)" 
          medias={filteredMovies.slice(0, 10)} 
        />
      )}
      
      {filteredSeries.length > 0 && (
        <MediaSection 
          title="Séries Populares (Prévia)" 
          medias={filteredSeries.slice(0, 10)} 
        />
      )}
      
      {filteredAnime.length > 0 && (
        <MediaSection 
          title="Anime em Alta (Prévia)" 
          medias={filteredAnime.slice(0, 10)} 
        />
      )}
    </div>
  );
};

export default ContentPreview;
