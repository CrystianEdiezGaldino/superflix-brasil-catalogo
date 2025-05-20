import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "@/types/movie";
import { fetchMovieDetails } from "@/services/tmdb/movies";
import { fetchSeriesDetails } from "@/services/tmdb/series";

export const addToWatchHistory = async (userId: string, media: MediaItem): Promise<void> => {
  try {
    const { error } = await supabase
      .from('watch_history')
      .upsert({
        user_id: userId,
        tmdb_id: media.id,
        media_type: media.media_type,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding to watch history:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding to watch history:', error);
    throw error;
  }
};

export const getWatchHistory = async (userId: string): Promise<MediaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error getting watch history:', error);
      throw error;
    }

    if (!data) return [];

    // Buscar detalhes de cada item do TMDB
    const mediaItems = await Promise.all(
      data.map(async (item) => {
        try {
          let mediaDetails;
          if (item.media_type === 'movie') {
            mediaDetails = await fetchMovieDetails(item.tmdb_id.toString());
          } else if (item.media_type === 'tv') {
            mediaDetails = await fetchSeriesDetails(item.tmdb_id.toString());
          }

          if (!mediaDetails) return null;

          return {
            ...mediaDetails,
            media_type: item.media_type,
            id: item.tmdb_id
          };
        } catch (error) {
          console.error(`Error fetching details for ${item.media_type} ${item.tmdb_id}:`, error);
          return null;
        }
      })
    );

    return mediaItems.filter((item): item is MediaItem => item !== null);
  } catch (error) {
    console.error('Error getting watch history:', error);
    throw error;
  }
};

export const removeFromWatchHistory = async (userId: string, mediaId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', userId)
      .eq('tmdb_id', mediaId);

    if (error) {
      console.error('Error removing from watch history:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error removing from watch history:', error);
    throw error;
  }
}; 