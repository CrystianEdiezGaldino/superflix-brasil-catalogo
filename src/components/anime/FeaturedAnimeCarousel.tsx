
import React, { useState } from "react";
import { MediaItem } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedAnimeCarouselProps {
  animes: MediaItem[];
  onAnimeClick: (anime: MediaItem) => void;
}

const FeaturedAnimeCarousel: React.FC<FeaturedAnimeCarouselProps> = ({
  animes,
  onAnimeClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? animes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === animes.length - 1 ? 0 : prev + 1));
  };

  // Handle empty state
  if (!animes.length) {
    return null;
  }

  const currentAnime = animes[currentIndex];

  return (
    <div className="relative w-full h-[50vh] mb-12 overflow-hidden rounded-xl">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`https://image.tmdb.org/t/p/original${currentAnime.backdrop_path}`}
          alt={currentAnime.title || currentAnime.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {animes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-netflix-red w-4" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col justify-end h-full">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          {currentAnime.title || currentAnime.name}
        </h2>
        <div className="flex items-center mb-4 space-x-2">
          <span className="bg-netflix-red text-white px-2 py-0.5 rounded text-sm">
            Anime
          </span>
          <span className="text-gray-300 text-sm">
            {currentAnime.vote_average} ★
          </span>
        </div>
        <p className="text-white/80 max-w-2xl line-clamp-3 mb-6">
          {currentAnime.overview}
        </p>
        <button
          onClick={() => onAnimeClick(currentAnime)}
          className="bg-netflix-red hover:bg-netflix-red/80 text-white rounded py-3 px-6 w-full sm:w-auto font-medium transition flex items-center justify-center"
        >
          Assistir agora
        </button>
      </div>
    </div>
  );
};

export default FeaturedAnimeCarousel;
