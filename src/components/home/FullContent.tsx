
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface FullContentProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  topRatedAnime?: MediaItem[];
  specificAnimeRecommendations?: MediaItem[];
  recommendations?: MediaItem[];
  doramas?: MediaItem[];
  
  // New genre-specific movie categories
  actionMovies?: MediaItem[];
  comedyMovies?: MediaItem[];
  adventureMovies?: MediaItem[];
  sciFiMovies?: MediaItem[];
  marvelMovies?: MediaItem[];
  dcMovies?: MediaItem[];
}

const FullContent = ({ 
  movies, 
  series, 
  anime, 
  topRatedAnime,
  recommendations,
  doramas,
  
  // New categories
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  marvelMovies,
  dcMovies
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
      
      {/* New universe-specific collections */}
      {marvelMovies && marvelMovies.length > 0 && (
        <MediaSection 
          title="Universo Marvel" 
          medias={marvelMovies} 
          viewAllPath="/filmes?keyword=marvel"
          mediaType="movie"
        />
      )}

      {dcMovies && dcMovies.length > 0 && (
        <MediaSection 
          title="Universo DC" 
          medias={dcMovies} 
          viewAllPath="/filmes?keyword=dc"
          mediaType="movie"
        />
      )}
      
      {/* Movie genres */}
      {actionMovies && actionMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Ação" 
          medias={actionMovies} 
          viewAllPath="/filmes?genre=action"
          mediaType="movie"
        />
      )}

      {adventureMovies && adventureMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Aventura" 
          medias={adventureMovies} 
          viewAllPath="/filmes?genre=adventure"
          mediaType="movie"
        />
      )}

      {comedyMovies && comedyMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Comédia" 
          medias={comedyMovies} 
          viewAllPath="/filmes?genre=comedy"
          mediaType="movie"
        />
      )}

      {sciFiMovies && sciFiMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Ficção Científica" 
          medias={sciFiMovies} 
          viewAllPath="/filmes?genre=sci-fi"
          mediaType="movie"
        />
      )}
      
      {/* Premium content */}
      {topRatedAnime && topRatedAnime.length > 0 && (
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
