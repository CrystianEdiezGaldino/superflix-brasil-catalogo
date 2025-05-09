
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Checks the subscription status of a user
 * @param userId - The user's ID
 * @param sessionToken - The user's session token for authorization
 */
export const checkSubscriptionStatus = async (userId: string, sessionToken?: string) => {
  if (!userId) {
    console.error('Cannot check subscription status: No user ID provided');
    return null;
  }

  try {
    console.log('Checking subscription status...');
    
    // Use the session token for authorization
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: { user_id: userId },
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : undefined
    });
    
    if (error) {
      console.error('Error checking subscription:', error);
      return null;
    }
    
    console.log('Subscription check result:', {
      isSubscribed: data?.hasActiveSubscription || false,
      isAdmin: data?.isAdmin || false,
      hasTempAccess: data?.hasTempAccess || false,
      hasTrialAccess: data?.has_trial_access || false,
      subscriptionTier: data?.subscription_tier || null,
      user: userId
    });
    
    return data;
  } catch (error) {
    console.error('Failed to check subscription:', error);
    return null;
  }
};

/**
 * Manages throttling for subscription checks
 * @param lastCheckTime - Timestamp of the last check
 * @param visibilityChanged - Whether the tab visibility has changed
 * @returns Whether the check should be throttled
 */
export const shouldThrottleCheck = (lastCheckTime: number, visibilityChanged: boolean) => {
  const now = Date.now();
  const timeSinceLastCheck = now - lastCheckTime;
  // Permite verificações mais frequentes (1 segundo em vez de 2)
  const isThrottled = timeSinceLastCheck < 1000;
  
  if (isThrottled) {
    console.log(`Skipping subscription check - throttled (last check was ${timeSinceLastCheck}ms ago)`);
  }
  
  return isThrottled;
};

/**
 * Handles errors from subscription checks
 * @param error - The error that occurred
 * @param retryCount - The current retry count
 * @param maxRetries - The maximum number of retries
 * @returns Updated retry count
 */
export const handleSubscriptionError = (error: any, retryCount: number, maxRetries: number): number => {
  console.error('Error checking subscription:', error);
  
  if (retryCount >= maxRetries) {
    toast.error('Erro ao verificar assinatura. Tente recarregar a página.');
    return retryCount;
  }
  
  return retryCount + 1;
};

/**
 * Updates subscription state based on check result
 * @param data - The subscription data returned from check-subscription
 * @returns Object with subscription state values
 */
export const processSubscriptionData = (data: any) => {
  // Default values in case data is invalid
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

  // Melhor processamento para identificar corretamente o estado da assinatura
  const isSubscribed = data?.hasActiveSubscription || false;
  const isAdmin = data?.isAdmin || false;
  const hasTempAccess = data?.hasTempAccess || false;
  const hasTrialAccess = data?.has_trial_access || false;
  
  console.log("Processing subscription data:", {
    isSubscribed,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier: data?.subscription_tier || null,
    subscriptionEnd: data?.subscription_end || null,
    trialEnd: data?.trial_end || null
  });

  return {
    isSubscribed,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier: data?.subscription_tier || null,
    subscriptionEnd: data?.subscription_end || data?.tempAccess?.expires_at || null,
    trialEnd: data?.trial_end || null
  };
};
