import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
  isSubscribed: boolean;
  isAdmin: boolean;
  hasTempAccess: boolean;
  hasTrialAccess: boolean;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isAdmin: false,
  hasTempAccess: false,
  hasTrialAccess: false,
  isLoading: true,
  checkSubscription: async () => {}
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTempAccess, setHasTempAccess] = useState(false);
  const [hasTrialAccess, setHasTrialAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastCheckTime = useRef<number>(0);
  const checkTimeoutRef = useRef<NodeJS.Timeout>();

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setIsSubscribed(false);
      setIsAdmin(false);
      setHasTempAccess(false);
      setHasTrialAccess(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Check if user is admin using user_roles table
      const { data: adminData, error: adminError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (adminError && adminError.code !== "PGRST116") {
        console.error("Erro ao verificar admin:", adminError);
      }

      const isUserAdmin = !!adminData;
      setIsAdmin(isUserAdmin);

      // If user is admin, they have full access
      if (isUserAdmin) {
        setIsSubscribed(true);
        setHasTempAccess(false);
        setHasTrialAccess(false);
        setIsLoading(false);
        return;
      }

      // Check subscription status
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.error("Erro ao verificar assinatura:", subscriptionError);
      }

      const hasSubscription = !!subscriptionData;
      setIsSubscribed(hasSubscription);

      // If user has subscription, no need to check temp access
      if (hasSubscription) {
        setHasTempAccess(false);
        setHasTrialAccess(false);
        setIsLoading(false);
        return;
      }

      // Check trial access using user_roles table
      const { data: trialData, error: trialError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "trial")
        .single();

      if (trialError && trialError.code !== "PGRST116") {
        console.error("Erro ao verificar acesso trial:", trialError);
      }

      const hasTrial = !!trialData;
      setHasTrialAccess(hasTrial);

      // If user has trial access, no need to check temp access
      if (hasTrial) {
        setHasTempAccess(false);
        setIsLoading(false);
        return;
      }

      // Check temp access
      const { data: tempData, error: tempError } = await supabase
        .from("temp_access")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (tempError && tempError.code !== "PGRST116") {
        console.error("Erro ao buscar acesso temporário:", tempError);
      }

      setHasTempAccess(!!tempData);
    } catch (error) {
      console.error("Erro ao verificar status da assinatura:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;

    // Only check if more than 30 seconds have passed
    if (timeSinceLastCheck > 30000) {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }

      checkTimeoutRef.current = setTimeout(() => {
        checkSubscription();
        lastCheckTime.current = Date.now();
      }, 1000);
    }

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [user, checkSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isAdmin,
        hasTempAccess,
        hasTrialAccess,
        isLoading,
        checkSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
