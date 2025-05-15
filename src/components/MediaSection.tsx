import { Plus } from 'lucide-react';
import { MediaItem, getMediaTitle } from '@/types/movie';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import MediaCard from "./MediaCard";

type MediaSectionProps = {
  title: string;
  medias?: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  onMediaClick?: (media: MediaItem) => void;
  sectionId?: string;
};

const MediaSection = ({ 
  title, 
  medias = [], 
  showLoadMore = false, 
  onLoadMore, 
  isLoading = false,
  onMediaClick,
  sectionId = 'default'
}: MediaSectionProps) => {
  // Only show load more for sections with showLoadMore flag
  const shouldShowLoadMore = showLoadMore && onLoadMore;
  
  // Function to handle click on "Load More" button
  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onLoadMore) {
      console.log(`Loading more items for section: ${sectionId}`);
      onLoadMore();
    }
  };

  const handleClick = (media: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(media);
    }
  };

  // Skip rendering if no media items
  if (medias.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 py-4" id={`media-section-${sectionId}`} data-section-id={sectionId}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {medias.map((media) => (
          <MediaCard
            key={media.id}
            media={media}
            onClick={() => handleClick(media)}
          />
        ))}
      </div>

      {/* Load more button */}
      {shouldShowLoadMore && (
        <div className="flex items-center justify-center mt-4">
          <div 
            onClick={handleLoadMore}
            className="relative overflow-hidden rounded-lg h-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center cursor-pointer"
            style={{ aspectRatio: '2/3' }}
            data-section-id={sectionId}
          >
            <div className="flex flex-col items-center space-y-2">
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-8 h-8 text-white" />
              )}
              <span className="text-sm text-white">{isLoading ? "Carregando..." : "Ver mais"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
