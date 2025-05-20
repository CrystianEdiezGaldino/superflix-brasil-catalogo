
import React from "react";
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaSectionLoaderProps {
  isLoading: boolean;
  title: string;
  medias: MediaItem[];
  showLoadMore?: boolean;
  onLoadMore: () => void;
  onMediaClick?: (media: MediaItem) => void;
  sectionId?: string;
  mediaType?: "movie" | "tv" | "anime" | "dorama" | "tv-channel";
  hasMore?: boolean;
}

const MediaSectionLoader: React.FC<MediaSectionLoaderProps> = ({
  isLoading,
  title,
  medias,
  showLoadMore = false,
  onLoadMore,
  onMediaClick,
  sectionId = "section",
  mediaType = "movie",
  hasMore = false
}) => {
  // If loading and no medias, show skeleton loader
  if (isLoading && medias.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-72 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // If no medias, don't render
  if (medias.length === 0) {
    return null;
  }

  return (
    <MediaSection
      title={title}
      medias={medias}
      showLoadMore={showLoadMore || hasMore}
      onLoadMore={onLoadMore}
      isLoading={isLoading}
      onMediaClick={onMediaClick}
      sectionId={sectionId}
      mediaType={mediaType}
      sectionIndex={0}
    />
  );
};

export default MediaSectionLoader;
