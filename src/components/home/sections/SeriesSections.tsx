
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
  onLoadMore?: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
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
  onMediaClick,
  isLoading = false,
  hasMore = false
}: SeriesSectionsProps) => {
  return (
    <div className="series-sections-container">
      {/* Main Series Categories */}
      <MainSeriesCategories
        series={series}
        popularSeries={popularSeries}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Streaming Platforms */}
      <StreamingPlatformsSeries
        netflixOriginals={netflixOriginals}
        primeOriginals={primeOriginals}
        hboOriginals={hboOriginals}
        disneyOriginals={disneyOriginals}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Special Categories */}
      <SpecialSeriesCategories
        awardWinningSeries={awardWinningSeries}
        documentarySeries={documentarySeries}
        crimeSeries={crimeSeries}
        mysterySeries={mysterySeries}
        realitySeries={realitySeries}
        talkShows={talkShows}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
};

// Component for Main Series Categories
const MainSeriesCategories = ({
  series,
  popularSeries,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  series: MediaItem[];
  popularSeries: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreSeries = () => {
    onLoadMore("series");
  };
  
  const handleLoadMorePopularSeries = () => {
    onLoadMore("popularSeries");
  };

  return (
    <>
      {popularSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Populares" 
          medias={series}
          sectionId="series"
          onLoadMore={handleLoadMoreSeries}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
          mediaType="tv"
        />
      )}
      
      <MediaSectionLoader 
        title="Séries e Programas de TV" 
        medias={series}
        sectionId="series"
        onLoadMore={handleLoadMoreSeries}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="tv"
      />
    </>
  );
};

// Component for Streaming Platform Series
const StreamingPlatformsSeries = ({
  netflixOriginals,
  primeOriginals,
  hboOriginals,
  disneyOriginals,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  netflixOriginals: MediaItem[];
  primeOriginals: MediaItem[];
  hboOriginals: MediaItem[];
  disneyOriginals: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreNetflix = () => {
    onLoadMore("netflixOriginals");
  };
  
  const handleLoadMorePrime = () => {
    onLoadMore("primeOriginals");
  };
  
  const handleLoadMoreHBO = () => {
    onLoadMore("hboOriginals");
  };
  
  const handleLoadMoreDisney = () => {
    onLoadMore("disneyOriginals");
  };

  return (
    <>
      {netflixOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Netflix Originals" 
          medias={netflixOriginals}
          sectionId="netflixOriginals"
          onLoadMore={handleLoadMoreNetflix}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
          mediaType="tv"
        />
      )}
      
      {primeOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Amazon Prime Originals" 
          medias={primeOriginals}
          sectionId="primeOriginals"
          onLoadMore={handleLoadMorePrime}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
          mediaType="tv"
        />
      )}
      
      {hboOriginals.length > 0 && (
        <MediaSectionLoader 
          title="HBO Max Originals" 
          medias={hboOriginals}
          sectionId="hboOriginals"
          onLoadMore={handleLoadMoreHBO}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
          mediaType="tv"
        />
      )}
      
      {disneyOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Disney+ Originals" 
          medias={disneyOriginals}
          sectionId="disneyOriginals"
          onLoadMore={handleLoadMoreDisney}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
          mediaType="tv"
        />
      )}
    </>
  );
};

// Component for Special Series Categories
const SpecialSeriesCategories = ({
  awardWinningSeries,
  documentarySeries,
  crimeSeries,
  mysterySeries,
  realitySeries,
  talkShows,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: {
  awardWinningSeries: MediaItem[];
  documentarySeries: MediaItem[];
  crimeSeries: MediaItem[];
  mysterySeries: MediaItem[];
  realitySeries: MediaItem[];
  talkShows: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}) => {
  const handleLoadMoreAwards = () => {
    onLoadMore("awardWinningSeries");
  };
  
  const handleLoadMoreDocumentary = () => {
    onLoadMore("documentarySeries");
  };
  
  const handleLoadMoreCrime = () => {
    onLoadMore("crimeSeries");
  };
  
  const handleLoadMoreMystery = () => {
    onLoadMore("mysterySeries");
  };
  
  const handleLoadMoreReality = () => {
    onLoadMore("realitySeries");
  };
  
  const handleLoadMoreTalkShows = () => {
    onLoadMore("talkShows");
  };

  return (
    <>
      {awardWinningSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Premiadas" 
          medias={awardWinningSeries}
          sectionId="awardWinningSeries"
          onLoadMore={handleLoadMoreAwards}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {documentarySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Documentais" 
          medias={documentarySeries}
          sectionId="documentarySeries"
          onLoadMore={handleLoadMoreDocumentary}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {crimeSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Crime" 
          medias={crimeSeries}
          sectionId="crimeSeries"
          onLoadMore={handleLoadMoreCrime}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {mysterySeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries de Mistério" 
          medias={mysterySeries}
          sectionId="mysterySeries"
          onLoadMore={handleLoadMoreMystery}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {realitySeries.length > 0 && (
        <MediaSectionLoader 
          title="Reality Shows" 
          medias={realitySeries}
          sectionId="realitySeries"
          onLoadMore={handleLoadMoreReality}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {talkShows.length > 0 && (
        <MediaSectionLoader 
          title="Talk Shows" 
          medias={talkShows}
          sectionId="talkShows"
          onLoadMore={handleLoadMoreTalkShows}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </>
  );
};

export default SeriesSections;
