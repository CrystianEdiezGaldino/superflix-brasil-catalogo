
import { supabase } from "@/integrations/supabase/client";
import { cacheManager } from "./cacheManager";

const CACHE_KEYS = {
  SUBSCRIPTION: (userId: string) => `subscription_${userId}`,
  TRIAL: (userId: string) => `trial_${userId}`,
  TEMP_ACCESS: (userId: string) => `temp_access_${userId}`
};

/**
 * Checks the user's subscription status
 * @param userId - User ID
 * @param sessionToken - Session token for authorization
 */
export const checkSubscriptionStatus = async (userId: string, sessionToken?: string) => {
  if (!userId) {
    console.error('Cannot check subscription: User ID not provided');
    return getDefaultSubscriptionState();
  }

  try {
    // Check cache first
    const cachedData = cacheManager.get(CACHE_KEYS.SUBSCRIPTION(userId));
    if (cachedData) {
      console.log("Subscription data from cache");
      return cachedData;
    }

    // First check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    const isAdmin = roleData?.role === 'admin';
    console.log("Admin check result:", { isAdmin, roleData, roleError });

    // If user is admin, return admin state immediately
    if (isAdmin) {
      const adminState = {
        hasActiveSubscription: true,
        has_trial_access: true,
        subscription_tier: 'admin',
        isAdmin: true,
        hasTempAccess: false
      };
      cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), adminState, 300000); // 5 min cache
      return adminState;
    }

    // Optimized query to fetch only the needed fields
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
                         
      const isActive = directData.status === 'active' && 
                      directData.current_period_end && 
                      new Date(directData.current_period_end) > now;
      
      const result = {
        hasActiveSubscription: isActive,
        has_trial_access: isTrialing,
        subscription_tier: directData.plan_type || 'none',
        trial_end: directData.trial_end,
        subscription_end: directData.current_period_end,
        isAdmin: false
      };

      // Save to cache with shorter TTL for trial
      const cacheTime = isTrialing ? 60000 : 300000; // 1 min for trial, 5 min for others
      cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), result, cacheTime);
      
      return result;
    }
    
    // Try edge function if direct query fails
    console.log("Tentando edge function para obter dados de assinatura");
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { user_id: userId }
      });
      
      if (error) {
        console.error('Erro ao verificar assinatura:', error);
        return getDefaultSubscriptionState();
      }
      
      // Add admin status to the data
      const result = {
        ...data,
        isAdmin: false // Explicitly set to false for non-admin users
      };
      
      // Cache the result
      if (result) {
        const cacheTime = result?.has_trial_access ? 60000 : 300000;
        cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), result, cacheTime);
      }
      
      return result;
    } catch (edgeError) {
      console.error('Falha ao verificar assinatura via Edge Function:', edgeError);
      return getDefaultSubscriptionState();
    }
  } catch (error) {
    console.error('Falha ao verificar assinatura:', error);
    return getDefaultSubscriptionState();
  }
};

/**
 * Process subscription data from the check-subscription function
 */
export const processSubscriptionData = (data: any) => {
  const defaults = {
    isSubscribed: false,
    isAdmin: false,
    hasTempAccess: false,
    hasTrialAccess: false,
    subscriptionTier: 'none',
    subscriptionEnd: null,
    trialEnd: null
  };

  if (!data) return defaults;

  const hasTrialAccess = Boolean(data?.has_trial_access);
  const isActive = Boolean(data?.hasActiveSubscription);
  const isAdmin = Boolean(data?.isAdmin);

  console.log("Processing subscription data:", { data, isAdmin });

  return {
    isSubscribed: isActive,
    isAdmin: isAdmin,
    hasTempAccess: Boolean(data?.hasTempAccess),
    hasTrialAccess: hasTrialAccess,
    subscriptionTier: data?.subscription_tier || 'none',
    subscriptionEnd: data?.subscription_end || null,
    trialEnd: data?.trial_end || null
  };
};

/**
 * Get default subscription state for error cases
 */
function getDefaultSubscriptionState() {
  return {
    hasActiveSubscription: false,
    has_trial_access: false,
    subscription_tier: 'none',
    isAdmin: false,
    hasTempAccess: false
  };
}
