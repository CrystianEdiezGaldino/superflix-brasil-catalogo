
import { Plus } from 'lucide-react';
import { MediaItem, isMovie, isSeries } from '@/types/movie';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  const handleLoadMore = () => {
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

      <Carousel
        opts={{ 
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {medias.map((media) => (
            <CarouselItem key={`${media.id}-${media.media_type}`} className="pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <div 
                onClick={() => handleClick(media)}
                className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <AspectRatio ratio={2/3}>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
                    alt={isMovie(media) ? media.title : isSeries(media) ? media.name : ''}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-sm font-medium text-white truncate">
                      {isMovie(media) ? media.title : isSeries(media) ? media.name : ''}
                    </h3>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
          
          {/* Load more button */}
          {shouldShowLoadMore && (
            <CarouselItem className="pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
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
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute -left-12 bg-gray-800/80 hover:bg-gray-700 text-white border-none" />
        <CarouselNext className="hidden md:flex absolute -right-12 bg-gray-800/80 hover:bg-gray-700 text-white border-none" />
      </Carousel>
    </div>
  );
};

export default MediaSection;
