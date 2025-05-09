
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface FullContentProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  topRatedAnime?: MediaItem[];
  specificAnimeRecommendations?: MediaItem[];
  recommendations?: MediaItem[];
  doramas?: MediaItem[]; // New section for doramas
}

const FullContent = ({ 
  movies, 
  series, 
  anime, 
  topRatedAnime,
  recommendations,
  doramas 
}: FullContentProps) => {
  return (
    <div className="space-y-2">
      {recommendations && recommendations.length > 0 && (
        <MediaSection 
          title="Recomendados para Você" 
          medias={recommendations} 
          viewAllPath="/recommendations"
          mediaType="mixed"
        />
      )}
      
      <MediaSection 
        title="Filmes Populares" 
        medias={movies || []} 
        viewAllPath="/filmes"
        mediaType="movie"
      />
      
      <MediaSection 
        title="Séries Populares" 
        medias={series || []} 
        viewAllPath="/series"
        mediaType="tv"
      />
      
      <MediaSection 
        title="Anime em Alta" 
        medias={anime || []} 
        viewAllPath="/animes"
        mediaType="anime"
      />
      
      {/* Premium content */}
      {topRatedAnime && (
        <MediaSection 
          title="Animes Melhor Avaliados" 
          medias={topRatedAnime} 
          viewAllPath="/animes?sort=top-rated"
          mediaType="anime"
        />
      )}
      
      {/* Doramas section */}
      {doramas && doramas.length > 0 && (
        <MediaSection 
          title="Doramas" 
          medias={doramas} 
          viewAllPath="/doramas"
          mediaType="dorama"
        />
      )}
    </div>
  );
};

export default FullContent;
