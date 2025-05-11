
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
}

const DoramaSections = ({
  doramas,
  topRatedDoramas,
  popularDoramas,
  koreanMovies,
  onMediaClick,
  onLoadMore,
  isLoading = false,
  hasMore = false
}: DoramaSectionsProps) => {
  // Handler functions for each section
  const handleLoadFeatured = () => {
    if (onLoadMore) onLoadMore("featured-doramas");
  };
  
  const handleLoadKorean = () => {
    if (onLoadMore) onLoadMore("korean-doramas");
  };
  
  const handleLoadPopular = () => {
    if (onLoadMore) onLoadMore("popular-doramas");
  };
  
  const handleLoadMovies = () => {
    if (onLoadMore) onLoadMore("korean-movies");
  };
  
  return (
    <div className="space-y-8">
      <MediaSectionLoader
        title="Doramas em Destaque"
        medias={doramas}
        sectionId="featured-doramas"
        onLoadMore={handleLoadFeatured}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />

      <MediaSectionLoader
        title="Doramas Coreanos"
        medias={topRatedDoramas}
        sectionId="korean-doramas"
        onLoadMore={handleLoadKorean}
        isLoading={isLoading}
        hasMore={hasMore}
        onMediaClick={onMediaClick}
      />
      
      {popularDoramas.length > 0 && (
        <MediaSectionLoader
          title="Doramas Populares"
          medias={popularDoramas}
          sectionId="popular-doramas"
          onLoadMore={handleLoadPopular}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
      
      {koreanMovies.length > 0 && (
        <MediaSectionLoader
          title="Filmes Coreanos"
          medias={koreanMovies}
          sectionId="korean-movies"
          onLoadMore={handleLoadMovies}
          isLoading={isLoading}
          hasMore={hasMore}
          onMediaClick={onMediaClick}
        />
      )}
    </div>
  );
};

export default DoramaSections;
