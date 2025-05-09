
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
    <div className="container max-w-5xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-md shadow-xl"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-gray-500">{movie.title}</span>
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex-1">
          <Collapsible className="w-full" defaultOpen={true}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Sinopse</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <p className="text-gray-300 mb-6">{movie.overview || "Nenhuma sinopse disponível."}</p>
            </CollapsibleContent>
          </Collapsible>
          
          <MovieAccessPrompt hasAccess={hasAccess} />
        </div>
      </div>
    </div>
  );
};

export default MovieContent;
