import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface MediaSectionLoaderProps {
  title: string;
  medias: MediaItem[];
  sectionId: string;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const MediaSectionLoader = ({ 
  title, 
  medias, 
  sectionId, 
  onLoadMore,
  isLoading,
  hasMore
}: MediaSectionLoaderProps) => {
  // Filtrar apenas conteúdos com imagem
  const filteredMedias = medias.filter(media => media.poster_path || media.backdrop_path);

  // Não renderizar se não houver conteúdo
  if (!filteredMedias.length) {
    return null;
  }

  return (
    <MediaSection 
      title={title} 
      medias={filteredMedias}
      showLoadMore={hasMore}
      onLoadMore={onLoadMore}
      isLoading={isLoading}
    />
  );
};

export default MediaSectionLoader;
