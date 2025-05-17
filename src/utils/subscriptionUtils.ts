import { supabase } from "@/integrations/supabase/client";
import { cacheManager } from "./cacheManager";

const CACHE_KEYS = {
  SUBSCRIPTION: (userId: string) => `subscription_${userId}`,
  TRIAL: (userId: string) => `trial_${userId}`,
  TEMP_ACCESS: (userId: string) => `temp_access_${userId}`
};

/**
 * Verifica o estado da assinatura do usuário
 * @param userId - ID do usuário
 * @param sessionToken - Token de sessão para autorização
 */
export const checkSubscriptionStatus = async (userId: string, sessionToken?: string) => {
  if (!userId) {
    console.error('Não foi possível verificar a assinatura: ID de usuário não fornecido');
    return null;
  }

  try {
    // Verificar cache primeiro
    const cachedData = cacheManager.get(CACHE_KEYS.SUBSCRIPTION(userId));
    if (cachedData) {
      console.log("Dados de assinatura obtidos do cache");
      return cachedData;
    }

    // Consulta otimizada para buscar apenas os campos necessários
    const { data: directData, error: directError } = await supabase
      .from('subscriptions')
      .select('status, plan_type, trial_end, current_period_end, current_period_start')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();
    
    if (!directError && directData) {
      console.log("Dados de assinatura obtidos diretamente:", directData);
      
      const now = new Date();
      const isTrialing = directData.status === 'trialing' && 
                         directData.trial_end && 
                         new Date(directData.trial_end) > now;
                         
      const isActive = directData.status === 'active';
      
      const result = {
        hasActiveSubscription: isActive,
        has_trial_access: isTrialing,
        subscription_tier: directData.plan_type,
        trial_end: directData.trial_end,
        subscription_end: directData.current_period_end,
      };

      // Salvar no cache
      cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), result);
      
      return result;
    }
    
    // Se não conseguir dados diretos, tenta a edge function
    console.log("Tentando edge function para obter dados de assinatura");
    
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: { user_id: userId },
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : undefined
    });
    
    if (error) {
      console.error('Erro ao verificar assinatura:', error);
      throw error;
    }
    
    // Salvar resultado no cache
    if (data) {
      cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), data);
    }
    
    return data;
  } catch (error) {
    console.error('Falha ao verificar assinatura:', error);
    throw error;
  }
};

/**
 * Processa os dados da assinatura retornados da verificação
 * @param data - Dados retornados da função check-subscription
 */
export const processSubscriptionData = (data: any) => {
  const defaults = {
    isSubscribed: false,
    isAdmin: false,
    hasTempAccess: false,
    hasTrialAccess: false,
    subscriptionTier: null,
    subscriptionEnd: null,
    trialEnd: null
  };

  if (!data) return defaults;

  const hasTrialAccess = Boolean(data?.has_trial_access);
  const isActive = Boolean(data?.hasActiveSubscription);

  return {
    isSubscribed: isActive,
    isAdmin: Boolean(data?.isAdmin),
    hasTempAccess: Boolean(data?.hasTempAccess),
    hasTrialAccess: hasTrialAccess,
    subscriptionTier: data?.subscription_tier || null,
    subscriptionEnd: data?.subscription_end || data?.tempAccess?.expires_at || null,
    trialEnd: data?.trial_end || null
  };
};
