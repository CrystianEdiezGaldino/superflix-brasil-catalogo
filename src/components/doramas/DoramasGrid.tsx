
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem } from "@/types/movie";
import DoramaCard from "@/components/doramas/DoramaCard";
import { useDoramaVideos } from "@/hooks/useDoramaVideos";
import { ChevronDown } from "lucide-react";

interface DoramasGridProps {
  doramas: MediaItem[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  isSearching: boolean;
  isFiltering: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
}

const DoramasGrid = ({
  doramas,
  isLoading,
  hasMore,
  isLoadingMore,
  isSearching,
  isFiltering,
  onLoadMore,
  onResetFilters
}: DoramasGridProps) => {
  const { videoMap } = useDoramaVideos(doramas);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (doramas.length === 0) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-400 text-lg">Nenhum conteúdo encontrado</p>
          <Button 
            onClick={onResetFilters}
            variant="link" 
            className="text-netflix-red mt-2"
          >
            Limpar filtros
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {doramas.map((dorama) => (
          <div key={`${dorama.media_type}-${dorama.id}`} className="dorama-grid-item">
            <DoramaCard 
              dorama={dorama} 
              videoKey={videoMap[dorama.id] || undefined}
            />
          </div>
        ))}
      </div>
      
      {/* Load More button */}
      {hasMore && !isSearching && !isFiltering && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={onLoadMore} 
            disabled={isLoadingMore}
            className="bg-netflix-red hover:bg-red-700 text-white px-6"
          >
            {isLoadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Carregando...
              </>
            ) : (
              <>
                Carregar mais conteúdo
                <ChevronDown className="ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoramasGrid;
