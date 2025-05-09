
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface BannerProps {
  media?: MediaItem;
}

const Banner = ({ media }: BannerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (media) {
      setIsLoading(false);
    }
  }, [media]);

  if (isLoading || !media) {
    return (
      <div className="h-[550px] md:h-[650px] bg-gradient-to-b from-gray-900 to-black animate-pulse"></div>
    );
  }

  const title = "title" in media ? media.title : media.name;
  const mediaType = media.media_type;
  const detailsPath = `/${mediaType === "movie" ? "filme" : "serie"}/${media.id}`;

  return (
    <div className="relative h-[550px] md:h-[650px]">
      {media.backdrop_path ? (
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/5 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      )}

      <div className="relative h-full container max-w-full px-6 flex flex-col justify-end pb-20 md:pb-32">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-md md:max-w-2xl">
          {title}
        </h1>
        <p className="text-white/80 mb-6 max-w-md md:max-w-2xl line-clamp-3">
          {media.overview || "Nenhuma descrição disponível."}
        </p>
        <div className="flex space-x-4">
          <Button 
            asChild
            variant="default" 
            className="bg-white text-black hover:bg-white/90"
          >
            <Link to={detailsPath}>
              <Play className="mr-2" size={20} />
              Assistir
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-white border-white/30 bg-white/10 hover:bg-white/20"
          >
            <Link to={detailsPath}>
              Mais Informações
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
