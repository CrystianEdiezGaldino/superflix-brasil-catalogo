import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type WatchHistory = Database['public']['Tables']['watch_history']['Row'];
type WatchHistoryInsert = Database['public']['Tables']['watch_history']['Insert'];

export interface WatchHistoryItem extends WatchHistory {}

export const watchHistoryService = {
  async addToHistory(tmdbId: number, mediaType: 'movie' | 'tv') {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await (supabase
      .from('watch_history')
      .insert({
        user_id: user.user.id,
        tmdb_id: tmdbId,
        media_type: mediaType,
      } as WatchHistoryInsert)
      .select()
      .single());

    if (error) throw error;
    return data as WatchHistoryItem;
  },

  async getWatchHistory(limit = 10) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await (supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(limit));

    if (error) throw error;
    return (data ?? []) as WatchHistoryItem[];
  },
}; 