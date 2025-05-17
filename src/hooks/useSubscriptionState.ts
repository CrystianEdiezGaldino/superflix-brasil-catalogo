import { useState, useEffect, useCallback, useRef } from 'react';
import { Session } from "@supabase/supabase-js";
import { checkSubscriptionStatus, processSubscriptionData } from '@/utils/subscriptionUtils';
import { toast } from "sonner";
import { cacheManager } from '@/utils/cacheManager';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 segundos

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

  const checkSubscription = useCallback(async () => {
    if (!user || !session || checkInProgressRef.current) return;
    
    const now = Date.now();
    if (now - lastCheckTimeRef.current < CHECK_INTERVAL) {
      return;
    }

    checkInProgressRef.current = true;
    lastCheckTimeRef.current = now;

    try {
      const data = await checkSubscriptionStatus(user.id, session.access_token);
      if (data) {
        const processedData = processSubscriptionData(data);
        
        setIsSubscribed(processedData.isSubscribed);
        setIsAdmin(processedData.isAdmin);
        setHasTempAccess(processedData.hasTempAccess);
        setHasTrialAccess(processedData.hasTrialAccess);
        setSubscriptionTier(processedData.subscriptionTier);
        setSubscriptionEnd(processedData.subscriptionEnd);
        setTrialEnd(processedData.trialEnd);
        
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(checkSubscription, RETRY_DELAY);
      } else {
        toast.error('Erro ao verificar status da assinatura. Tente novamente mais tarde.');
      }
    } finally {
      checkInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    if (user && session) {
      checkSubscription();
      
      const interval = setInterval(checkSubscription, CHECK_INTERVAL);
      return () => {
        clearInterval(interval);
        cacheManager.clear(); // Limpar cache ao desmontar
      };
    }
  }, [user, session, checkSubscription]);

  return {
    isSubscribed,
    isLoading,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    refreshSubscription: checkSubscription
  };
};
