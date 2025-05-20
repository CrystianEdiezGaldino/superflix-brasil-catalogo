
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History } from "lucide-react";
import { getMediaTitle } from "@/types/movie";

interface WatchHistoryProps {
  userId?: string;
  limit?: number;
}

interface HistoryItem {
  id: string;
  media_id: number;
  title: string;
  poster: string;
  type: "movie" | "tv";
  watched_at: string;
  progress?: number;
}

const WatchHistory = ({ userId, limit = 6 }: WatchHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Convert limit to string for the API call
        const limitStr = String(limit);
        const response = await fetch(`/api/watch-history?user_id=${userId}&limit=${limitStr}`);
        if (!response.ok) throw new Error('Failed to fetch watch history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching watch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId, limit]);

  if (isLoading) {
    return <div className="p-4">Loading watch history...</div>;
  }

  if (!history.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Continue Assistindo</h2>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tudo</TabsTrigger>
          <TabsTrigger value="movies">Filmes</TabsTrigger>
          <TabsTrigger value="series">Séries</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {history.map((item) => (
            <div key={item.id} className="relative">
              <img 
                src={`https://image.tmdb.org/t/p/w500${item.poster}`} 
                alt={item.title}
                className="w-full h-auto rounded-md"
              />
              {item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="movies" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {history.filter(item => item.type === "movie").map((item) => (
            <div key={item.id} className="relative">
              <img 
                src={`https://image.tmdb.org/t/p/w500${item.poster}`} 
                alt={item.title}
                className="w-full h-auto rounded-md"
              />
              {item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="series" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {history.filter(item => item.type === "tv").map((item) => (
            <div key={item.id} className="relative">
              <img 
                src={`https://image.tmdb.org/t/p/w500${item.poster}`} 
                alt={item.title}
                className="w-full h-auto rounded-md"
              />
              {item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WatchHistory;
