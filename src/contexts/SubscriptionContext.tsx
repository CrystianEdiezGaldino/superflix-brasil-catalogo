
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  hasTempAccess: boolean;
  hasTrialAccess: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  trialEnd: string | null;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const checkSubscription = async () => {
    if (!user) {
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

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        // If we're within retry limits, increment counter and return without updating state
        if (retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
          return;
        } else {
          // After max retries, show toast but don't fail completely - use cached data if available
          toast.error('Erro ao verificar assinatura. Tentaremos novamente em breve.');
        }
      } else {
        // Reset retry counter on success
        setRetryCount(0);
      }
      
      // Verificar se o usuário tem uma assinatura ativa ou acesso temporário/trial
      setIsSubscribed(data?.hasActiveSubscription || false);
      setIsAdmin(data?.isAdmin || false);
      setHasTempAccess(data?.hasTempAccess || false);
      setHasTrialAccess(data?.has_trial_access || false);
      setSubscriptionTier(data?.subscription_tier || null);
      setSubscriptionEnd(data?.subscription_end || data?.tempAccess?.expires_at || null);
      setTrialEnd(data?.trial_end || null);
      
      console.log('Subscription check result:', {
        isSubscribed: data?.hasActiveSubscription || false,
        isAdmin: data?.isAdmin || false,
        hasTempAccess: data?.hasTempAccess || false,
        hasTrialAccess: data?.has_trial_access || false,
        subscriptionTier: data?.subscription_tier || null
      });
    } catch (error) {
      console.error('Failed to check subscription:', error);
      // Don't show toast on every error, only after max retries
      if (retryCount >= maxRetries) {
        toast.error('Erro ao verificar assinatura');
      }
      setRetryCount(retryCount + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription on user change
  useEffect(() => {
    checkSubscription();
  }, [user]);

  // Also check subscription every 5 minutes in case it changes externally
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Retry logic for initial load failures
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries && user) {
      const retryTimeout = setTimeout(() => {
        checkSubscription();
      }, 3000 * retryCount); // Exponential backoff
      
      return () => clearTimeout(retryTimeout);
    }
  }, [retryCount, user]);

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isSubscribed, 
        isLoading, 
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        subscriptionTier, 
        subscriptionEnd,
        trialEnd,
        checkSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
