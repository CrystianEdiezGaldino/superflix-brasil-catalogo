
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionContextType {
  isSubscribed: boolean;
  isAdmin: boolean;
  hasTempAccess: boolean;
  hasTrialAccess: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  trialEnd: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    try {
      // Verificar se o usuário é admin
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') throw roleError;

      const isUserAdmin = userRole?.role === 'admin';
      setIsAdmin(isUserAdmin);

      // Se for admin, não precisa verificar assinatura
      if (isUserAdmin) {
        setIsSubscribed(true);
        setHasTempAccess(false);
        setHasTrialAccess(false);
        setSubscriptionTier('admin');
        setSubscriptionEnd(null);
        setTrialEnd(null);
        setIsLoading(false);
        return;
      }

      // Verificar assinatura ativa (status pode ser 'active' OU 'trialing')
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') throw subscriptionError;

      if (subscription) {
        setIsSubscribed(true);
        setSubscriptionTier(subscription.plan_type);
        
        // Se for trial, definir como trial access
        if (subscription.status === 'trialing') {
          setHasTrialAccess(true);
          setTrialEnd(subscription.trial_end);
          setSubscriptionEnd(subscription.trial_end);
        } else {
          setHasTrialAccess(false);
          setTrialEnd(null);
          setSubscriptionEnd(subscription.current_period_end);
        }
        
        setHasTempAccess(false);
      } else {
        // Se não tem assinatura ativa ou em trial, verifica acesso temporário
        const { data: tempAccess, error: tempAccessError } = await supabase
          .from('temp_access')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (tempAccessError && tempAccessError.code !== 'PGRST116') throw tempAccessError;

        if (tempAccess) {
          setIsSubscribed(true);
          setHasTempAccess(true);
          setSubscriptionTier('temp');
          setSubscriptionEnd(tempAccess.expires_at);
          setHasTrialAccess(false);
          setTrialEnd(null);
        } else {
          setIsSubscribed(false);
          setHasTempAccess(false);
          setSubscriptionTier(null);
          setSubscriptionEnd(null);
          setHasTrialAccess(false);
          setTrialEnd(null);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setHasTrialAccess(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setTrialEnd(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        subscriptionTier,
        subscriptionEnd,
        trialEnd,
        isLoading,
        checkSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
