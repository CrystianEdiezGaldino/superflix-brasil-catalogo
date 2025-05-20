
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import MediaCard from "@/components/MediaCard";

// Mock data for watch history items
const watchHistoryData: MediaItem[] = [];

export default function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin } = useSubscription();

  useEffect(() => {
    // Simulate fetching watch history
    setTimeout(() => {
      setWatchHistory(watchHistoryData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMediaClick = (media: MediaItem) => {
    if (!media.id) {
      toast.error("Não foi possível reproduzir este conteúdo");
      return;
    }

    const mediaId = media.id.toString();
    
    if (media.media_type === 'movie') {
      navigate(`/filme/${mediaId}`);
    } else if (media.media_type === 'tv') {
      navigate(`/serie/${mediaId}`);
    } else if (media.media_type === 'anime') {
      navigate(`/anime/${mediaId}`);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Continue Assistindo</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <History className="mr-2 h-4 w-4" />
            Ver Histórico
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg aspect-video h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Continue Assistindo</h2>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          <History className="mr-2 h-4 w-4" />
          Ver Histórico
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {watchHistory.map((media) => (
          <MediaCard 
            key={`${media.id}-${media.media_type}`}
            media={media}
            onClick={() => handleMediaClick(media)}
            index={0}
            isFocused={false}
            onFocus={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
