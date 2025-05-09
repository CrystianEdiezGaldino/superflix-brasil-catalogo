
import { supabase } from "@/integrations/supabase/client";

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
    // Tentar obter dados diretamente do banco de dados primeiro
    // isso é mais rápido e evita problemas com a função Edge
    const { data: directData, error: directError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!directError && directData) {
      console.log("Dados de assinatura obtidos diretamente:", directData);
      
      const now = new Date();
      const isTrialing = directData.status === 'trialing' && 
                         directData.trial_end && 
                         new Date(directData.trial_end) > now;
                         
      const isActive = directData.status === 'active';
      
      // Retornar dados formatados compatíveis com o que a edge function retornaria
      return {
        hasActiveSubscription: isActive,
        has_trial_access: isTrialing,
        subscription_tier: directData.plan_type,
        trial_end: directData.trial_end,
        subscription_end: directData.current_period_end,
        // Ainda precisamos verificar admin e acesso temporário
        // Mas pelo menos temos informação básica de assinatura
      };
    }
    
    // Se não conseguir dados diretos, tenta a edge function
    console.log("Tentando edge function para obter dados de assinatura");
    
    // Usar o token de sessão para autorização
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: { user_id: userId },
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : undefined
    });
    
    if (error) {
      console.error('Erro ao verificar assinatura:', error);
      throw error;
    }
    
    // Log simplificado do resultado
    console.log('Resultado da verificação de assinatura:', {
      isSubscribed: data?.hasActiveSubscription || false,
      isAdmin: data?.isAdmin || false,
      hasTempAccess: data?.hasTempAccess || false,
      hasTrialAccess: data?.has_trial_access || false,
      subscriptionTier: data?.subscription_tier || null
    });
    
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
  // Valores padrão caso os dados sejam inválidos
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

  // Processamento simplificado para determinar o estado da assinatura
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
