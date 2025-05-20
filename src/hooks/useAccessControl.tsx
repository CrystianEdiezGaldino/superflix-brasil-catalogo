import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo, useRef } from "react";

export const useAccessControl = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const lastAccessCheck = useRef<number>(0);
  
  // Use the subscription context if available, otherwise fall back to a default value
  let subscriptionData = { isSubscribed: false, isAdmin: false, hasTempAccess: false, hasTrialAccess: false, isLoading: true };
  
  try {
    // This will throw if not within SubscriptionProvider
    const subscription = useSubscription();
    subscriptionData = subscription;
  } catch (error) {
    console.warn("useSubscription unavailable, using default values");
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
