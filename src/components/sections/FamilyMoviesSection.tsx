
import React from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MediaCard from "@/components/media/MediaCard";

interface FamilyMoviesSectionProps {
  title: string;
  movies: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const FamilyMoviesSection: React.FC<FamilyMoviesSectionProps> = ({ 
  title, 
  movies, 
  onMediaClick 
}) => {
  // Filter only family-friendly content
  const familyMovies = movies.filter(movie => {
    // Check if movie has family-friendly genre IDs (10751 is family, 16 is animation)
    const familyGenres = [10751, 16, 35, 12];
    return movie.genre_ids?.some(id => familyGenres.includes(id));
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {familyMovies.slice(0, 100).map((movie, index) => (
          <div 
            key={`family-${movie.id}-${index}`}
            className="cursor-pointer"
            onClick={() => onMediaClick(movie)}
          >
            <MediaCard media={movie} index={index} isFocused={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyMoviesSection;
