
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

  // Processamento simplificado para determinar o estado da assinatura
  return {
    isSubscribed: Boolean(data?.hasActiveSubscription),
    isAdmin: Boolean(data?.isAdmin),
    hasTempAccess: Boolean(data?.hasTempAccess),
    hasTrialAccess: Boolean(data?.has_trial_access),
    subscriptionTier: data?.subscription_tier || null,
    subscriptionEnd: data?.subscription_end || data?.tempAccess?.expires_at || null,
    trialEnd: data?.trial_end || null
  };
};
