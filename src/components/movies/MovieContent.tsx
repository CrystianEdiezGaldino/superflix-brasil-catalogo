import { Movie } from "@/types/movie";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import MovieAccessPrompt from "./MovieAccessPrompt";

interface MovieContentProps {
  movie: Movie;
  hasAccess: boolean;
}

const MovieContent = ({ movie, hasAccess }: MovieContentProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6 sm:gap-8">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sem poster</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Sinopse */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Sinopse</h2>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 sm:pt-4">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {movie.overview || "Sinopse não disponível."}
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Informações */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Informações</h2>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 sm:pt-4">
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                <p>
                  <span className="font-medium">Título Original:</span> {movie.original_title}
                </p>
                <p>
                  <span className="font-medium">Data de Lançamento:</span>{" "}
                  {new Date(movie.release_date).toLocaleDateString("pt-BR")}
                </p>
                <p>
                  <span className="font-medium">Duração:</span> {movie.runtime} minutos
                </p>
                <p>
                  <span className="font-medium">Gêneros:</span>{" "}
                  {movie.genres?.map((genre) => genre.name).join(", ")}
                </p>
                <p>
                  <span className="font-medium">Avaliação:</span>{" "}
                  {Math.round(movie.vote_average * 10)}%
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {!hasAccess && <MovieAccessPrompt hasAccess={hasAccess} />}
        </div>
      </div>
    </div>
  );
};

export default MovieContent;
