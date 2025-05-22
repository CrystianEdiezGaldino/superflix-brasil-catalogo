
import { useState, useEffect, useCallback, useRef } from 'react';
import { Session } from "@supabase/supabase-js";
import { checkSubscriptionStatus, processSubscriptionData } from '@/utils/subscriptionUtils';
import { toast } from "sonner";
import { cacheManager } from '@/utils/cacheManager';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

export const useSubscriptionState = (user: any, session: Session | null) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  
  const retryCountRef = useRef(0);
  const lastCheckTimeRef = useRef(0);
  const checkInProgressRef = useRef(false);
  const initialCheckDoneRef = useRef(false);
  const totalChecksRef = useRef(0);
  const maxChecksRef = useRef(10); // Limit to 10 checks per session to prevent infinite loops

  const checkSubscription = useCallback(async (forceCheck = false) => {
    // Skip if conditions aren't met or check is already running
    if (!user || !session || (checkInProgressRef.current && !forceCheck)) return;
    
    // Check if we've reached the maximum number of checks
    if (totalChecksRef.current >= maxChecksRef.current && !forceCheck) {
      console.log("Maximum subscription checks reached, skipping");
      return;
    }
    
    const now = Date.now();
    if (!forceCheck && now - lastCheckTimeRef.current < CHECK_INTERVAL) {
      return;
    }
    
    totalChecksRef.current += 1;
    checkInProgressRef.current = true;
    lastCheckTimeRef.current = now;

    try {
      console.log("Checking subscription status for user:", user.id);
      setIsLoading(true);
      
      // Clear cache when forcing check to ensure fresh data
      if (forceCheck) {
        const cacheKey = `subscription_${user.id}`;
        cacheManager.remove(cacheKey);
        console.log("Force check requested, cleared subscription cache");
      }
      
      // Get subscription data
      const accessToken = session?.access_token || '';
      const data = await checkSubscriptionStatus(user.id, accessToken);
      
      // Process the data
      if (data) {
        const processedData = processSubscriptionData(data);
        
        console.log("Subscription status:", processedData);
        
        setIsSubscribed(processedData.isSubscribed);
        setIsAdmin(processedData.isAdmin);
        setHasTempAccess(processedData.hasTempAccess);
        setHasTrialAccess(processedData.hasTrialAccess);
        setSubscriptionTier(processedData.subscriptionTier);
        setSubscriptionEnd(processedData.subscriptionEnd);
        setTrialEnd(processedData.trialEnd);
        
        retryCountRef.current = 0;
      }
      
      // Mark that initial check is complete
      initialCheckDoneRef.current = true;
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      
      // Don't use permissive values on error
      setIsSubscribed(false);
      setHasTrialAccess(false);
      
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => checkSubscription(forceCheck), RETRY_DELAY);
      } else {
        console.log("Max retries reached for subscription check");
        // After max retries, mark initial check as done anyway to prevent blocking UI
        initialCheckDoneRef.current = true;
      }
    } finally {
      checkInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [user, session]);

  // Safety timeout to prevent indefinite loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached - forcing completion");
        setIsLoading(false);
        initialCheckDoneRef.current = true;
      }
    }, 10000); // 10 seconds max loading time
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Initial check effect - use setTimeout to avoid cyclic updates
  useEffect(() => {
    let isMounted = true;
    
    if (user && session && !initialCheckDoneRef.current) {
      console.log("Scheduling initial subscription check");
      
      // Use setTimeout to defer the check and avoid causing cycle
      const timer = setTimeout(() => {
        if (isMounted && !initialCheckDoneRef.current) {
          console.log("Performing initial subscription check");
          checkSubscription(true); // Force check on initial load
        }
      }, 1000);
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    } else if (!user || !session) {
      // Cleanup states when no user
      setIsLoading(false);
      initialCheckDoneRef.current = false;
      totalChecksRef.current = 0;
    }
    
    return () => { isMounted = false; };
  }, [user, session, checkSubscription]);

  // Regular interval check effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (user && session && initialCheckDoneRef.current) {
      intervalId = setInterval(() => {
        // Don't use checkSubscription directly in interval to prevent stale closure
        if (user && session && !checkInProgressRef.current) {
          const now = Date.now();
          if (now - lastCheckTimeRef.current >= CHECK_INTERVAL) {
            console.log("Performing scheduled subscription check");
            checkSubscription(false);
          }
        }
      }, CHECK_INTERVAL);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, session, checkSubscription, initialCheckDoneRef.current]);

  return {
    isSubscribed,
    isLoading,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    refreshSubscription: () => checkSubscription(true) // Always force check
  };
};
