import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState, useEffect, useMemo } from "react";

export const useAccessControl = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subLoading,
    checkSubscription
  } = useSubscription();

  const [hasAccess, setHasAccess] = useState(false);

  // Memoize the access calculation
  const userHasAccess = useMemo(() => {
    // Só permite acesso se tiver assinatura ativa, for admin, tiver acesso temporário ou estiver em período de teste
    if (!user) return false;
    return Boolean(isSubscribed || isAdmin || hasTempAccess || hasTrialAccess);
  }, [user, isSubscribed, isAdmin, hasTempAccess, hasTrialAccess]);

  // Update access state when necessary
  useEffect(() => {
    if (hasAccess !== userHasAccess) {
      setHasAccess(userHasAccess);
    }
  }, [userHasAccess, hasAccess]);
  
  return {
    user,
    authLoading,
    subscriptionLoading: subLoading,
    hasAccess,
    hasTrialAccess,
    isLoading: authLoading || subLoading
  };
};
