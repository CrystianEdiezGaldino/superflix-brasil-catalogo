
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";
import MediaSectionLoader from "./MediaSectionLoader";
import { useNavigate } from "react-router-dom";
import { fetchMediaById } from "@/services/tmdbApi";

interface WatchHistoryProps {
  limit?: number;
}

const WatchHistory: React.FC<WatchHistoryProps> = ({ limit = 10 }) => {
  const navigate = useNavigate();
  
  // For now, we'll return an empty component until we implement the watch history functionality
  const watchHistoryItems: MediaItem[] = [];
  
  const handleMediaClick = (media: MediaItem) => {
    // Use optional chaining to safely access media_type
    if (media?.media_type === 'movie') {
      navigate(`/filme/${media.id}`);
    } else if (media?.media_type === 'tv') {
      navigate(`/serie/${media.id}`);
    } else if (media?.media_type === 'anime') {
      navigate(`/anime/${media.id}`);
    }
  };

  if (watchHistoryItems.length === 0) {
    return null;
  }
  
  return (
    <MediaSectionLoader 
      title="Continue Assistindo"
      medias={watchHistoryItems}
      showLoadMore={false}
      onLoadMore={() => {}}
      isLoading={false}
      onMediaClick={handleMediaClick}
      sectionId="watch-history"
      mediaType="movie" 
      hasMore={false}
    />
  );
};

export default WatchHistory;
