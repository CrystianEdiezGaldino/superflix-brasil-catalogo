
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
  return (
    <>
      {popularSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Populares" 
          medias={popularSeries}
          sectionId="popularSeries"
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      <MediaSectionLoader 
        title="Séries e Programas de TV" 
        medias={series}
        sectionId="series"
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
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
  return (
    <>
      {netflixOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Netflix Originals" 
          medias={netflixOriginals}
          sectionId="netflixOriginals"
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {primeOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Amazon Prime Originals" 
          medias={primeOriginals}
          sectionId="primeOriginals"
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {hboOriginals.length > 0 && (
        <MediaSectionLoader 
          title="HBO Max Originals" 
          medias={hboOriginals}
          sectionId="hboOriginals"
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {disneyOriginals.length > 0 && (
        <MediaSectionLoader 
          title="Disney+ Originals" 
          medias={disneyOriginals}
          sectionId="disneyOriginals"
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
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
  return (
    <>
      {awardWinningSeries.length > 0 && (
        <MediaSectionLoader 
          title="Séries Premiadas" 
          medias={awardWinningSeries}
          sectionId="awardWinningSeries"
          onLoadMore={onLoadMore}
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
          onLoadMore={onLoadMore}
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
          onLoadMore={onLoadMore}
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
          onLoadMore={onLoadMore}
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
          onLoadMore={onLoadMore}
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
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </>
  );
};

export default SeriesSections;
