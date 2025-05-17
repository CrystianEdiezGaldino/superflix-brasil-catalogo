
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect } from "react";

export const useAccessControl = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  // Use the subscription context if available, otherwise fall back to a default value
  let subscriptionData = { isSubscribed: false, isAdmin: false, hasTempAccess: false, hasTrialAccess: false, isLoading: true };
  
  try {
    // This will throw if not within SubscriptionProvider
    const subscription = useSubscription();
    subscriptionData = subscription;
  } catch (error) {
    console.warn("useSubscription unavailable, using default values");
    // We already set default values above, so no need to do anything here
  }
  
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess, 
    hasTrialAccess, 
    isLoading: subLoading 
  } = subscriptionData;

  useEffect(() => {
    // Update loading state
    setSubscriptionLoading(subLoading);
    
    // Calculate access - Make sure to include "trialing" status as valid access
    const userHasAccess = Boolean(isSubscribed || isAdmin || hasTempAccess || hasTrialAccess);
    console.log("Access control status:", { 
      isSubscribed, 
      isAdmin, 
      hasTempAccess, 
      hasTrialAccess,
      userHasAccess 
    });
    
    setHasAccess(userHasAccess);
  }, [isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, subLoading]);
  
  return {
    user,
    authLoading,
    subscriptionLoading,
    hasAccess,
    isLoading: authLoading || subscriptionLoading
  };
};
