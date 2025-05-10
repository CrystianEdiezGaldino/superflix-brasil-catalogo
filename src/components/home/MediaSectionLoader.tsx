
import { useState } from "react";
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";

interface MediaSectionLoaderProps {
  title: string;
  medias: MediaItem[];
  sectionId: string;
  initialLoadCount?: number;
  loadIncrement?: number;
}

const MediaSectionLoader = ({ 
  title, 
  medias, 
  sectionId, 
  initialLoadCount = 60, 
  loadIncrement = 20 
}: MediaSectionLoaderProps) => {
  const [loadedItems, setLoadedItems] = useState<number>(initialLoadCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filter out content without images
  const filteredMedias = medias.filter(media => media.poster_path || media.backdrop_path);
  
  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoadedItems(prev => Math.min(prev + loadIncrement, filteredMedias.length));
      setIsLoading(false);
    }, 800);
  };

  // Don't render empty sections
  if (!filteredMedias.length) {
    return null;
  }

  return (
    <MediaSection 
      title={title} 
      medias={filteredMedias.slice(0, loadedItems)}
      showLoadMore={filteredMedias.length > loadedItems}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
    />
  );
};

export default MediaSectionLoader;
