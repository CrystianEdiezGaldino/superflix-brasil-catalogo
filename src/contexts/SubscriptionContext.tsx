
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
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

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

    // Prevent multiple rapid checks
    const now = Date.now();
    if (now - lastCheckTime < 1000) {
      console.log('Throttling subscription checks');
      return;
    }
    setLastCheckTime(now);
    
    setIsLoading(true);
    try {
      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        
        // On error, don't fail completely - retry or use cached data
        if (retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
          // Don't update state yet, will retry
        } else {
          // Show error after max retries
          toast.error('Erro ao verificar assinatura. Tentaremos novamente em breve.');
          // Keep the last known state
        }
      } else {
        // Reset retry counter on success
        setRetryCount(0);
        
        // Always update state regardless of response content
        // This ensures we have some state even if the function had issues
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
          subscriptionTier: data?.subscription_tier || null,
          user: user?.id
        });

        // If direct DB check is needed on API failure, implement as fallback
        if (!data?.hasActiveSubscription && !data?.isAdmin && !data?.has_trial_access) {
          try {
            // Direct database check for trial subscriptions and active subscriptions
            const { data: subData } = await supabase
              .from('subscriptions')
              .select('status, plan_type, trial_end')
              .eq('user_id', user.id)
              .or('status.eq.active,status.eq.trialing')
              .maybeSingle();
              
            if (subData) {
              console.log('Fallback subscription check found subscription:', subData);
              
              // Check if it's a trial subscription with valid trial date
              if (subData.status === 'trialing' && subData.trial_end) {
                const trialEndDate = new Date(subData.trial_end);
                const isTrialValid = trialEndDate > new Date();
                
                if (isTrialValid) {
                  console.log('Valid trial subscription found');
                  setHasTrialAccess(true);
                  setSubscriptionTier(subData.plan_type || 'trial');
                  setTrialEnd(subData.trial_end);
                }
              } else if (subData.status === 'active') {
                setIsSubscribed(true);
                setSubscriptionTier(subData.plan_type);
              }
            }
          } catch (dbError) {
            console.error('Fallback subscription check failed:', dbError);
          }
        }
      }
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
        console.log(`Retrying subscription check (attempt ${retryCount})...`);
        checkSubscription();
      }, retryDelay * retryCount); // Exponential backoff
      
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
