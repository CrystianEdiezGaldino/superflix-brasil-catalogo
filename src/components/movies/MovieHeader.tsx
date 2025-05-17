import { Movie } from "@/types/movie";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  movie: Movie;
}

const MovieHeader = ({ movie }: MovieHeaderProps) => {
  const releaseYear = new Date(movie.release_date).getFullYear();
  
  return (
    <div className="relative h-[40vh] sm:h-[50vh] md:h-[70vh]">
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
      
      <div className="absolute top-4 sm:top-8 left-4 sm:left-6 z-10">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
            <ArrowLeft className="text-white" />
          </Button>
        </Link>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
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
