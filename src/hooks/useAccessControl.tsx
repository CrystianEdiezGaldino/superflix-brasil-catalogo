
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

export const useAccessControl = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess, 
    hasTrialAccess, 
    isLoading: subscriptionLoading 
  } = useSubscription();

  // Check if user has access to premium content
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  return {
    user,
    authLoading,
    subscriptionLoading,
    hasAccess
  };
};
