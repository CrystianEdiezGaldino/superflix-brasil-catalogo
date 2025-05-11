
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentCalendarItem } from "@/hooks/useContentCalendar";
import { isMovie, isSeries, MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface RecentReleasesProps {
  releases: ContentCalendarItem[];
  isLoading: boolean;
}

const RecentReleases = ({ releases, isLoading }: RecentReleasesProps) => {
  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(20);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Lançamentos Recentes</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!releases || releases.length === 0) {
    return null;
  }

  // Function to handle media click and navigation
  const handleMediaClick = (media: ContentCalendarItem) => {
    if (!media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 20);
  };

  // Sort releases by date (newest first)
  const sortedReleases = [...releases].sort((a, b) => 
    new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );

  // Limit the display
  const displayedReleases = sortedReleases.slice(0, displayLimit);
  const hasMore = displayLimit < sortedReleases.length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white relative">
        Lançamentos Recentes
        <span className="absolute top-0 -right-1 transform translate-x-full bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          Novo
        </span>
      </h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayedReleases.map((media) => (
          <div 
            key={`${media.id}-${media.media_type}-${media.release_date}`} 
            onClick={() => handleMediaClick(media)}
            className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
              alt={isMovie(media as MediaItem) ? media.title : isSeries(media as MediaItem) ? media.name : ''}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h3 className="text-sm font-medium text-white truncate">
                  {isMovie(media as MediaItem) ? media.title : isSeries(media as MediaItem) ? media.name : ''}
                </h3>
                <p className="text-xs text-gray-300">
                  {new Date(media.release_date).toLocaleDateString()}
                </p>
                {media.is_new && (
                  <span className="inline-block px-2 py-1 mt-1 text-xs bg-red-600 text-white rounded-full">
                    Novo
                  </span>
                )}
              </div>
            </div>
            
            {media.is_new && (
              <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-1 text-xs bg-red-600 text-white rounded-full shadow-lg">
                  Novo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            Mostrar Mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentReleases;
