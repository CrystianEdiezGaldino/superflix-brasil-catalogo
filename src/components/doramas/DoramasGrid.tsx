
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem } from "@/types/movie";
import DoramaCard from "@/components/doramas/DoramaCard";
import { useDoramaVideos } from "@/hooks/useDoramaVideos";

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
  const observerTarget = useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMore || isSearching || isFiltering || isLoadingMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    const currentTarget = observerTarget.current;
    
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isSearching, isFiltering, isLoadingMore, onLoadMore]);

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
          <div key={`${dorama.media_type || 'unknown'}-${dorama.id || Math.random()}`} className="dorama-grid-item">
            <DoramaCard 
              dorama={dorama} 
              videoKey={dorama.id ? videoMap[dorama.id] : undefined}
            />
          </div>
        ))}
      </div>
      
      {/* Infinite scroll loading indicator */}
      {hasMore && !isSearching && !isFiltering && (
        <div 
          ref={observerTarget} 
          className="flex justify-center my-8"
        >
          {isLoadingMore && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-t-transparent border-netflix-red rounded-full animate-spin"></div>
              <span className="text-gray-400">Carregando mais conteúdo...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoramasGrid;
