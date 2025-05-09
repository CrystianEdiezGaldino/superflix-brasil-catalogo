
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface FullContentProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recommendations: MediaItem[];
  doramas: MediaItem[];
  actionMovies: MediaItem[];
  comedyMovies: MediaItem[];
  adventureMovies: MediaItem[];
  sciFiMovies: MediaItem[];
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  popularSeries?: MediaItem[];
  recentAnimes?: MediaItem[];
}

const FullContent = ({ 
  movies, 
  series, 
  anime, 
  topRatedAnime, 
  recommendations, 
  doramas,
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  marvelMovies,
  dcMovies,
  popularSeries = [],
  recentAnimes = []
}: FullContentProps) => {
  // Filter out content without images
  const filteredMovies = movies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = series.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnime = anime.filter(item => item.poster_path || item.backdrop_path);
  const filteredTopAnime = topRatedAnime.filter(item => item.poster_path || item.backdrop_path);
  const filteredRecommendations = recommendations.filter(item => item.poster_path || item.backdrop_path);
  const filteredDoramas = doramas.filter(item => item.poster_path || item.backdrop_path);

  // Filter genre-specific content
  const filteredActionMovies = actionMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredComedyMovies = comedyMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredAdventureMovies = adventureMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSciFiMovies = sciFiMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  
  // Filter franchise-specific content
  const filteredMarvelMovies = marvelMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredDcMovies = dcMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  
  // Filter additional content
  const filteredPopularSeries = popularSeries.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredRecentAnimes = recentAnimes.filter(anime => anime.poster_path || anime.backdrop_path);
  
  return (
    <div className="space-y-8 pb-10">
      {filteredRecommendations.length > 0 && (
        <MediaSection 
          title="Recomendados para Você" 
          medias={filteredRecommendations.slice(0, 10)} 
        />
      )}
      
      {filteredMovies.length > 0 && (
        <MediaSection 
          title="Filmes Populares" 
          medias={filteredMovies.slice(0, 10)} 
        />
      )}
      
      {filteredPopularSeries.length > 0 && (
        <MediaSection 
          title="Séries Populares" 
          medias={filteredPopularSeries.slice(0, 10)} 
        />
      )}
      
      {filteredRecentAnimes.length > 0 && (
        <MediaSection 
          title="Anime em Alta" 
          medias={filteredRecentAnimes.slice(0, 10)} 
        />
      )}
      
      {filteredAnime.length > 0 && (
        <MediaSection 
          title="Animes Populares" 
          medias={filteredAnime.slice(0, 10)} 
        />
      )}
      
      {filteredTopAnime.length > 0 && (
        <MediaSection 
          title="Animes Bem Avaliados" 
          medias={filteredTopAnime.slice(0, 10)} 
        />
      )}
      
      {filteredDoramas.length > 0 && (
        <MediaSection 
          title="Doramas Coreanos" 
          medias={filteredDoramas.slice(0, 10)} 
        />
      )}
      
      {filteredSeries.length > 0 && (
        <MediaSection 
          title="Séries e Programas de TV" 
          medias={filteredSeries.slice(0, 10)} 
        />
      )}
      
      {/* Genre-specific movie sections */}
      {filteredActionMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Ação" 
          medias={filteredActionMovies.slice(0, 10)} 
        />
      )}
      
      {filteredComedyMovies.length > 0 && (
        <MediaSection 
          title="Comédias" 
          medias={filteredComedyMovies.slice(0, 10)} 
        />
      )}
      
      {filteredAdventureMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Aventura" 
          medias={filteredAdventureMovies.slice(0, 10)} 
        />
      )}
      
      {filteredSciFiMovies.length > 0 && (
        <MediaSection 
          title="Ficção Científica" 
          medias={filteredSciFiMovies.slice(0, 10)} 
        />
      )}
      
      {/* Franchise-specific movie sections */}
      {filteredMarvelMovies.length > 0 && (
        <MediaSection 
          title="Universo Marvel" 
          medias={filteredMarvelMovies.slice(0, 10)} 
        />
      )}
      
      {filteredDcMovies.length > 0 && (
        <MediaSection 
          title="DC Comics" 
          medias={filteredDcMovies.slice(0, 10)} 
        />
      )}
    </div>
  );
};

export default FullContent;
