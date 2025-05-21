import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo } from "react";

export const useAccessControl = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subLoading,
    checkSubscription
  } = useSubscription();

  const [hasAccess, setHasAccess] = useState(false);

  // Memoize the access calculation
  const userHasAccess = useMemo(() => {
    return Boolean(isSubscribed || isAdmin || hasTempAccess || hasTrialAccess);
  }, [isSubscribed, isAdmin, hasTempAccess, hasTrialAccess]);

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
