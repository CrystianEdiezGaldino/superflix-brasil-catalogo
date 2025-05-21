
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
  const initialCheckDoneRef = useRef(false);

  const checkSubscription = useCallback(async (forceCheck = false) => {
    if (!user || !session || (checkInProgressRef.current && !forceCheck)) return;
    
    const now = Date.now();
    if (!forceCheck && now - lastCheckTimeRef.current < CHECK_INTERVAL) {
      return;
    }

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
      
      // Try first with direct database query
      const data = await checkSubscriptionStatus(user.id, session.access_token);
      
      // If we get data, process it
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
      } else {
        // Se falhar, defina valores padrão de acesso mais permissivos
        // Isso permite que o usuário ainda veja a página inicial mesmo com erro
        console.log("No subscription data found, using default values");
        setIsSubscribed(true); // Acesso temporário para não bloquear usuário
        setHasTrialAccess(true);
      }
      
      // Mark that initial check is complete
      initialCheckDoneRef.current = true;
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      
      // Mesmo em caso de erro, definimos valores permissivos para evitar bloqueios
      setIsSubscribed(true);
      setHasTrialAccess(true);
      
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => checkSubscription(forceCheck), RETRY_DELAY);
      } else {
        console.log("Maximum retries reached, continuing with default permissions");
      }
    } finally {
      checkInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [user, session]);

  // Initial check effect
  useEffect(() => {
    if (user && session && !initialCheckDoneRef.current) {
      console.log("Performing initial subscription check");
      checkSubscription(true); // Force check on initial load
    } else if (!user || !session) {
      // Cleanup states when no user
      setIsLoading(false);
    }
  }, [user, session, checkSubscription]);

  // Regular interval check effect
  useEffect(() => {
    if (user && session) {
      const interval = setInterval(() => checkSubscription(), CHECK_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    }
  }, [user, session, checkSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cacheManager.clear(); // Limpar cache ao desmontar
    };
  }, []);

  return {
    isSubscribed,
    isLoading,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    subscriptionTier,
    subscriptionEnd,
    trialEnd,
    refreshSubscription: () => checkSubscription(true) // Exported function always forces a check
  };
};
