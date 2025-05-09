
import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MediaCard from "@/components/MediaCard";
import { Series } from "@/types/movie";

interface DoramasGridProps {
  doramas: Series[];
  isLoading: boolean;
  hasMore: boolean;
  isSearching: boolean;
  isFiltering: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
}

const DoramasGrid = ({
  doramas,
  isLoading,
  hasMore,
  isSearching,
  isFiltering,
  onLoadMore,
  onResetFilters
}: DoramasGridProps) => {
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (isSearching || isFiltering) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isSearching, isFiltering, onLoadMore]);

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
          <p className="text-gray-400 text-lg">Nenhum dorama encontrado</p>
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
          <div key={dorama.id} className="dorama-grid-item">
            <MediaCard media={dorama} />
          </div>
        ))}
      </div>
      
      {/* Loading indicator for infinite scroll */}
      {hasMore && !isSearching && !isFiltering && (
        <div ref={loadingRef} className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default DoramasGrid;
