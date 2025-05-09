
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
  // Enhanced access check to properly handle trial subscriptions
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Add debug logging to track access control decisions
  console.log("Access control check:", {
    user: !!user,
    isSubscribed,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    hasAccess
  });

  return {
    user,
    authLoading,
    subscriptionLoading,
    hasAccess
  };
};
