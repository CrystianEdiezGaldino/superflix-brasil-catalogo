
import React, { useState, useEffect } from "react";
import { MediaItem, getMediaTitle, isSeries, isAnime } from "@/types/movie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Calendar, 
  Play, 
  Info, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedAnimeCarouselProps {
  animes: MediaItem[];
  onAnimeClick: (anime: MediaItem) => void;
}

const FeaturedAnimeCarousel: React.FC<FeaturedAnimeCarouselProps> = ({ animes, onAnimeClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  // Safety check for animes array
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => 
    anime && anime.backdrop_path && (anime.title || anime.name)
  ) : [];
  
  const featuredAnime = validAnimes[currentIndex];
  
  // Handle automatic sliding
  useEffect(() => {
    if (validAnimes.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex, validAnimes.length]);
  
  // Navigation functions
  const handlePrev = () => {
    if (isTransitioning || validAnimes.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === 0 ? validAnimes.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  const handleNext = () => {
    if (isTransitioning || validAnimes.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === validAnimes.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // If swipe is significant (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go next
        handleNext();
      } else {
        // Swipe right, go previous
        handlePrev();
      }
    }
  };

  // If no animes, show placeholder
  if (!validAnimes.length) {
    return (
      <div className="relative h-[50vh] mb-12 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div 
      className="relative h-[50vh] mb-12 rounded-xl overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {featuredAnime && (
        <>
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${featuredAnime.backdrop_path}`}
              alt={getMediaTitle(featuredAnime)}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2">
            <Badge className="bg-netflix-red text-white mb-4 px-3 py-1">Em Destaque</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {getMediaTitle(featuredAnime)}
            </h1>
            <div className="flex items-center gap-4 text-gray-200 mb-4">
              <span className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                {featuredAnime.vote_average.toFixed(1)}
              </span>
              <span className="flex items-center">
                <Calendar className="text-gray-400 mr-1" size={16} />
                {new Date(featuredAnime.first_air_date || featuredAnime.release_date || "").getFullYear()}
              </span>
              {(isSeries(featuredAnime) || isAnime(featuredAnime)) && featuredAnime.number_of_seasons && (
                <span className="flex items-center">
                  <Sparkles className="text-gray-400 mr-1" size={16} />
                  {featuredAnime.number_of_seasons} {featuredAnime.number_of_seasons > 1 ? 'Temporadas' : 'Temporada'}
                </span>
              )}
            </div>
            <p className="text-gray-200 mb-6 line-clamp-3 text-sm md:text-base">{featuredAnime.overview}</p>
            <div className="flex gap-4">
              <Button 
                onClick={() => onAnimeClick(featuredAnime)}
                className="bg-netflix-red hover:bg-netflix-red/90 text-white px-8 py-2 rounded-lg flex items-center gap-2"
              >
                <Play size={18} /> Assistir Agora
              </Button>
              <Button 
                variant="outline"
                onClick={() => onAnimeClick(featuredAnime)}
                className="border-white/50 text-white hover:bg-white/10 px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Info size={18} /> Mais Detalhes
              </Button>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          {validAnimes.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 p-2"
                onClick={handlePrev}
                disabled={isTransitioning}
              >
                <ChevronLeft size={24} />
                <span className="sr-only">Previous</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 p-2"
                onClick={handleNext}
                disabled={isTransitioning}
              >
                <ChevronRight size={24} />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}
          
          {/* Dots Indicator */}
          {validAnimes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {validAnimes.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-netflix-red" : "w-2 bg-gray-400/60"
                  }`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 500);
                  }}
                ></button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedAnimeCarousel;
