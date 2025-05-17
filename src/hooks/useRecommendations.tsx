
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "@/types/movie";
import { fetchRecommendations } from "@/services/tmdbApi";

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchFavoritesAndRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        return;
      }

      try {
        const { data: favorites, error } = await supabase
          .from("favorites")
          .select("media_id, media_type")
          .eq("user_id", user.id);

        if (error) throw error;

        if (favorites && favorites.length > 0) {
          // Separate movies and TV shows
          const movieIds = favorites
            .filter(fav => fav.media_type === "movie")
            .map(fav => fav.media_id);
            
          const tvIds = favorites
            .filter(fav => fav.media_type === "tv")
            .map(fav => fav.media_id);

          // Get recommendations based on favorites
          let recs: MediaItem[] = [];
          
          if (movieIds.length > 0) {
            // Process each ID individually to avoid type errors
            for (const id of movieIds) {
              const movieRecs = await fetchRecommendations(String(id), "movie");
              recs = [...recs, ...movieRecs];
            }
          }
          
          if (tvIds.length > 0) {
            // Process each ID individually to avoid type errors
            for (const id of tvIds) {
              const tvRecs = await fetchRecommendations(String(id), "tv");
              recs = [...recs, ...tvRecs];
            }
          }
          
          // Shuffle and limit recommendations
          setRecommendations(recs.slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavoritesAndRecommendations();
  }, [user]);

  return { recommendations };
};
