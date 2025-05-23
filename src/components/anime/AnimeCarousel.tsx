
import React, { useState, useEffect } from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimeCarouselProps {
  animes: MediaItem[];
  onAnimeClick: (anime: MediaItem) => void;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({
  animes,
  onAnimeClick,
  className = "",
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  
  // Safety check for valid animes
  const validAnimes = Array.isArray(animes) ? animes.filter(anime => 
    anime && anime.backdrop_path
  ) : [];
  
  // If no valid animes, don't render the carousel
  if (validAnimes.length === 0) {
    return null;
  }
  
  // Get current anime
  const currentAnime = validAnimes[currentIndex];

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validAnimes.length - 1 : prev - 1));
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validAnimes.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };
  
  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === validAnimes.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, validAnimes.length, autoPlayInterval]);
  
  // Resume auto-play after 10 seconds of inactivity
  useEffect(() => {
    if (!autoPlay) return;
    
    const timeout = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [currentIndex, autoPlay]);

  return (
    <div className={`relative w-full h-[60vh] mb-12 overflow-hidden rounded-xl ${className}`}>
      {/* Background image with zoom effect */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 transform scale-105">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
        <img
          src={`https://image.tmdb.org/t/p/original${currentAnime.backdrop_path}`}
          alt={getMediaTitle(currentAnime)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
        aria-label="Previous"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
        aria-label="Next"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {validAnimes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-netflix-red w-6" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col justify-end h-full">
        <div className="animate-fade-in" key={currentAnime.id}>
          <div className="bg-gradient-to-r from-netflix-red to-netflix-red/40 inline-block px-3 py-1 rounded text-white text-xs mb-4">
            Anime
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {getMediaTitle(currentAnime)}
          </h2>
          <div className="flex items-center mb-4 space-x-2">
            <span className="text-yellow-400 flex items-center">
              <Star size={16} className="mr-1" />
              {currentAnime.vote_average?.toFixed(1)}
            </span>
            <span className="text-gray-300 text-sm">
              {new Date(currentAnime.first_air_date || currentAnime.release_date || '').getFullYear()}
            </span>
          </div>
          <p className="text-white/80 max-w-2xl line-clamp-3 mb-6">
            {currentAnime.overview}
          </p>
          <Button
            onClick={() => onAnimeClick(currentAnime)}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white rounded py-3 px-6 w-full sm:w-auto font-medium transition flex items-center justify-center"
          >
            <Play size={18} className="mr-2" /> Assistir agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCarousel;
