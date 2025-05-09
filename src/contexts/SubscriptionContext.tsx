
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
  const [visibilityChanged, setVisibilityChanged] = useState(false);
  const maxRetries = 3; // Reduced from 5 to minimize retries
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

    // Prevent multiple rapid checks and don't check on tab visibility change
    const now = Date.now();
    if (now - lastCheckTime < 2000 || visibilityChanged) {
      console.log('Skipping subscription check - throttled or tab visibility change');
      return;
    }
    setLastCheckTime(now);
    
    setIsLoading(true);
    try {
      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        
        // Only retry a limited number of times
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        } else {
          toast.error('Erro ao verificar assinatura');
        }
      } else {
        // Reset retry counter on success
        setRetryCount(0);
        
        // Update state with subscription data
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
          trialEnd: data?.trial_end,
          user: user?.id
        });
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
      
      if (retryCount >= maxRetries) {
        toast.error('Erro ao verificar assinatura');
      }
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription when user changes (login/logout)
  useEffect(() => {
    // Only check if user exists and not during tab visibility changes
    if (user && !visibilityChanged) {
      checkSubscription();
    }
  }, [user]);

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

  // Retry logic for initial load failures - with reduced frequency
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries && user && !visibilityChanged) {
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
