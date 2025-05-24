import { Movie } from "@/types/movie";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  movie: Movie;
}

const MovieHeader = ({ movie }: MovieHeaderProps) => {
  const releaseYear = new Date(movie.release_date).getFullYear();
  
  return (
    <div className="relative h-[25vh] sm:h-[30vh] md:h-[35vh]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-netflix-background/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-background/95 to-transparent"></div>
      </div>
      
      {/* Back Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="rounded-full bg-black/50 hover:bg-black/70 p-2 sm:p-3 flex items-center justify-center text-white font-medium shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="text-white h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </Link>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Poster */}
              <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-60 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 flex-shrink-0">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sem poster</span>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg truncate">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300 mb-2">
                  <span className="bg-black/30 px-2 py-0.5 rounded-full">{releaseYear}</span>
                  <span className="px-2 py-0.5 bg-netflix-red rounded-full text-white font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {Math.round(movie.vote_average * 10)}%
                  </span>
                  {movie.runtime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {movie.runtime} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(movie.release_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {movie.genres.map((genre) => (
                      <span 
                        key={genre.id}
                        className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 hidden sm:block">
                  {movie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
