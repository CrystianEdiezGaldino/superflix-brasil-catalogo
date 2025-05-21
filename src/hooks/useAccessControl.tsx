
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo, useRef } from "react";

export const useAccessControl = () => {
  // Use safe defaults in case contexts aren't available
  let authData = { 
    user: null, 
    loading: true,
    session: null,
    signUp: async (email: string, password: string) => {},
    signIn: async (email: string, password: string) => {},
    signOut: async () => {},
    resetPassword: async (email: string) => {},
    login: async (email: string, password: string) => {},
    register: async (email: string, password: string, name: string) => {},
    refreshSession: async () => {}
  };
  
  let subscriptionData = { 
    isSubscribed: false, 
    isAdmin: false, 
    hasTempAccess: false, 
    hasTrialAccess: false, 
    isLoading: true,
    subscriptionTier: null,
    subscriptionEnd: null,
    trialEnd: null,
    subscription: null,
    checkSubscription: async () => {}
  };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error("useAuth unavailable in useAccessControl:", error);
  }
  
  const { user, loading: authLoading } = authData;
  
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
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
    hasTrialAccess: subTrialAccess,
    isLoading: subLoading,
    checkSubscription
  } = subscriptionData;

  // Memoize the access calculation
  const userHasAccess = useMemo(() => {
    return Boolean(isSubscribed || isAdmin || hasTempAccess || subTrialAccess);
  }, [isSubscribed, isAdmin, hasTempAccess, subTrialAccess]);

  // Only update access state when necessary
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastAccessCheck.current;
    
    // Only update if more than 5 seconds have passed or if loading state changed
    if (timeSinceLastCheck > 5000 || subscriptionLoading !== subLoading) {
      setSubscriptionLoading(subLoading);
      setHasTrialAccess(subTrialAccess);
      
      // Only log if access status actually changed
      if (hasAccess !== userHasAccess) {
        console.log("Access control status:", { 
          isSubscribed, 
          isAdmin, 
          hasTempAccess, 
          hasTrialAccess: subTrialAccess,
          userHasAccess 
        });
        
        setHasAccess(userHasAccess);
        lastAccessCheck.current = now;
      }
    }
  }, [userHasAccess, subLoading, isSubscribed, isAdmin, hasTempAccess, subTrialAccess, hasAccess]);
  
  // Memoize the return value
  return useMemo(() => ({
    user,
    authLoading,
    subscriptionLoading,
    hasAccess,
    hasTrialAccess,
    isLoading: authLoading || subscriptionLoading
  }), [user, authLoading, subscriptionLoading, hasAccess, hasTrialAccess]);
};
