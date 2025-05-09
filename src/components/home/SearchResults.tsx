
import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/MediaCard";

interface SearchResultsProps {
  results: MediaItem[];
  isSearching: boolean;
}

const SearchResults = ({ results, isSearching }: SearchResultsProps) => {
  if (isSearching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-4 px-4">Resultados da Pesquisa</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
        {results.map((media) => (
          <div key={`${media.media_type}-${media.id}`}>
            <MediaCard media={media} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResults;
