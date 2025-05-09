
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionState } from '@/hooks/useSubscriptionState';

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
  const { user, session } = useAuth();
  const subscriptionState = useSubscriptionState(user, session);
  
  return (
    <SubscriptionContext.Provider value={subscriptionState}>
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
