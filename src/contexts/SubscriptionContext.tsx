
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useSubscriptionState } from "@/hooks/useSubscriptionState";

interface SubscriptionContextType {
  isSubscribed: boolean;
  isAdmin: boolean;
  hasTempAccess: boolean;
  hasTrialAccess: boolean;
  isLoading: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  trialEnd: string | null;
  subscription: { 
    plan_type: string | null;
    current_period_end: string | null;
  } | null;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
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
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();
  const { 
    isSubscribed, 
    isLoading, 
    isAdmin, 
    hasTempAccess, 
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    refreshSubscription 
  } = useSubscriptionState(user, session);

  // Create subscription object for Profile page
  const subscription = subscriptionTier ? {
    plan_type: subscriptionTier,
    current_period_end: subscriptionEnd
  } : null;

  const checkSubscription = useCallback(async () => {
    console.log("Manual subscription check requested");
    await refreshSubscription();
  }, [refreshSubscription]);

  // Console log subscription state changes for debugging
  const prevStateRef = useRef({ isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, subscriptionTier });
  useEffect(() => {
    const prevState = prevStateRef.current;
    if (
      prevState.isSubscribed !== isSubscribed ||
      prevState.isAdmin !== isAdmin ||
      prevState.hasTempAccess !== hasTempAccess || 
      prevState.hasTrialAccess !== hasTrialAccess ||
      prevState.subscriptionTier !== subscriptionTier
    ) {
      console.log("Subscription state changed:", {
        isSubscribed,
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        subscriptionTier,
        subscriptionEnd,
        trialEnd
      });
      
      // Update ref with current values for next comparison
      prevStateRef.current = { isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, subscriptionTier };
    }
  }, [isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, subscriptionTier, subscriptionEnd, trialEnd]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        isLoading,
        subscriptionTier,
        subscriptionEnd,
        trialEnd,
        subscription,
        checkSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
