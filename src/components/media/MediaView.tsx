
import React from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MediaFilters from "./MediaFilters";
import MediaGrid from "./MediaGrid";
import MediaSection from "@/components/MediaSection";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/types/movie";
import { TrendingUp, Star, Clock } from "lucide-react";

interface MediaViewProps {
  title: string;
  type: "movie" | "tv" | "anime" | "dorama";
  mediaItems: MediaItem[];
  trendingItems?: MediaItem[];
  topRatedItems?: MediaItem[];
  recentItems?: MediaItem[];
  popularItems?: MediaItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isFiltering: boolean;
  isSearching: boolean;
  page: number;
  yearFilter: string;
  ratingFilter: string;
  searchQuery: string;
  onSearch: (query: string) => void;
  onYearFilterChange: (year: string) => void;
  onRatingFilterChange: (rating: string) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
  children?: React.ReactNode;
}

const MediaView = ({
  title,
  type,
  mediaItems,
  trendingItems,
  topRatedItems,
  recentItems,
  popularItems,
  isLoading,
  isLoadingMore,
  hasMore,
  isFiltering,
  isSearching,
  page,
  yearFilter,
  ratingFilter,
  searchQuery,
  onSearch,
  onYearFilterChange,
  onRatingFilterChange,
  onLoadMore,
  onResetFilters,
  children
}: MediaViewProps) => {
  
  // Helper function to determine content section title based on type
  const getContentTypeTitle = (contentType: string) => {
    switch (contentType) {
      case "movie": return "Filmes";
      case "tv": return "Séries";
      case "anime": return "Animes";
      case "dorama": return "Doramas";
      default: return "Conteúdo";
    }
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={(query) => onSearch(query)} />
      
      <div className="pt-24 pb-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h1>
        
        {/* Filtros para busca e filtragem */}
        <MediaFilters 
          searchQuery={searchQuery}
          yearFilter={yearFilter}
          ratingFilter={ratingFilter}
          isSearching={isSearching}
          onSearch={onSearch}
          onYearFilterChange={onYearFilterChange}
          onRatingFilterChange={onRatingFilterChange}
        />
        
        {/* Conteúdo de destaque (renderizado condicionalmente) */}
        {!isSearching && !isFiltering && children}
        
        {/* Seção de tendências */}
        {!isSearching && !isFiltering && trendingItems && trendingItems.length > 0 && (
          <MediaSection 
            title={`Tendências em ${getContentTypeTitle(type)}`}
            medias={trendingItems}
          />
        )}
        
        {/* Seção dos mais bem avaliados */}
        {!isSearching && !isFiltering && topRatedItems && topRatedItems.length > 0 && (
          <MediaSection 
            title={`${getContentTypeTitle(type)} Mais Bem Avaliados`}
            medias={topRatedItems}
          />
        )}
        
        {/* Seção dos mais populares */}
        {!isSearching && !isFiltering && popularItems && popularItems.length > 0 && (
          <MediaSection 
            title={`${getContentTypeTitle(type)} Populares`}
            medias={popularItems}
          />
        )}
        
        {/* Seção de conteúdo recente */}
        {!isSearching && !isFiltering && recentItems && recentItems.length > 0 && (
          <MediaSection 
            title={`${getContentTypeTitle(type)} Recentes`}
            medias={recentItems}
          />
        )}
        
        {/* Grade de conteúdo completa */}
        <section className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            {isSearching 
              ? `Resultados para "${searchQuery}"` 
              : isFiltering 
                ? "Conteúdo Filtrado" 
                : `Todo Conteúdo ${getContentTypeTitle(type)}`}
          </h2>
          
          <MediaGrid 
            mediaItems={mediaItems}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            isSearching={isSearching}
            isFiltering={isFiltering}
            onLoadMore={onLoadMore}
            onResetFilters={onResetFilters}
          />
        </section>
      </div>
    </div>
  );
};

export default MediaView;
