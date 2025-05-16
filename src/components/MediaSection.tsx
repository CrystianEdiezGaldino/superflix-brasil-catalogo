import { Plus } from 'lucide-react';
import { MediaItem, getMediaTitle } from '@/types/movie';
import { useNavigate } from 'react-router-dom';
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
  mediaType?: 'movie' | 'tv' | 'anime' | 'dorama' | 'tv-channel';
};

const MediaSection = ({ 
  title, 
  medias = [], 
  showLoadMore = false, 
  onLoadMore, 
  isLoading = false,
  onMediaClick,
  sectionId = 'default',
  mediaType
}: MediaSectionProps) => {
  const navigate = useNavigate();
  
  // Only show load more for sections with showLoadMore flag
  const shouldShowLoadMore = showLoadMore && onLoadMore;
  
  // Function to handle click on "Load More" button
  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaType) {
      // Navegar para a rota correspondente ao tipo de mídia
      switch (mediaType) {
        case 'movie':
          navigate('/filmes');
          break;
        case 'tv':
          navigate('/series');
          break;
        case 'anime':
          navigate('/animes');
          break;
        case 'dorama':
          navigate('/doramas');
          break;
        case 'tv-channel':
          navigate('/tv-channels');
          break;
      }
    } else if (onLoadMore) {
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
        <div className="flex items-center justify-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="group relative overflow-hidden rounded-lg bg-netflix-red hover:bg-red-700 transition-all duration-300 flex items-center justify-center cursor-pointer px-6 py-3 min-w-[200px]"
            data-section-id={sectionId}
          >
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="text-sm font-medium text-white">
                {isLoading ? "Carregando..." : "Ver mais"}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
