
import { useState, useEffect } from "react";
import { MediaItem, getMediaTitle, isSeries } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface AnimeCarouselProps {
  animes: MediaItem[] | null;
  onAnimeClick: (anime: MediaItem) => void;
}

const AnimeCarousel = ({ animes = null, onAnimeClick }: AnimeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Ensure animes is an array
  const animesArray = Array.isArray(animes) ? animes.filter(Boolean) : [];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && animesArray.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animesArray.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, animesArray.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % animesArray.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + animesArray.length) % animesArray.length);
  };

  const handleIndicatorClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (!animesArray.length) return null;

  const currentAnime = animesArray[currentIndex];
  if (!currentAnime) return null;
  
  const title = getMediaTitle(currentAnime);
  
  // Safely get release date using type guards
  const releaseYear = isSeries(currentAnime) 
    ? currentAnime.first_air_date?.split('-')[0] 
    : currentAnime.release_date?.split('-')[0];

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl">
      <div 
        className="w-full h-[50vh] md:h-[60vh] bg-center bg-cover relative"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${currentAnime.backdrop_path})` 
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
          <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
            <span>{releaseYear || 'N/A'}</span>
            <span>⭐ {currentAnime.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <p className="text-white/90 mb-6 line-clamp-3 md:line-clamp-4 max-w-2xl">
            {currentAnime.overview || 'Descrição não disponível.'}
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => onAnimeClick(currentAnime)} 
              className="flex items-center gap-2 bg-netflix-red hover:bg-red-700"
            >
              <Play className="w-4 h-4" />
              Assistir
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-black/30"
              onClick={() => onAnimeClick(currentAnime)}
            >
              Mais Informações
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {animesArray.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {animesArray.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeCarousel;
