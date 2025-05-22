
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo } from "react";

export const useAccessControl = () => {
  // Try to get auth and subscription contexts
  let user = null;
  let authLoading = false;
  let subscriptionData = {
    isSubscribed: false,
    isAdmin: false,
    hasTempAccess: false,
    hasTrialAccess: false,
    isLoading: false,
    checkSubscription: async () => {},
  };

  try {
    const auth = useAuth();
    user = auth.user;
    authLoading = auth.loading;
  } catch (error) {
    console.error("Auth context not available in useAccessControl:", error);
  }

  try {
    subscriptionData = useSubscription();
  } catch (error) {
    console.error("Subscription context not available in useAccessControl:", error);
  }
  
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subLoading,
    checkSubscription
  } = subscriptionData;

  const [hasAccess, setHasAccess] = useState(false);

  // Memoize the access calculation
  const userHasAccess = useMemo(() => {
    // Only allow access if user has an active subscription, is admin, has temporary access, or is in trial
    if (!user) return false;
    return Boolean(isSubscribed || isAdmin || hasTempAccess || hasTrialAccess);
  }, [user, isSubscribed, isAdmin, hasTempAccess, hasTrialAccess]);

  // Update access state when necessary
  useEffect(() => {
    if (hasAccess !== userHasAccess) {
      setHasAccess(userHasAccess);
    }
  }, [userHasAccess, hasAccess]);
  
  return {
    user,
    authLoading,
    subscriptionLoading: subLoading,
    hasAccess,
    hasTrialAccess,
    isLoading: authLoading || subLoading
  };
};
