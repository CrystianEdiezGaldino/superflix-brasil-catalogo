
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export const useAccessControl = () => {
  // Safely attempt to use the auth context
  let user = null;
  let authLoading = true;

  try {
    // This will throw if not within AuthProvider
    const authContext = useAuth();
    user = authContext.user;
    authLoading = authContext.loading;
  } catch (error) {
    console.warn("Auth context unavailable, using default values");
    // We already set default values above, so no need to do anything here
  }
  
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  // Default subscription values
  const isSubscribed = false;
  const isAdmin = false;
  const hasTempAccess = false;
  const hasTrialAccess = false;
  
  // Try to get subscription data
  let subscriptionData = { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess, 
    hasTrialAccess, 
    isLoading: true 
  };
  
  useEffect(() => {
    // Set subscription loading to false after a short delay
    // In a real app, this would be when actual subscription data is loaded
    const timer = setTimeout(() => {
      setSubscriptionLoading(false);
      
      // For non-authenticated users, provide limited access
      if (!user) {
        setHasAccess(false);
      } else {
        // For authenticated users, they have at least basic access
        setHasAccess(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);

  return {
    user,
    authLoading,
    subscriptionLoading,
    hasAccess,
    isAdmin,
    hasTempAccess,
    hasTrialAccess,
    isLoading: authLoading || subscriptionLoading
  };
};
