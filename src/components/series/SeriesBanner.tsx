import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Series } from "@/types/movie";

interface SeriesBannerProps {
  series: Series;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SeriesBanner = ({ series, isFavorite = false, onToggleFavorite }: SeriesBannerProps) => {
  const hasBanner = !!series.backdrop_path;

  return (
    <div className="relative h-[50vh] md:h-[70vh]">
      <div className="absolute inset-0">
        {hasBanner ? (
          <img
            src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
            alt={series.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-netflix-red/20 to-netflix-background flex items-center justify-center">
            <div className="text-center p-8">
              <Bell className="w-16 h-16 text-netflix-red mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Em Breve</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Esta série está em lançamento e será disponibilizada em breve. 
                Adicione aos favoritos para receber uma notificação quando estiver disponível!
              </p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
              <ArrowLeft className="text-white" />
            </Button>
          </Link>
          
          {onToggleFavorite && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isFavorite ? 'bg-netflix-red' : 'bg-black/50 hover:bg-black/70'}`}
              onClick={onToggleFavorite}
            >
              <Heart className={`${isFavorite ? 'text-white fill-current' : 'text-white'}`} />
            </Button>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{series.name}</h1>
        {series.first_air_date && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{new Date(series.first_air_date).getFullYear()}</span>
            {series.number_of_seasons && (
              <span>• {series.number_of_seasons} {series.number_of_seasons > 1 ? "Temporadas" : "Temporada"}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesBanner;
