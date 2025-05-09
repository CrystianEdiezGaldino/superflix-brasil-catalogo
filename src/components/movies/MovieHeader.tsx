
import { Movie } from "@/types/movie";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  movie: Movie;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const MovieHeader = ({ movie, isFavorite, toggleFavorite }: MovieHeaderProps) => {
  const releaseYear = new Date(movie.release_date).getFullYear();
  
  return (
    <div className="relative h-[50vh] md:h-[70vh]">
      <div className="absolute inset-0">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/70 to-transparent"></div>
      </div>
      
      <div className="absolute top-6 left-6 z-10 flex gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
            <ArrowLeft className="text-white" />
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isFavorite ? 'bg-netflix-red' : 'bg-black/50 hover:bg-black/70'}`}
          onClick={toggleFavorite}
        >
          <Heart className={`${isFavorite ? 'text-white fill-current' : 'text-white'}`} />
        </Button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6">
        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>{releaseYear}</span>
          <span className="px-2 py-1 bg-netflix-red rounded text-xs text-white">
            {Math.round(movie.vote_average * 10)}% Aprovação
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
