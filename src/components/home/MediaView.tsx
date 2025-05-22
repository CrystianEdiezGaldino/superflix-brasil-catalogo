
import React from "react";
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "./MediaSectionLoader";

interface MediaViewProps {
  title: string;
  type: "movie" | "tv" | "anime" | "dorama" | "tv-channel";
  mediaItems: MediaItem[];
  trendingItems: MediaItem[];
  topRatedItems: MediaItem[];
  recentItems: MediaItem[];
  onMediaClick?: (media: MediaItem) => void;
  onLoadMoreTrending: () => void;
  onLoadMoreTopRated: () => void;
  onLoadMoreRecent: () => void;
  hasMoreTrending?: boolean;
  hasMoreTopRated?: boolean;
  hasMoreRecent?: boolean;
  trendingTitle?: string;
  topRatedTitle?: string;
  recentTitle?: string;
  sectionLoading?: boolean;
  isFiltering?: boolean;
  isSearching?: boolean;
  yearFilter?: string;
  ratingFilter?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onYearFilterChange?: (year: string) => void;
  onRatingFilterChange?: (rating: string) => void;
  onResetFilters?: () => void;
  focusedSection?: number;
  focusedItem?: number;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const MediaView: React.FC<MediaViewProps> = ({
  title,
  type,
  mediaItems,
  trendingItems,
  topRatedItems,
  recentItems,
  onMediaClick,
  onLoadMoreTrending,
  onLoadMoreTopRated,
  onLoadMoreRecent,
  hasMoreTrending = false,
  hasMoreTopRated = false,
  hasMoreRecent = false,
  trendingTitle = "Em Alta",
  topRatedTitle = "Mais Bem Avaliados",
  recentTitle = "Recentes",
  sectionLoading = false,
  isFiltering = false,
  isSearching = false,
  yearFilter = "",
  ratingFilter = "",
  searchQuery = "",
  onSearch,
  onYearFilterChange,
  onRatingFilterChange,
  onResetFilters,
  focusedSection = 0,
  focusedItem = 0,
  isLoading = false,
  children
}) => {
  // Ensure all item arrays are valid
  const safeMediaItems = Array.isArray(mediaItems) ? mediaItems.filter(Boolean) : [];
  const safeTrendingItems = Array.isArray(trendingItems) ? trendingItems.filter(Boolean) : [];
  const safeTopRatedItems = Array.isArray(topRatedItems) ? topRatedItems.filter(Boolean) : [];
  const safeRecentItems = Array.isArray(recentItems) ? recentItems.filter(Boolean) : [];
  
  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
      
      {children}
      
      {safeTrendingItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={trendingTitle}
            medias={safeTrendingItems}
            showLoadMore={hasMoreTrending}
            onLoadMore={onLoadMoreTrending}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`trending-${type}`}
            mediaType={type}
            hasMore={hasMoreTrending}
          />
        </div>
      )}
      
      {safeTopRatedItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={topRatedTitle}
            medias={safeTopRatedItems}
            showLoadMore={hasMoreTopRated}
            onLoadMore={onLoadMoreTopRated}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`top-rated-${type}`}
            mediaType={type}
            hasMore={hasMoreTopRated}
          />
        </div>
      )}
      
      {safeRecentItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={recentTitle}
            medias={safeRecentItems}
            showLoadMore={hasMoreRecent}
            onLoadMore={onLoadMoreRecent}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`recent-${type}`}
            mediaType={type}
            hasMore={hasMoreRecent}
          />
        </div>
      )}
    </div>
  );
};

export default MediaView;
