
import React from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeSectionGridProps {
  title: string;
  animes: MediaItem[];
  icon?: React.ReactNode;
  onMediaClick: (anime: MediaItem) => void;
  isLoading?: boolean;
  showRating?: boolean;
  showGenres?: boolean;
}

const AnimeSectionGrid: React.FC<AnimeSectionGridProps> = ({ 
  title, 
  animes, 
  icon,
  onMediaClick, 
  isLoading = false,
  showRating = true,
  showGenres = false
}) => {
  // Safety check for animes array
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => 
    anime && (anime.poster_path || anime.backdrop_path)
  ) : [];
  
  // If no animes and not loading, don't render anything
  if (validAnimes.length === 0 && !isLoading) {
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            {icon}
            {title}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-none animate-pulse">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1 bg-gray-800" />
              <Skeleton className="h-3 w-1/2 bg-gray-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          {icon}
          {title}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {validAnimes.map((anime, index) => (
          <div key={`${anime.id}-${index}`} className="relative group overflow-hidden rounded-lg">
            <MediaCard
              media={anime}
              onClick={() => onMediaClick(anime)}
              index={index}
              isFocused={false}
              onFocus={() => {}}
              className="transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-bold truncate">{getMediaTitle(anime)}</h3>
              
              {showRating && (
                <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                  <span className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={12} />
                    {anime.vote_average?.toFixed(1)}
                  </span>
                  <span>{new Date(anime.first_air_date || anime.release_date || "").getFullYear()}</span>
                </div>
              )}
              
              {showGenres && anime.genres && (
                <div className="my-1 flex flex-wrap gap-1">
                  {anime.genres.slice(0, 2).map(genre => (
                    <span key={genre.id} className="text-xs bg-gray-700 px-1 rounded text-gray-300">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
              
              <Button 
                size="sm" 
                className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                onClick={() => onMediaClick(anime)}
              >
                <Play size={14} className="mr-1" /> Assistir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeSectionGrid;
