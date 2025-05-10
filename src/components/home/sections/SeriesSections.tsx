
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface SeriesSectionsProps {
  series: MediaItem[];
  popularSeries?: MediaItem[];
  awardWinningSeries?: MediaItem[];
  documentarySeries?: MediaItem[];
  crimeSeries?: MediaItem[];
  mysterySeries?: MediaItem[];
  realitySeries?: MediaItem[];
  talkShows?: MediaItem[];
  netflixOriginals?: MediaItem[];
  primeOriginals?: MediaItem[];
  hboOriginals?: MediaItem[];
  disneyOriginals?: MediaItem[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const SeriesSections = ({
  series,
  popularSeries = [],
  awardWinningSeries = [],
  documentarySeries = [],
  crimeSeries = [],
  mysterySeries = [],
  realitySeries = [],
  talkShows = [],
  netflixOriginals = [],
  primeOriginals = [],
  hboOriginals = [],
  disneyOriginals = [],
  onLoadMore = () => {},
  isLoading = false,
  hasMore = false
}: SeriesSectionsProps) => {
  // Função padrão para sessões sem paginação real
  const noop = () => {};
  
  // Funções específicas para cada seção
  const handleLoadMoreSeries = () => {
    onLoadMore();
    console.log("Carregando mais séries gerais");
  };
  
  const handleLoadMorePopularSeries = () => {
    onLoadMore();
    console.log("Carregando mais séries populares");
  };
  
  const handleLoadMoreNetflixOriginals = () => {
    onLoadMore();
    console.log("Carregando mais Netflix Originals");
  };
  
  const handleLoadMorePrimeOriginals = () => {
    onLoadMore();
    console.log("Carregando mais Prime Originals");
  };
  
  const handleLoadMoreHboOriginals = () => {
    onLoadMore();
    console.log("Carregando mais HBO Originals");
  };
  
  const handleLoadMoreDisneyOriginals = () => {
    onLoadMore();
    console.log("Carregando mais Disney+ Originals");
  };
  
  return (
    <div className="series-sections-container">
      {/* Main series sections */}
      {popularSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Populares" 
          medias={popularSeries}
          sectionId="popularSeries"
          onLoadMore={handleLoadMorePopularSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      <MediaSectionLoader 
        title="Séries e Programas de TV" 
        medias={series}
        sectionId="series"
        onLoadMore={handleLoadMoreSeries}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Streaming platform originals */}
      {netflixOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Netflix Originals" 
          medias={netflixOriginals}
          sectionId="netflixOriginals"
          onLoadMore={handleLoadMoreNetflixOriginals}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {primeOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Amazon Prime Originals" 
          medias={primeOriginals}
          sectionId="primeOriginals"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {hboOriginals.length > 0 && (
        <MediaSectionLoader 
          title="HBO Max Originals" 
          medias={hboOriginals}
          sectionId="hboOriginals"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {disneyOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Disney+ Originals" 
          medias={disneyOriginals}
          sectionId="disneyOriginals"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {/* Additional series sections */}
      {awardWinningSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Premiadas" 
          medias={awardWinningSeries}
          sectionId="awardWinningSeries"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {documentarySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Documentais" 
          medias={documentarySeries}
          sectionId="documentarySeries"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {crimeSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Crime" 
          medias={crimeSeries}
          sectionId="crimeSeries"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {mysterySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Mistério" 
          medias={mysterySeries}
          sectionId="mysterySeries"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {realitySeries.length > 0 && (
        <MediaSectionLoader 
          title="Reality Shows" 
          medias={realitySeries}
          sectionId="realitySeries"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
      
      {talkShows.length > 0 && (
        <MediaSectionLoader 
          title="Talk Shows" 
          medias={talkShows}
          sectionId="talkShows"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default SeriesSections;
