
import { useState, useEffect } from "react";
import { fetchTVVideos, getBestTVVideoKey } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";

interface DoramaVideoMap {
  [doramaId: number]: string | null;
}

export const useDoramaVideos = (doramas: MediaItem[]) => {
  const [videoMap, setVideoMap] = useState<DoramaVideoMap>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadVideos = async () => {
      // Only fetch for doramas we don't already have data for and that are TV series
      const doramasToFetch = doramas.filter(dorama => 
        dorama.media_type === "tv" && 
        videoMap[dorama.id] === undefined && 
        dorama.id
      );
      
      if (doramasToFetch.length === 0) return;
      
      setIsLoading(true);
      
      const newVideoMap = { ...videoMap };
      
      // Process doramas in batches to avoid too many concurrent requests
      const batchSize = 3;
      for (let i = 0; i < doramasToFetch.length; i += batchSize) {
        const batch = doramasToFetch.slice(i, i + batchSize);
        
        // Fetch videos for each dorama in the batch
        const promises = batch.map(async (dorama) => {
          try {
            const videos = await fetchTVVideos(dorama.id);
            const bestVideoKey = getBestTVVideoKey(videos);
            return { id: dorama.id, videoKey: bestVideoKey || null };
          } catch (error) {
            console.error(`Error fetching videos for dorama ${dorama.id}:`, error);
            return { id: dorama.id, videoKey: null };
          }
        });
        
        // Wait for all promises in this batch to resolve
        const results = await Promise.all(promises);
        
        // Update the video map with the results
        results.forEach(result => {
          newVideoMap[result.id] = result.videoKey;
        });
      }
      
      setVideoMap(newVideoMap);
      setIsLoading(false);
    };
    
    loadVideos();
  }, [doramas]);

  return {
    videoMap,
    isLoading,
    getVideoKey: (doramaId: number): string | undefined => {
      return videoMap[doramaId] || undefined;
    }
  };
};
