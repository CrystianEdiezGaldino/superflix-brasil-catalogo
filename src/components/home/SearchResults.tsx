
import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/media/MediaCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchResultsProps {
  results: MediaItem[];
  isSearching?: boolean;
  loadMoreResults?: () => void;
  hasMore?: boolean;
  focusedItem?: number;
  onMediaClick?: (media: MediaItem) => void;
  query?: string;
  onMovieClick?: (movie: MediaItem) => void;
  onSeriesClick?: (series: MediaItem) => void;
  onAnimeClick?: (anime: MediaItem) => void;
}

const SearchResults = ({ 
  results, 
  isSearching = false, 
  loadMoreResults, 
  hasMore = false, 
  focusedItem = 0,
  onMediaClick,
  query = "",
  onMovieClick,
  onSeriesClick,
  onAnimeClick
}: SearchResultsProps) => {
  const [focusedIndex, setFocusedIndex] = useState(focusedItem);

  if (isSearching) {
    return (
      <div className="flex justify-center items-center min-h-[300px] w-full">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-sm">Pesquisando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const handleClick = (media: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(media);
    } else if (media.media_type === 'movie' && onMovieClick) {
      onMovieClick(media);
    } else if (media.media_type === 'tv' && onSeriesClick) {
      onSeriesClick(media);
    } else if ((media.media_type === 'tv' && media.original_language === 'ja') && onAnimeClick) {
      onAnimeClick(media);
    }
  };

  return (
    <Card className="bg-black/60 border-netflix-red/20 backdrop-blur-sm p-6 mt-4 mb-8 mx-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6 border-b border-netflix-red/30 pb-2">
        Resultados da Pesquisa {query ? `para "${query}"` : ''}
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {results.map((media, index) => (
          <div 
            key={`${media.media_type}-${media.id}`} 
            className={`animate-fade-in transition-transform duration-200 ${
              index === focusedIndex ? 'scale-105 ring-2 ring-netflix-red' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MediaCard 
              media={media} 
              onClick={() => handleClick(media)} 
              index={index}
              isFocused={index === focusedIndex}
              onFocus={setFocusedIndex}
            />
          </div>
        ))}
      </div>
      
      {hasMore && loadMoreResults && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMoreResults}
            className="bg-netflix-red hover:bg-red-700 text-white"
          >
            Carregar Mais
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SearchResults;
