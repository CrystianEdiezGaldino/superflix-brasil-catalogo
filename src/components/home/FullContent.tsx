
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface FullContentProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  topRatedAnime?: MediaItem[];
  specificAnimeRecommendations?: MediaItem[];
  recommendations?: MediaItem[];
}

const FullContent = ({ 
  movies, 
  series, 
  anime, 
  topRatedAnime, 
  specificAnimeRecommendations,
  recommendations 
}: FullContentProps) => {
  return (
    <>
      {recommendations && recommendations.length > 0 && (
        <MediaSection 
          title="Recomendados para Você" 
          medias={recommendations} 
        />
      )}
      
      <MediaSection 
        title="Filmes Populares" 
        medias={movies || []} 
      />
      
      <MediaSection 
        title="Séries Populares" 
        medias={series || []} 
      />
      
      <MediaSection 
        title="Anime em Alta" 
        medias={anime || []} 
      />
      
      {/* Premium content */}
      {topRatedAnime && (
        <MediaSection 
          title="Animes Melhor Avaliados" 
          medias={topRatedAnime} 
        />
      )}
      
      {/* Specific anime recommendations featuring Solo Leveling */}
      {specificAnimeRecommendations && (
        <MediaSection 
          title="Semelhantes a Solo Leveling" 
          medias={specificAnimeRecommendations} 
        />
      )}
    </>
  );
};

export default FullContent;
