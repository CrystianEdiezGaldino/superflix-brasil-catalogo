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
  yearFilter?: string;
  ratingFilter?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onYearFilterChange?: (year: string) => void;
  onRatingFilterChange?: (rating: string) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
  onMediaClick?: (media: MediaItem) => void;
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
  onMediaClick,
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
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h1>
        
        {/* Conteúdo de destaque (renderizado condicionalmente) */}
        {!isSearching && !isFiltering && children}
        
        {/* Seções de conteúdo - ocultadas durante a busca */}
        <div className={isSearching ? "hidden" : ""}>
          {/* Seção de tendências */}
          {!isFiltering && trendingItems && trendingItems.length > 0 && (
            <MediaSection 
              title={`Tendências em ${getContentTypeTitle(type)}`}
              medias={trendingItems}
              onMediaClick={onMediaClick}
            />
          )}
          
          {/* Seção dos mais bem avaliados */}
          {!isFiltering && topRatedItems && topRatedItems.length > 0 && (
            <MediaSection 
              title={`${getContentTypeTitle(type)} Mais Bem Avaliados`}
              medias={topRatedItems}
              onMediaClick={onMediaClick}
            />
          )}
          
          {/* Seção dos mais populares */}
          {!isFiltering && popularItems && popularItems.length > 0 && (
            <MediaSection 
              title={`${getContentTypeTitle(type)} Populares`}
              medias={popularItems}
              onMediaClick={onMediaClick}
            />
          )}
          
          {/* Seção de conteúdo recente */}
          {!isFiltering && recentItems && recentItems.length > 0 && (
            <MediaSection 
              title={`${getContentTypeTitle(type)} Recentes`}
              medias={recentItems}
              onMediaClick={onMediaClick}
            />
          )}
        </div>
        
        {/* Grade de conteúdo completa */}
        <div className="mt-8">
          <MediaGrid 
            mediaItems={mediaItems}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            isSearching={isSearching}
            isFiltering={isFiltering}
            onLoadMore={onLoadMore}
            onResetFilters={onResetFilters}
            onMediaClick={onMediaClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaView; 