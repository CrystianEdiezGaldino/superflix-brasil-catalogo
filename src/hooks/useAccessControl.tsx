
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo, useRef } from "react";

export const useAccessControl = () => {
  // Use safe defaults in case contexts aren't available
  let authData = { user: null, loading: true };
  let subscriptionData = { 
    isSubscribed: false, 
    isAdmin: false, 
    hasTempAccess: false, 
    hasTrialAccess: false, 
    isLoading: true 
  };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error("useAuth unavailable in useAccessControl:", error);
  }
  
  const { user, loading: authLoading } = authData;
  
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const lastAccessCheck = useRef<number>(0);
  
  // Use the subscription context if available, otherwise fall back to default values
  try {
    // This will throw if not within SubscriptionProvider
    subscriptionData = useSubscription();
  } catch (error) {
    console.warn("useSubscription unavailable in useAccessControl, using default values");
  }
  
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess, 
    hasTrialAccess, 
    isLoading: subLoading 
  } = subscriptionData;

  // Memoize the access calculation
  const userHasAccess = useMemo(() => {
    return Boolean(isSubscribed || isAdmin || hasTempAccess || hasTrialAccess);
  }, [isSubscribed, isAdmin, hasTempAccess, hasTrialAccess]);

  // Only update access state when necessary
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastAccessCheck.current;
    
    // Only update if more than 5 seconds have passed or if loading state changed
    if (timeSinceLastCheck > 5000 || subscriptionLoading !== subLoading) {
      setSubscriptionLoading(subLoading);
      
      // Only log if access status actually changed
      if (hasAccess !== userHasAccess) {
        console.log("Access control status:", { 
          isSubscribed, 
          isAdmin, 
          hasTempAccess, 
          hasTrialAccess,
          userHasAccess 
        });
        
        setHasAccess(userHasAccess);
        lastAccessCheck.current = now;
      }
    }
  }, [userHasAccess, subLoading, isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, hasAccess]);
  
  // Memoize the return value
  return useMemo(() => ({
    user,
    authLoading,
    subscriptionLoading,
    hasAccess,
    isLoading: authLoading || subscriptionLoading
  }), [user, authLoading, subscriptionLoading, hasAccess]);
};
