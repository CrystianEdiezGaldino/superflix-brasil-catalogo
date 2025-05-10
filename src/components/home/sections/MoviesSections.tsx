
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface MoviesSectionsProps {
  movies: MediaItem[];
  actionMovies: MediaItem[];
  comedyMovies: MediaItem[];
  adventureMovies: MediaItem[];
  sciFiMovies: MediaItem[];
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  horrorMovies?: MediaItem[];
  romanceMovies?: MediaItem[];
  dramaMovies?: MediaItem[];
  thrillerMovies?: MediaItem[];
  familyMovies?: MediaItem[];
  animationMovies?: MediaItem[];
  documentaryMovies?: MediaItem[];
  awardWinningMovies?: MediaItem[];
  popularMovies?: MediaItem[];
  trendingMovies?: MediaItem[];
}

const MoviesSections = ({
  movies,
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  marvelMovies,
  dcMovies,
  horrorMovies = [],
  romanceMovies = [],
  dramaMovies = [],
  thrillerMovies = [],
  familyMovies = [],
  animationMovies = [],
  documentaryMovies = [],
  awardWinningMovies = [],
  popularMovies = [],
  trendingMovies = []
}: MoviesSectionsProps) => {
  return (
    <>
      {/* Main movie sections */}
      <MediaSectionLoader 
        title="Filmes Populares" 
        medias={movies}
        sectionId="movies"
      />
      
      {/* Genre-specific movie sections */}
      <MediaSectionLoader 
        title="Filmes de Ação" 
        medias={actionMovies}
        sectionId="actionMovies"
      />
      
      <MediaSectionLoader 
        title="Comédias" 
        medias={comedyMovies}
        sectionId="comedyMovies"
      />
      
      <MediaSectionLoader 
        title="Filmes de Aventura" 
        medias={adventureMovies}
        sectionId="adventureMovies"
      />
      
      <MediaSectionLoader 
        title="Ficção Científica" 
        medias={sciFiMovies}
        sectionId="sciFiMovies"
      />
      
      {/* Franchise-specific movie sections */}
      <MediaSectionLoader 
        title="Universo Marvel" 
        medias={marvelMovies}
        sectionId="marvelMovies"
      />
      
      <MediaSectionLoader 
        title="DC Comics" 
        medias={dcMovies}
        sectionId="dcMovies"
      />

      {/* Additional movie sections */}
      {horrorMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Terror" 
          medias={horrorMovies}
          sectionId="horrorMovies"
        />
      )}
      
      {romanceMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Romance" 
          medias={romanceMovies}
          sectionId="romanceMovies"
        />
      )}
      
      {dramaMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Drama" 
          medias={dramaMovies}
          sectionId="dramaMovies"
        />
      )}
      
      {thrillerMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Suspense" 
          medias={thrillerMovies}
          sectionId="thrillerMovies"
        />
      )}
      
      {familyMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes para a Família" 
          medias={familyMovies}
          sectionId="familyMovies"
        />
      )}
      
      {animationMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Animação" 
          medias={animationMovies}
          sectionId="animationMovies"
        />
      )}
      
      {documentaryMovies.length > 0 && (
        <MediaSectionLoader 
          title="Documentários" 
          medias={documentaryMovies}
          sectionId="documentaryMovies"
        />
      )}
      
      {awardWinningMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes Premiados" 
          medias={awardWinningMovies}
          sectionId="awardWinningMovies"
        />
      )}
    </>
  );
};

export default MoviesSections;
