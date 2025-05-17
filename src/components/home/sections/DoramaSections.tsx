import { MediaItem, isSeries } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface DoramaSectionsProps {
  doramas: MediaItem[];
  topRatedDoramas: MediaItem[];
  popularDoramas: MediaItem[];
  koreanMovies: MediaItem[];
  onMediaClick?: (media: MediaItem) => void;
  onLoadMore?: (sectionId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  romanceDoramas: MediaItem[];
}

const DoramaSections = ({
  doramas,
  topRatedDoramas,
  popularDoramas,
  koreanMovies,
  onMediaClick,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  romanceDoramas
}: DoramaSectionsProps) => {
  return (
    <div className="space-y-8">
      <MediaSectionLoader
        title="Doramas em Destaque"
        medias={doramas}
        sectionId="featured-doramas"
        onLoadMore={onLoadMore || (() => {})}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />

      <MediaSectionLoader
        title="Doramas Coreanos"
        medias={topRatedDoramas}
        sectionId="korean-doramas"
        onLoadMore={onLoadMore || (() => {})}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      <MediaSectionLoader 
        title="Doramas Populares" 
        medias={doramas}
        sectionId="doramas"
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="dorama"
      />

      <MediaSectionLoader 
        title="Doramas de Romance" 
        medias={romanceDoramas}
        sectionId="romanceDoramas"
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
        mediaType="dorama"
      />
      
      {koreanMovies.length > 0 && (
        <MediaSectionLoader
          title="Filmes Coreanos"
          medias={koreanMovies}
          sectionId="korean-movies"
          onLoadMore={onLoadMore || (() => {})}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </div>
  );
};

export default DoramaSections;
