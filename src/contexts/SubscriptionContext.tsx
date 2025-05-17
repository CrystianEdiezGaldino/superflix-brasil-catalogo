import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_id?: string;
  interval?: string;
  created_at: string;
  current_period_start?: string;
  current_period_end?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  updated_at?: string;
  plan_type?: string;
  trial_end?: string;
}

interface TempAccess {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  granted_by?: string;
  is_active?: boolean;
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
  checkSubscription: () => Promise<void>;
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

        if (subscriptionData) {
          // Ensure the subscription has the required fields
          const validSubscription: Subscription = {
            id: subscriptionData.id || '',
            user_id: subscriptionData.user_id || '',
            status: subscriptionData.status || '',
            created_at: subscriptionData.created_at || '',
            current_period_start: subscriptionData.current_period_start,
            current_period_end: subscriptionData.current_period_end,
            stripe_customer_id: subscriptionData.stripe_customer_id,
            stripe_subscription_id: subscriptionData.stripe_subscription_id,
            updated_at: subscriptionData.updated_at,
            plan_type: subscriptionData.plan_type,
            trial_end: subscriptionData.trial_end
          };
          
          setSubscription(validSubscription);
          
          // Check if subscription is valid based on dates
          const now = new Date();
          const isTrialValid = validSubscription.status === 'trialing' && 
                             validSubscription.trial_end && 
                             new Date(validSubscription.trial_end) > now;
          const isActiveValid = validSubscription.status === 'active' && 
                              validSubscription.current_period_end && 
                              new Date(validSubscription.current_period_end) > now;
          
          setIsSubscribed(isTrialValid || isActiveValid);
        } else {
          setSubscription(null);
          setIsSubscribed(false);
        }

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
          const isActive = expiryDate > now;
          
          setHasTempAccess(isActive);
          setTempAccess({
            ...tempAccessData,
            is_active: isActive
          });
        } else {
          setHasTempAccess(false);
          setTempAccess(null);
        }

        // Check if trial_access table exists and handle accordingly
        try {
          const { data: trialAccessData, error: trialAccessError } = await supabase
            .rpc('has_role', { 
              user_id: user.id,
              role: 'trial'
            });
            
          if (trialAccessError) {
            console.error("Erro ao verificar acesso de teste:", trialAccessError);
            setHasTrialAccess(false);
          } else {
            setHasTrialAccess(!!trialAccessData);
          }
        } catch (error) {
          console.error("Erro ao verificar acesso de teste:", error);
          setHasTrialAccess(false);
        }

        // Check admin role
        try {
          const { data: adminData, error: adminError } = await supabase
            .rpc('has_role', { 
              user_id: user.id,
              role: 'admin'
            });

          if (adminError) {
            console.error("Erro ao verificar status de admin:", adminError);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!adminData);
          }
        } catch (error) {
          console.error("Erro ao verificar status de admin:", error);
          setIsAdmin(false);
        }

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
    checkSubscription: checkSubscriptionStatus,
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
