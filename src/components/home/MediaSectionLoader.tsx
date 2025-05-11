
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface MediaSectionLoaderProps {
  title: string;
  medias: MediaItem[];
  sectionId: string;
  onLoadMore: (sectionId: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onMediaClick?: (media: MediaItem) => void;
}

const MediaSectionLoader = ({ 
  title, 
  medias, 
  sectionId, 
  onLoadMore,
  isLoading,
  hasMore,
  onMediaClick
}: MediaSectionLoaderProps) => {
  // Filtrar apenas conteúdos com imagem
  const filteredMedias = medias.filter(media => media.poster_path || media.backdrop_path);

  // Não renderizar se não houver conteúdo
  if (!filteredMedias.length) {
    return null;
  }

  // Function to handle loading more for this specific section
  const handleSectionLoadMore = () => {
    console.log(`Loading more for section: ${sectionId}`);
    onLoadMore(sectionId);
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
    />
  );
};

export default MediaSectionLoader;
