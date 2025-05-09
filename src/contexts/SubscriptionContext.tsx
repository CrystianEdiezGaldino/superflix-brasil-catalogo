
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  hasTempAccess: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user) {
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        toast.error('Erro ao verificar assinatura');
        return;
      }
      
      setIsSubscribed(data.subscribed);
      setIsAdmin(data.is_admin || false);
      setHasTempAccess(data.has_temp_access || false);
      setSubscriptionTier(data.subscription_tier || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Failed to check subscription:', error);
      toast.error('Erro ao verificar assinatura');
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

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isSubscribed, 
        isLoading, 
        isAdmin,
        hasTempAccess,
        subscriptionTier, 
        subscriptionEnd,
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
