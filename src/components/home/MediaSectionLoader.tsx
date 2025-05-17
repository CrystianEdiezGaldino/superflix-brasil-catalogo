import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface MediaSectionLoaderProps {
  title: string;
  medias?: MediaItem[];
  sectionId: string;
  onLoadMore: (sectionId: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onMediaClick?: (media: MediaItem) => void;
  mediaType?: 'movie' | 'tv' | 'anime' | 'dorama' | 'tv-channel';
}

const MediaSectionLoader = ({ 
  title, 
  medias = [], 
  sectionId, 
  onLoadMore,
  isLoading,
  hasMore,
  onMediaClick,
  mediaType
}: MediaSectionLoaderProps) => {
  // Filter only content with images
  const filteredMedias = (medias || []).filter(media => media?.poster_path || media?.backdrop_path);

  // Don't render if there's no content
  if (!filteredMedias.length) {
    return null;
  }

  // Function to handle loading more for this specific section
  const handleSectionLoadMore = () => {
    if (!mediaType) {
      console.log(`Loading more for section: ${sectionId}`);
      onLoadMore(sectionId);
    }
  };

  return (
    <MediaSection 
      title={title} 
      medias={filteredMedias}
      showLoadMore={hasMore}
      onLoadMore={handleSectionLoadMore}
      isLoading={isLoading}
      onMediaClick={onMediaClick}
      sectionId={sectionId}
      mediaType={mediaType}
    />
  );
};

export default MediaSectionLoader;
