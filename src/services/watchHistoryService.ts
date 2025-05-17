import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type WatchHistory = Database['public']['Tables']['watch_history']['Row'];
type WatchHistoryInsert = Database['public']['Tables']['watch_history']['Insert'];

export interface WatchHistoryItem extends WatchHistory {}

export const watchHistoryService = {
  async addToHistory(tmdbId: number, mediaType: 'movie' | 'tv') {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    // Verifica se já existe um item com mesmo tmdb_id e user_id
    const { data: existing, error: fetchError } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('tmdb_id', tmdbId)
      .eq('media_type', mediaType)
      .single();

    // Erro "no rows" pode ser ignorado, os outros devem ser tratados
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existing) {
      // Se já existir, atualiza o campo updated_at
      const { data: updated, error: updateError } = await supabase
        .from('watch_history')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updated as WatchHistoryItem;
    }

    // Se não existir, insere novo item no histórico
    const { data, error } = await supabase
      .from('watch_history')
      .insert({
        user_id: user.user.id,
        tmdb_id: tmdbId,
        media_type: mediaType,
      } as WatchHistoryInsert)
      .select()
      .single();

    if (error) throw error;
    return data as WatchHistoryItem;
  },

  async getWatchHistory(limit = 10) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as WatchHistoryItem[];
  },
};
