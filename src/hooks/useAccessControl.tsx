
import { useState, useEffect } from "react";

export const useAccessControl = () => {
  // Try/catch prevents circular dependencies
  let user = null;
  let authLoading = true;
  
  try {
    // Avoid directly importing useAuth to prevent circular dependencies
    // We'll still handle authentication gracefully
    const AuthContext = require("@/contexts/AuthContext");
    if (AuthContext && typeof AuthContext.useAuth === 'function') {
      const auth = AuthContext.useAuth();
      user = auth.user;
      authLoading = auth.loading;
    }
  } catch (error) {
    console.warn("Auth context unavailable in useAccessControl, using default values");
  }
  
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  
  // Default subscription values
  const isAdmin = false;
  const hasTempAccess = false;
  const hasTrialAccess = false;
  
  useEffect(() => {
    // Set subscription loading to false after a short delay
    const timer = setTimeout(() => {
      setSubscriptionLoading(false);
      
      // For non-authenticated users, provide limited access
      if (!user) {
        setHasAccess(false);
      } else {
        // For authenticated users, they have at least basic access
        setHasAccess(true);
      }
    }, 300);
    
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
