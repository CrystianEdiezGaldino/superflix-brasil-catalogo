
import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/MediaCard";
import { Card } from "@/components/ui/card";

interface SearchResultsProps {
  results: MediaItem[];
  isSearching: boolean;
}

const SearchResults = ({ results, isSearching }: SearchResultsProps) => {
  if (isSearching) {
    return (
      <div className="flex justify-center items-center min-h-[300px] w-full">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-sm">Pesquisando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/60 border-netflix-red/20 backdrop-blur-sm p-6 mt-4 mb-8 mx-4">
      <h1 className="text-2xl font-bold text-white mb-6 border-b border-netflix-red/30 pb-2">
        Resultados da Pesquisa
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {results.map((media) => (
          <div 
            key={`${media.media_type}-${media.id}`} 
            className="animate-fade-in"
            style={{ animationDelay: `${results.indexOf(media) * 0.05}s` }}
          >
            <MediaCard media={media} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SearchResults;
