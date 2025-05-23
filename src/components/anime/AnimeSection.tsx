
import React from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import MediaCard from "@/components/media/MediaCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeSectionProps {
  title: string;
  animes: MediaItem[];
  icon?: React.ReactNode;
  onMediaClick: (anime: MediaItem) => void;
  isLoading?: boolean;
}

const AnimeSection: React.FC<AnimeSectionProps> = ({ 
  title, 
  animes, 
  icon,
  onMediaClick, 
  isLoading = false 
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
        
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-[180px] md:w-[200px] animate-pulse">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4 mt-2" />
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
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {validAnimes.map((anime, index) => (
            <CarouselItem key={`${anime.id}-${index}`} className="pl-4 md:basis-1/3 lg:basis-1/6">
              <div className="relative group overflow-hidden rounded-lg">
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
                  <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                    <span className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={12} />
                      {anime.vote_average.toFixed(1)}
                    </span>
                    <span>{new Date(anime.first_air_date || anime.release_date || "").getFullYear()}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                    onClick={() => onMediaClick(anime)}
                  >
                    <Play size={14} className="mr-1" /> Assistir
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80" />
        <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80" />
      </Carousel>
    </section>
  );
};

export default AnimeSection;
