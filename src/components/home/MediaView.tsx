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
  focusedSection?: number;
  focusedItem?: number;
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
  focusedSection = 0,
  focusedItem = 0,
  children
}) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
      
      {children}
      
      {trendingItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={trendingTitle}
            medias={trendingItems}
            showLoadMore={hasMoreTrending}
            onLoadMore={onLoadMoreTrending}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`trending-${type}-${Date.now()}`}
            mediaType={type}
            hasMore={hasMoreTrending}
          />
        </div>
      )}
      
      {topRatedItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={topRatedTitle}
            medias={topRatedItems}
            showLoadMore={hasMoreTopRated}
            onLoadMore={onLoadMoreTopRated}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`top-rated-${type}-${Date.now()}`}
            mediaType={type}
            hasMore={hasMoreTopRated}
          />
        </div>
      )}
      
      {recentItems.length > 0 && (
        <div className="mb-10">
          <MediaSectionLoader 
            title={recentTitle}
            medias={recentItems}
            showLoadMore={hasMoreRecent}
            onLoadMore={onLoadMoreRecent}
            isLoading={sectionLoading}
            onMediaClick={onMediaClick}
            sectionId={`recent-${type}-${Date.now()}`}
            mediaType={type}
            hasMore={hasMoreRecent}
          />
        </div>
      )}
    </div>
  );
};

export default MediaView;
