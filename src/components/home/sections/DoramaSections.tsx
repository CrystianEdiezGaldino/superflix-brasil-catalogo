
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

export interface DoramaSectionsProps {
  doramas: MediaItem[];
  topRatedDoramas: MediaItem[];
  popularDoramas: MediaItem[];
  koreanMovies: MediaItem[];
  romanceDoramas?: MediaItem[];
  onMediaClick?: (media: MediaItem) => void;
  onLoadMore: (sectionId: string) => void;
  isLoading: boolean;
  hasMore: boolean;
}

const DoramaSections = ({
  doramas,
  topRatedDoramas,
  popularDoramas,
  koreanMovies,
  romanceDoramas = [], // Add default value for optional prop
  onMediaClick,
  onLoadMore,
  isLoading,
  hasMore
}: DoramaSectionsProps) => {
  if (!doramas.length && 
      !topRatedDoramas.length && 
      !popularDoramas.length && 
      !koreanMovies.length) {
    return null;
  }

  return (
    <div className="space-y-8 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Doramas</h2>

      {doramas.length > 0 && (
        <MediaSection
          title="Doramas em Alta"
          medias={doramas}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('doramas')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="doramas"
          mediaType="dorama"
          sectionIndex={0}
        />
      )}

      {topRatedDoramas.length > 0 && (
        <MediaSection
          title="Doramas Mais Bem Avaliados"
          medias={topRatedDoramas}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('topRatedDoramas')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="topRatedDoramas"
          mediaType="dorama"
          sectionIndex={1}
        />
      )}

      {popularDoramas.length > 0 && (
        <MediaSection
          title="Doramas Populares"
          medias={popularDoramas}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('popularDoramas')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="popularDoramas"
          mediaType="dorama"
          sectionIndex={2}
        />
      )}

      {romanceDoramas && romanceDoramas.length > 0 && (
        <MediaSection
          title="Doramas Românticos"
          medias={romanceDoramas}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('romanceDoramas')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="romanceDoramas"
          mediaType="dorama"
          sectionIndex={3}
        />
      )}

      {koreanMovies.length > 0 && (
        <MediaSection
          title="Filmes Coreanos"
          medias={koreanMovies}
          showLoadMore={hasMore}
          onLoadMore={() => onLoadMore('koreanMovies')}
          isLoading={isLoading}
          onMediaClick={onMediaClick}
          sectionId="koreanMovies"
          mediaType="movie"
          sectionIndex={4}
        />
      )}
    </div>
  );
};

export default DoramaSections;
