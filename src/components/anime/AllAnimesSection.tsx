import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/media/MediaCard";
import LoadingCard from "@/components/media/LoadingCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AllAnimesSectionProps {
  animes: MediaItem[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMediaClick: (media: MediaItem) => void;
}

const AllAnimesSection = ({
  animes,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onMediaClick,
}: AllAnimesSectionProps) => {
  // Verificar se temos dados para mostrar
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
        <p className="mt-2 text-gray-400">Carregando animes...</p>
      </div>
    );
  }

  // Verificar se não temos nenhum dado para mostrar
  if (animes.length === 0) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold text-white mb-4">Todos os Animes</h3>
        <p className="text-gray-400 text-center py-12">Nenhum anime encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Todos os Animes</h3>
        {hasMore && (
          <Button
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Carregar Mais Animes"
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animes.map((media, index) => (
          <MediaCard
            key={`${media.id}-${index}`}
            media={media}
            onClick={() => onMediaClick(media)}
            index={index}
            isFocused={false}
            onFocus={() => {}}
          />
        ))}
        
        {/* Loading cards */}
        {isFetchingMore && (
          <>
            {[...Array(6)].map((_, index) => (
              <LoadingCard key={`loading-${index}`} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AllAnimesSection; 