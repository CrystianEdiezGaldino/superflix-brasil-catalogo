
import { useState, useEffect } from 'react';
import { Session } from "@supabase/supabase-js";
import { checkSubscriptionStatus, shouldThrottleCheck, handleSubscriptionError, processSubscriptionData } from '@/utils/subscriptionUtils';

export const useSubscriptionState = (user: any, session: Session | null) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [visibilityChanged, setVisibilityChanged] = useState(false);
  
  const maxRetries = 5; // Aumentando o número máximo de tentativas

  const checkSubscription = async () => {
    if (!user || !session) {
      console.log("Cannot check subscription: No user or session");
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setHasTrialAccess(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setTrialEnd(null);
      setIsLoading(false);
      return;
    }

    // Prevent multiple rapid checks and don't check on tab visibility change
    if (shouldThrottleCheck(lastCheckTime, visibilityChanged)) {
      return;
    }
    
    setLastCheckTime(Date.now());
    setIsLoading(true);
    
    try {
      console.log(`Checking subscription for user ${user.id}`);
      const data = await checkSubscriptionStatus(user.id, session.access_token);
      
      if (!data) {
        // Handle error case
        setRetryCount(prev => handleSubscriptionError('No data returned', prev, maxRetries));
      } else {
        // Reset retry counter on success and process data
        setRetryCount(0);
        
        const subscriptionState = processSubscriptionData(data);
        
        console.log("Processed subscription data:", subscriptionState);
        
        setIsSubscribed(subscriptionState.isSubscribed);
        setIsAdmin(subscriptionState.isAdmin);
        setHasTempAccess(subscriptionState.hasTempAccess);
        setHasTrialAccess(subscriptionState.hasTrialAccess);
        setSubscriptionTier(subscriptionState.subscriptionTier);
        setSubscriptionEnd(subscriptionState.subscriptionEnd);
        setTrialEnd(subscriptionState.trialEnd);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setRetryCount(prev => handleSubscriptionError(error, prev, maxRetries));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (visibilityChanged) {
          setVisibilityChanged(false);
          console.log("Tab visible again, checking subscription");
          checkSubscription();
        }
      } else if (document.visibilityState === 'hidden') {
        setVisibilityChanged(true);
        console.log("Tab hidden");
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [visibilityChanged]);

  // Initial subscription check when user/session changes
  useEffect(() => {
    if (user && session) {
      console.log("User or session changed, checking subscription");
      checkSubscription();
    }
  }, [user, session]);

  // Retry logic for initial load failures
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries && user && session) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying subscription check (attempt ${retryCount})...`);
        checkSubscription();
      }, 2000 * retryCount); // Exponential backoff
      
      return () => clearTimeout(retryTimeout);
    }
  }, [retryCount, user, session]);

  // Adicionar verificação periódica para garantir que o estado da assinatura esteja sempre atualizado
  useEffect(() => {
    if (user && session) {
      const periodicCheck = setInterval(() => {
        console.log("Performing periodic subscription check");
        checkSubscription();
      }, 5 * 60 * 1000); // Verificar a cada 5 minutos
      
      return () => clearInterval(periodicCheck);
    }
  }, [user, session]);

  return {
    isSubscribed,
    isLoading,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    checkSubscription
  };
};
