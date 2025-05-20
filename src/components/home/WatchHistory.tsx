
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClockRewind } from "lucide-react";
import MediaCard from "../media/MediaCard";
import { MediaItem } from "@/types/movie";

interface WatchHistoryProps {
  history: MediaItem[];
  title?: string;
  onViewAll?: () => void;
  onMediaClick: (media: MediaItem) => void;
}

const WatchHistory = ({
  history,
  title = "Continue Assistindo",
  onViewAll,
  onMediaClick
}: WatchHistoryProps) => {
  if (!history || history.length === 0) {
    return null;
  }

  const handleMediaClick = (item: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(item);
    }
  };

  return (
    <Card className="bg-black/60 border-netflix-red/20 backdrop-blur-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ClockRewind className="h-5 w-5 text-netflix-red mr-2" />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {onViewAll && (
          <Button 
            variant="link" 
            onClick={onViewAll}
            className="text-netflix-red hover:text-red-400"
          >
            Ver tudo
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.slice(0, 6).map((item, index) => (
          <div key={`history-${item.id}-${index}`}>
            <MediaCard 
              media={item}
              onClick={() => handleMediaClick(item)}
              showProgress
              progress={Math.floor(Math.random() * 90) + 10} // Example progress
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WatchHistory;
