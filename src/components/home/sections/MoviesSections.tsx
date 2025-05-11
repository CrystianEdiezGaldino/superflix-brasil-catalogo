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
  onLoadMore: (sectionId: string) => void; // Modified to accept sectionId
  onMediaClick?: (media: MediaItem) => void; // Add onMediaClick prop
  isLoading: boolean;
  hasMore: boolean;
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
  trendingMovies = [],
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: MoviesSectionsProps) => {
  // Funções específicas para cada seção
  const handleLoadMoreMovies = () => {
    onLoadMore("movies");
    console.log("Carregando mais filmes populares");
  };
  
  const handleLoadMoreAction = () => {
    onLoadMore("actionMovies");
    console.log("Carregando mais filmes de ação");
  };
  
  const handleLoadMoreComedy = () => {
    onLoadMore("comedyMovies");
    console.log("Carregando mais comédias");
  };
  
  const handleLoadMoreAdventure = () => {
    onLoadMore("adventureMovies");
    console.log("Carregando mais filmes de aventura");
  };
  
  const handleLoadMoreSciFi = () => {
    onLoadMore("sciFiMovies");
    console.log("Carregando mais filmes de ficção científica");
  };
  
  const handleLoadMoreMarvel = () => {
    onLoadMore("marvelMovies");
    console.log("Carregando mais filmes da Marvel");
  };
  
  const handleLoadMoreDC = () => {
    onLoadMore("dcMovies");
    console.log("Carregando mais filmes da DC");
  };
  
  // Additional handlers for optional sections
  const handleLoadMoreHorror = () => {
    onLoadMore("horrorMovies");
    console.log("Carregando mais filmes de terror");
  };
  
  const handleLoadMoreRomance = () => {
    onLoadMore("romanceMovies");
    console.log("Carregando mais filmes de romance");
  };
  
  const handleLoadMoreDrama = () => {
    onLoadMore("dramaMovies");
    console.log("Carregando mais filmes de drama");
  };
  
  const handleLoadMoreThriller = () => {
    onLoadMore("thrillerMovies");
    console.log("Carregando mais filmes de suspense");
  };
  
  const handleLoadMoreFamily = () => {
    onLoadMore("familyMovies");
    console.log("Carregando mais filmes para família");
  };
  
  const handleLoadMoreAnimation = () => {
    onLoadMore("animationMovies");
    console.log("Carregando mais filmes de animação");
  };
  
  const handleLoadMoreDocumentary = () => {
    onLoadMore("documentaryMovies");
    console.log("Carregando mais documentários");
  };
  
  const handleLoadMoreAwardWinning = () => {
    onLoadMore("awardWinningMovies");
    console.log("Carregando mais filmes premiados");
  };
  
  return (
    <>
      {/* Main movie sections */}
      <MediaSectionLoader 
        title="Filmes Populares" 
        medias={movies}
        sectionId="movies"
        onLoadMore={handleLoadMoreMovies}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Genre-specific movie sections */}
      <MediaSectionLoader 
        title="Filmes de Ação" 
        medias={actionMovies}
        sectionId="actionMovies"
        onLoadMore={handleLoadMoreAction}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="Comédias" 
        medias={comedyMovies}
        sectionId="comedyMovies"
        onLoadMore={handleLoadMoreComedy}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="Filmes de Aventura" 
        medias={adventureMovies}
        sectionId="adventureMovies"
        onLoadMore={handleLoadMoreAdventure}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="Ficção Científica" 
        medias={sciFiMovies}
        sectionId="sciFiMovies"
        onLoadMore={handleLoadMoreSciFi}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Franchise-specific movie sections */}
      <MediaSectionLoader 
        title="Universo Marvel" 
        medias={marvelMovies}
        sectionId="marvelMovies"
        onLoadMore={handleLoadMoreMarvel}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="DC Comics" 
        medias={dcMovies}
        sectionId="dcMovies"
        onLoadMore={handleLoadMoreDC}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />

      {/* Additional movie sections */}
      {horrorMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Terror" 
          medias={horrorMovies}
          sectionId="horrorMovies"
          onLoadMore={handleLoadMoreHorror}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {romanceMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Romance" 
          medias={romanceMovies}
          sectionId="romanceMovies"
          onLoadMore={handleLoadMoreRomance}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {dramaMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Drama" 
          medias={dramaMovies}
          sectionId="dramaMovies"
          onLoadMore={handleLoadMoreDrama}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {thrillerMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Suspense" 
          medias={thrillerMovies}
          sectionId="thrillerMovies"
          onLoadMore={handleLoadMoreThriller}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {familyMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes para a Família" 
          medias={familyMovies}
          sectionId="familyMovies"
          onLoadMore={handleLoadMoreFamily}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {animationMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Animação" 
          medias={animationMovies}
          sectionId="animationMovies"
          onLoadMore={handleLoadMoreAnimation}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {documentaryMovies.length > 0 && (
        <MediaSectionLoader 
          title="Documentários" 
          medias={documentaryMovies}
          sectionId="documentaryMovies"
          onLoadMore={handleLoadMoreDocumentary}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {awardWinningMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes Premiados" 
          medias={awardWinningMovies}
          sectionId="awardWinningMovies"
          onLoadMore={handleLoadMoreAwardWinning}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </>
  );
};

export default MoviesSections;
