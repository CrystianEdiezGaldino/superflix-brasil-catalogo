import { useState, useEffect } from "react";
import { MediaItem, Movie, Series } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MediaCard from "@/components/MediaCard";
import { getWatchHistory } from "@/services/supabase/watchHistory";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WatchHistoryProps {
  watchHistory?: MediaItem[]; // Make this prop optional
  onMediaClick?: (media: MediaItem) => void;
}

export default function WatchHistory({ watchHistory: externalWatchHistory, onMediaClick }: WatchHistoryProps) {
  const [internalWatchHistory, setInternalWatchHistory] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use external watch history if provided, otherwise fetch from API
  const watchHistory = externalWatchHistory || internalWatchHistory;

  useEffect(() => {
    // If external watch history is provided, use it
    if (externalWatchHistory) {
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const loadHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const history = await getWatchHistory(user.id);
        setInternalWatchHistory(history);
      } catch (error) {
        console.error('Error loading watch history:', error);
        toast.error('Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, externalWatchHistory]);

  const handleMediaClick = (media: MediaItem) => {
    if (onMediaClick) {
      onMediaClick(media);
      return;
    }

    if (!media.id) {
      toast.error("Não foi possível reproduzir este conteúdo");
      return;
    }

    const mediaId = media.id.toString();
    
    if (media.media_type === 'movie') {
      navigate(`/filme/${mediaId}`);
    } else if (media.media_type === 'tv') {
      navigate(`/serie/${mediaId}`);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Continue Assistindo</h2>
          
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
    return (
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Continue Assistindo</h2>
          
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhum conteúdo no histórico de visualização</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Continue Assistindo</h2>
       
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tudo</TabsTrigger>
          <TabsTrigger value="movies">Filmes</TabsTrigger>
          <TabsTrigger value="series">Séries</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        </TabsContent>

        <TabsContent value="movies" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchHistory
            .filter((media): media is Movie => media.media_type === 'movie')
            .map((media) => (
              <MediaCard 
                key={`${media.id}-${media.media_type}`}
                media={media}
                onClick={() => handleMediaClick(media)}
                index={0}
                isFocused={false}
                onFocus={() => {}}
              />
            ))}
        </TabsContent>

        <TabsContent value="series" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchHistory
            .filter((media): media is Series => media.media_type === 'tv')
            .map((media) => (
              <MediaCard 
                key={`${media.id}-${media.media_type}`}
                media={media}
                onClick={() => handleMediaClick(media)}
                index={0}
                isFocused={false}
                onFocus={() => {}}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
