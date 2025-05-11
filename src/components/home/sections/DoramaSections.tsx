
import { MediaItem, isSeries } from "@/types/movie";
import MediaSectionLoader from "../MediaSectionLoader";

interface DoramaSectionsProps {
  doramas: MediaItem[];
  topRatedDoramas: MediaItem[];
  popularDoramas: MediaItem[];
  koreanMovies: MediaItem[];
  onMediaClick?: (media: MediaItem) => void;
}

const DoramaSections = ({
  doramas,
  topRatedDoramas,
  popularDoramas,
  koreanMovies,
  onMediaClick
}: DoramaSectionsProps) => {
  return (
    <div className="space-y-8">
      <MediaSectionLoader
        title="Doramas em Destaque"
        medias={doramas}
        sectionId="featured"
        onLoadMore={() => {}}
        isLoading={false}
        hasMore={false}
        onMediaClick={onMediaClick}
      />

      <MediaSectionLoader
        title="Doramas Coreanos"
        medias={topRatedDoramas}
        sectionId="korean"
        onLoadMore={() => {}}
        isLoading={false}
        hasMore={false}
        onMediaClick={onMediaClick}
      />

     
    </div>
  );
};

export default DoramaSections;
