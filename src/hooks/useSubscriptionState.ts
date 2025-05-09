
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
  
  const maxRetries = 3; // Maximum number of retries

  const checkSubscription = async () => {
    if (!user || !session) {
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
      const data = await checkSubscriptionStatus(user.id, session.access_token);
      
      if (!data) {
        // Handle error case
        setRetryCount(prev => handleSubscriptionError('No data returned', prev, maxRetries));
      } else {
        // Reset retry counter on success and process data
        setRetryCount(0);
        
        const subscriptionState = processSubscriptionData(data);
        setIsSubscribed(subscriptionState.isSubscribed);
        setIsAdmin(subscriptionState.isAdmin);
        setHasTempAccess(subscriptionState.hasTempAccess);
        setHasTrialAccess(subscriptionState.hasTrialAccess);
        setSubscriptionTier(subscriptionState.subscriptionTier);
        setSubscriptionEnd(subscriptionState.subscriptionEnd);
        setTrialEnd(subscriptionState.trialEnd);
      }
    } catch (error) {
      setRetryCount(prev => handleSubscriptionError(error, prev, maxRetries));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && visibilityChanged) {
        setVisibilityChanged(false);
        console.log("Tab visible again, maintaining subscription state");
        
        // Only recheck subscription after a longer period of absence (over 5 minutes)
        const storedTime = sessionStorage.getItem('subscriptionLastVisibleTime');
        const now = Date.now();
        if (storedTime && now - parseInt(storedTime) > 5 * 60 * 1000) {
          console.log("Tab was hidden for over 5 minutes, checking subscription");
          checkSubscription();
        }
      } else if (document.visibilityState === 'hidden') {
        setVisibilityChanged(true);
        sessionStorage.setItem('subscriptionLastVisibleTime', Date.now().toString());
        console.log("Tab hidden, storing time and maintaining subscription state");
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [visibilityChanged]);

  // Initial subscription check when user/session changes
  useEffect(() => {
    if (user && session && !visibilityChanged) {
      checkSubscription();
    }
  }, [user, session]);

  // Retry logic for initial load failures
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries && user && session && !visibilityChanged) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying subscription check (attempt ${retryCount})...`);
        checkSubscription();
      }, 3000 * retryCount); // Exponential backoff
      
      return () => clearTimeout(retryTimeout);
    }
  }, [retryCount, user, session]);

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
