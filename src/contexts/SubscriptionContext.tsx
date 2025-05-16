import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  interval: string;
  created_at: string;
}

interface TempAccess {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscription: Subscription | null;
  isAdmin: boolean;
  hasTempAccess: boolean;
  hasTrialAccess: boolean;
  tempAccess: TempAccess | null;
  isLoading: boolean;
  refreshSubscriptionStatus: () => void;
  // Remova qualquer propriedade recursiva aqui
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [tempAccess, setTempAccess] = useState<TempAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscriptionStatus = async () => {
    setIsLoading(true);
    if (user) {
      try {
        // Fetch subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscriptionError) {
          console.error("Erro ao buscar assinatura:", subscriptionError);
        }

        setSubscription(subscriptionData || null);
        setIsSubscribed(subscriptionData?.status === 'active' || false);

        // Fetch temp access data
        const { data: tempAccessData, error: tempAccessError } = await supabase
          .from('temp_access')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (tempAccessError) {
          console.error("Erro ao buscar acesso temporário:", tempAccessError);
        }

        if (tempAccessData) {
          const expiryDate = new Date(tempAccessData.expires_at);
          const now = new Date();
          setHasTempAccess(expiryDate > now);
          setTempAccess(tempAccessData);
        } else {
          setHasTempAccess(false);
          setTempAccess(null);
        }

        // Fetch trial access data (assuming you have a table for trial access)
        const { data: trialAccessData, error: trialAccessError } = await supabase
          .from('trial_access')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (trialAccessError) {
          console.error("Erro ao buscar acesso de teste:", trialAccessError);
        }

         if (trialAccessData) {
          const expiryDate = new Date(trialAccessData.expires_at);
          const now = new Date();
          setHasTrialAccess(expiryDate > now);
        } else {
          setHasTrialAccess(false);
        }

        // Check admin role
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(!!adminData);

      } catch (error) {
        console.error("Erro ao verificar status da assinatura:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setHasTrialAccess(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const refreshSubscriptionStatus = () => {
    checkSubscriptionStatus();
  };

  const value: SubscriptionContextType = {
    isSubscribed,
    subscription,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    tempAccess,
    isLoading,
    refreshSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
