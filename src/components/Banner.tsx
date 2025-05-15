import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface BannerProps {
  media?: MediaItem;
}

const Banner = ({ media }: BannerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (media) {
      // Adiciona um pequeno delay para evitar flickering
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [media]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-[450px] md:h-[650px] lg:h-[750px] bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 animate-pulse bg-gray-800/20"></div>
        <div className="relative h-full container max-w-full px-6 flex flex-col justify-end pb-20 md:pb-32">
          <div className="h-12 md:h-16 w-3/4 md:w-1/2 bg-gray-700/50 rounded animate-pulse mb-4"></div>
          <div className="h-24 md:h-32 w-full md:w-3/4 bg-gray-700/30 rounded animate-pulse mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-32 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-700/30 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="relative h-[450px] md:h-[650px] lg:h-[750px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl text-white font-bold mb-4 drop-shadow-lg">Nenhuma recomendação disponível</h2>
          <p className="text-white/80 text-base md:text-lg">Adicione filmes ou séries aos favoritos para receber recomendações personalizadas aqui!</p>
        </div>
      </div>
    );
  }

  const title = "title" in media ? media.title : media.name;
  const mediaType = media.media_type;
  const detailsPath = `/${mediaType === "movie" ? "filme" : "serie"}/${media.id}`;

  return (
    <div className="relative h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden">
      {media.backdrop_path ? (
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={title}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/50 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      )}

      <div className="relative h-full container max-w-full px-6 flex flex-col justify-end pb-16 md:pb-32">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-white/90 mb-8 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-4 drop-shadow-md">
            {media.overview || "Nenhuma descrição disponível."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg"
              variant="default" 
              className="bg-white text-black hover:bg-white/90 transition-all duration-300 text-base md:text-lg"
            >
              <Link to={detailsPath} className="flex items-center justify-center">
                <Play className="mr-2" size={24} />
                Assistir
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 text-base md:text-lg"
            >
              <Link to={detailsPath} className="flex items-center justify-center">
                <Info className="mr-2" size={24} />
                Mais Informações
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
