
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
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
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
  return (
    <div className="space-y-8">
      {/* Main Movie Categories */}
      <PopularMovies
        movies={movies}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Genre-based Categories */}
      <GenreBasedMovies
        actionMovies={actionMovies}
        comedyMovies={comedyMovies}
        adventureMovies={adventureMovies}
        sciFiMovies={sciFiMovies}
        horrorMovies={horrorMovies}
        romanceMovies={romanceMovies}
        dramaMovies={dramaMovies}
        thrillerMovies={thrillerMovies}
        familyMovies={familyMovies}
        animationMovies={animationMovies}
        documentaryMovies={documentaryMovies}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Franchise Movies */}
      <FranchiseMovies
        marvelMovies={marvelMovies}
        dcMovies={dcMovies}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Special Categories */}
      <SpecialCategories
        awardWinningMovies={awardWinningMovies}
        popularMovies={popularMovies}
        trendingMovies={trendingMovies}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
};

// Component for Popular Movies
const PopularMovies = ({ 
  movies, 
  onLoadMore, 
  onMediaClick, 
  isLoading, 
  hasMore 
}: {
  movies: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMore = () => {
    onLoadMore("movies");
  };

  return (
    <MediaSectionLoader 
      title="Filmes Populares" 
      medias={movies}
      sectionId="movies"
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
      showLoadMore={hasMore}
      onMediaClick={onMediaClick}
      mediaType="movie"
    />
  );
};

// Component for Genre-based Movies
const GenreBasedMovies = ({
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  horrorMovies,
  romanceMovies,
  dramaMovies,
  thrillerMovies,
  familyMovies,
  animationMovies,
  documentaryMovies,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  actionMovies: MediaItem[];
  comedyMovies: MediaItem[];
  adventureMovies: MediaItem[];
  sciFiMovies: MediaItem[];
  horrorMovies: MediaItem[];
  romanceMovies: MediaItem[];
  dramaMovies: MediaItem[];
  thrillerMovies: MediaItem[];
  familyMovies: MediaItem[];
  animationMovies: MediaItem[];
  documentaryMovies: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreAction = () => {
    onLoadMore("actionMovies");
  };
  
  const handleLoadMoreComedy = () => {
    onLoadMore("comedyMovies");
  };
  
  const handleLoadMoreAdventure = () => {
    onLoadMore("adventureMovies");
  };
  
  const handleLoadMoreSciFi = () => {
    onLoadMore("sciFiMovies");
  };
  
  const handleLoadMoreHorror = () => {
    onLoadMore("horrorMovies");
  };
  
  const handleLoadMoreRomance = () => {
    onLoadMore("romanceMovies");
  };
  
  const handleLoadMoreDrama = () => {
    onLoadMore("dramaMovies");
  };
  
  const handleLoadMoreThriller = () => {
    onLoadMore("thrillerMovies");
  };
  
  const handleLoadMoreFamily = () => {
    onLoadMore("familyMovies");
  };
  
  const handleLoadMoreAnimation = () => {
    onLoadMore("animationMovies");
  };
  
  const handleLoadMoreDocumentary = () => {
    onLoadMore("documentaryMovies");
  };

  return (
    <>
      <MediaSectionLoader 
        title="Filmes de Ação" 
        medias={actionMovies}
        sectionId="actionMovies"
        onLoadMore={handleLoadMoreAction}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="movie"
      />
      
      <MediaSectionLoader 
        title="Comédias" 
        medias={comedyMovies}
        sectionId="comedyMovies"
        onLoadMore={handleLoadMoreComedy}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="movie"
      />
      
      <MediaSectionLoader 
        title="Filmes de Aventura" 
        medias={adventureMovies}
        sectionId="adventureMovies"
        onLoadMore={handleLoadMoreAdventure}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="movie"
      />
      
      <MediaSectionLoader 
        title="Ficção Científica" 
        medias={sciFiMovies}
        sectionId="sciFiMovies"
        onLoadMore={handleLoadMoreSciFi}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
      />

      {horrorMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes de Terror" 
          medias={horrorMovies}
          sectionId="horrorMovies"
          onLoadMore={handleLoadMoreHorror}
          isLoading={isLoading}
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
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
          showLoadMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </>
  );
};

// Component for Franchise Movies
const FranchiseMovies = ({
  marvelMovies,
  dcMovies,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreMarvel = () => {
    onLoadMore("marvelMovies");
  };
  
  const handleLoadMoreDC = () => {
    onLoadMore("dcMovies");
  };

  return (
    <>
      <MediaSectionLoader 
        title="Universo Marvel" 
        medias={marvelMovies}
        sectionId="marvelMovies"
        onLoadMore={handleLoadMoreMarvel}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="DC Comics" 
        medias={dcMovies}
        sectionId="dcMovies"
        onLoadMore={handleLoadMoreDC}
        isLoading={isLoading}
        showLoadMore={hasMore}
        onMediaClick={onMediaClick}
      />
    </>
  );
};

// Component for Special Categories
const SpecialCategories = ({
  awardWinningMovies,
  popularMovies,
  trendingMovies,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  awardWinningMovies: MediaItem[];
  popularMovies: MediaItem[];
  trendingMovies: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreAwards = () => {
    onLoadMore("awardWinningMovies");
  };
  
  const handleLoadMorePopular = () => {
    onLoadMore("popularMovies");
  };
  
  const handleLoadMoreTrending = () => {
    onLoadMore("trendingMovies");
  };

  return (
    <>
      {awardWinningMovies.length > 0 && (
        <MediaSectionLoader 
          title="Filmes Premiados" 
          medias={awardWinningMovies}
          sectionId="awardWinningMovies"
          onLoadMore={handleLoadMoreAwards}
          isLoading={isLoading}
          showLoadMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {popularMovies.length > 0 && popularMovies !== awardWinningMovies && (
        <MediaSectionLoader 
          title="Mais Populares" 
          medias={popularMovies}
          sectionId="popularMovies"
          onLoadMore={handleLoadMorePopular}
          isLoading={isLoading}
          showLoadMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {trendingMovies.length > 0 && (
        <MediaSectionLoader 
          title="Em Alta" 
          medias={trendingMovies}
          sectionId="trendingMovies"
          onLoadMore={handleLoadMoreTrending}
          isLoading={isLoading}
          showLoadMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </>
  );
};

export default MoviesSections;
