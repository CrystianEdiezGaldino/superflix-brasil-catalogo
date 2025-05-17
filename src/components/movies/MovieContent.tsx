
import { Movie } from "@/types/movie";
import { Calendar, Clock, Star, Tag, Globe } from "lucide-react";
import MovieAccessPrompt from "./MovieAccessPrompt";

interface MovieContentProps {
  movie: Movie;
  hasAccess: boolean;
}

const MovieContent = ({ movie, hasAccess }: MovieContentProps) => {
  // Função para formatar a data
  const formatReleaseDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "Data não disponível";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10 mx-auto md:mx-0 max-w-[280px] md:max-w-none">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Sem poster</span>
            </div>
          )}
          
          {/* Badge com avaliação */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-white">
              {Math.round(movie.vote_average * 10)}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Sinopse */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center">
              <span className="bg-netflix-red h-6 w-1 mr-2 rounded-full"></span>
              Sinopse
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {movie.overview || "Sinopse não disponível para este título."}
            </p>
          </div>

          {/* Informações */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-netflix-red h-6 w-1 mr-2 rounded-full"></span>
              Informações
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4 text-netflix-red" />
                <span className="font-medium text-white">Lançamento:</span>
                <span>{formatReleaseDate(movie.release_date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4 text-netflix-red" />
                <span className="font-medium text-white">Duração:</span>
                <span>{movie.runtime} minutos</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Tag className="h-4 w-4 text-netflix-red" />
                <span className="font-medium text-white">Gêneros:</span>
                <span className="truncate">
                  {movie.genres?.map(genre => genre.name).join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Globe className="h-4 w-4 text-netflix-red" />
                <span className="font-medium text-white">Título Original:</span>
                <span className="truncate">{movie.original_title}</span>
              </div>
            </div>
          </div>

          {!hasAccess && <MovieAccessPrompt hasAccess={hasAccess} />}
        </div>
      </div>
    </div>
  );
};

export default MovieContent;
