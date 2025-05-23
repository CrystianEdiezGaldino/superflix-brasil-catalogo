
import React, { useState } from "react";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedAnimeCarouselProps {
  animes: MediaItem[];
  onAnimeClick: (anime: MediaItem) => void;
}

const FeaturedAnimeCarousel: React.FC<FeaturedAnimeCarouselProps> = ({
  animes,
  onAnimeClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!animes || animes.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-12 overflow-hidden rounded-xl">
      <Carousel
        className="w-full"
        onSelect={(index) => setActiveIndex(index)}
      >
        <CarouselContent>
          {animes.map((anime, index) => (
            <CarouselItem key={`${anime.id}-${index}`}>
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                <img
                  src={`https://image.tmdb.org/t/p/original${anime.backdrop_path}`}
                  alt={getMediaTitle(anime)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                  <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl">
                    {getMediaTitle(anime)}
                  </h1>
                  <div className="mb-4 flex items-center gap-3">
                    <Badge className="bg-netflix-red px-2 py-1 text-white">
                      {anime.vote_average.toFixed(1)}
                    </Badge>
                    <span className="text-sm text-gray-300">
                      {new Date(anime.first_air_date || anime.release_date || "").getFullYear()}
                    </span>
                    <span className="text-sm text-gray-300">
                      {anime.original_language === "ja" ? "Japonês" : anime.original_language}
                    </span>
                  </div>
                  <p className="mb-6 max-w-2xl text-sm text-gray-300 line-clamp-3 md:text-base">
                    {anime.overview || "Sem descrição disponível."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onAnimeClick(anime)}
                      className="bg-netflix-red hover:bg-netflix-red/90 text-white"
                    >
                      <Play size={18} className="mr-2" /> Assistir
                    </Button>
                    <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30">
                      <Info size={18} className="mr-2" /> Mais Informações
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/80" />
        <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/80" />
      </Carousel>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {animes.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-4 rounded-full transition-all ${
              activeIndex === index ? "bg-netflix-red w-6" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedAnimeCarousel;
