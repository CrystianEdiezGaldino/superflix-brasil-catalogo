import { Series } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Info, Heart } from "lucide-react";

interface DoramaBannerProps {
  dorama: Series;
  onPlay: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const DoramaBanner = ({ dorama, onPlay, isFavorite, toggleFavorite }: DoramaBannerProps) => {
  // Format year from release date
  const releaseYear = dorama.first_air_date 
    ? new Date(dorama.first_air_date).getFullYear() 
    : null;

  // Format rating
  const rating = dorama.vote_average 
    ? Math.round(dorama.vote_average * 10) / 10 
    : null;

  // Format backdrop path
  const backdropUrl = dorama.backdrop_path
    ? `https://image.tmdb.org/t/p/original${dorama.backdrop_path}`
    : null;
    
  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div className="relative h-[70vh] w-full">
        {backdropUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {dorama.name}
        </h1>
        
        <div className="flex items-center space-x-4 text-white/80 mb-4">
          {releaseYear && <span>{releaseYear}</span>}
          {dorama.number_of_seasons && (
            <span>{dorama.number_of_seasons} {dorama.number_of_seasons === 1 ? 'Temporada' : 'Temporadas'}</span>
          )}
          {rating && (
            <span className={`px-2 py-0.5 rounded ${
              rating >= 7 ? 'bg-green-600' : 
              rating >= 5 ? 'bg-yellow-600' : 
              'bg-red-600'
            }`}>
              {rating}
            </span>
          )}
        </div>
        
        {/* Overview - shortened */}
        <p className="text-white/90 mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl">
          {dorama.overview || "Nenhuma sinopse disponível."}
        </p>
        
        {/* Actions */}
        <div className="flex space-x-4">
          <Button 
            onClick={onPlay} 
            size="lg" 
            className="bg-white text-black hover:bg-white/90"
          >
            <Play className="mr-2" size={20} />
            Assistir
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-gray-800/70 text-white border-gray-600 hover:bg-gray-700"
          >
            <Info className="mr-2" size={20} />
            Mais Informações
          </Button>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={toggleFavorite}
            className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition"
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoramaBanner;
