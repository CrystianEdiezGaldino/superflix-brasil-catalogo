import { supabase } from "@/integrations/supabase/client";
import { AdminStats, UserWithSubscription, Subscription, TempAccess } from "@/types/admin";

export const fetchAdminData = async () => {
  try {
    // Buscar usuários
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*');

    if (usersError) throw usersError;

    // Buscar assinaturas
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*');

    if (subscriptionsError) throw subscriptionsError;

    // Buscar acessos temporários
    const { data: tempAccesses, error: tempAccessError } = await supabase
      .from('temp_access')
      .select('*');

    if (tempAccessError) throw tempAccessError;

    // Buscar códigos promocionais
    const { data: promoCodes, error: promoCodesError } = await supabase
      .from('promo_codes')
      .select('*');

    if (promoCodesError) throw promoCodesError;

    // Mapear os dados para os tipos corretos
    const mappedUsers = users?.map(user => {
      const userSubscription = subscriptions?.find(sub => sub.user_id === user.id);
      return {
        id: user.id,
        email: user.username || '',
        name: user.username || '',
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        subscription: userSubscription
      };
    }) as UserWithSubscription[];

    const mappedSubscriptions = subscriptions?.map(sub => {
      const user = users?.find(u => u.id === sub.user_id);
      return {
        ...sub,
        start_date: sub.current_period_start || sub.created_at,
        end_date: sub.current_period_end || sub.trial_end || sub.created_at,
        user: user ? {
          id: user.id,
          email: user.username || '',
          name: user.username || '',
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at
        } : undefined
      };
    }) as Subscription[];

    const mappedTempAccesses = tempAccesses?.map(access => {
      const user = users?.find(u => u.id === access.user_id);
      return {
        ...access,
        start_date: access.created_at,
        end_date: access.expires_at,
        is_active: new Date(access.expires_at) > new Date(),
        user: user ? {
          id: user.id,
          email: user.username || '',
          name: user.username || '',
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at
        } : undefined
      };
    }) as TempAccess[];

    // Calcular estatísticas
    const stats: AdminStats = {
      totalUsers: mappedUsers?.length || 0,
      activeSubscriptions: mappedSubscriptions?.filter(sub => sub.status === 'active').length || 0,
      tempAccesses: mappedTempAccesses?.filter(access => access.is_active).length || 0,
      promoCodes: promoCodes?.filter(code => code.is_active).length || 0
    };

    return {
      users: mappedUsers,
      subscriptions: mappedSubscriptions,
      tempAccesses: mappedTempAccesses,
      stats
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
}; 