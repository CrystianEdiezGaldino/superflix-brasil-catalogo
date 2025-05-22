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
    console.log("Starting subscription check for user:", userId);

    // Check cache first
    const cachedData = cacheManager.get(CACHE_KEYS.SUBSCRIPTION(userId));
    if (cachedData) {
      console.log("Subscription data from cache:", cachedData);
      return cachedData;
    }

    // Add a small delay to allow webhook to complete
    console.log("Waiting for webhook to complete...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds

    // First check if user is admin
    console.log("Checking admin status...");
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

    // Try direct query first for faster results
    console.log("Checking subscription directly...");
    const { data: directData, error: directError } = await supabase
      .from('subscriptions')
      .select('status, plan_type, trial_end, current_period_end, current_period_start')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();
    
    if (!directError && directData) {
      console.log("Subscription data from direct query:", directData);
      
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

    // If direct query fails, try edge function
    console.log("Direct query failed, trying edge function...");
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('check-subscription', {
        body: { user_id: userId }
      });
      
      if (!edgeError && edgeData) {
        console.log("Subscription data from edge function:", edgeData);
        
        // Add admin status to the data
        const result = {
          ...edgeData,
          isAdmin: false // Explicitly set to false for non-admin users
        };
        
        // Cache the result
        if (result) {
          const cacheTime = result?.has_trial_access ? 60000 : 300000;
          cacheManager.set(CACHE_KEYS.SUBSCRIPTION(userId), result, cacheTime);
        }
        
        return result;
      }
    } catch (edgeError) {
      console.error('Edge function error:', edgeError);
    }
    
    console.log("No subscription data found, returning default state");
    return getDefaultSubscriptionState();
    
  } catch (error) {
    console.error('Failed to check subscription:', error);
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

  if (!data) {
    console.log("No data provided to processSubscriptionData, returning defaults");
    return defaults;
  }

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
  console.log("Returning default subscription state");
  return {
    hasActiveSubscription: false,
    has_trial_access: false,
    subscription_tier: 'none',
    isAdmin: false,
    hasTempAccess: false
  };
}
