import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useMemo } from "react";

export const useBaseMedia = () => {
  const { user } = useAuth();
  const { hasAccess } = useAccessControl();

  // Memoize the return value to prevent unnecessary recalculations
  return useMemo(() => {
    // Debug log user access status
    console.log("useBaseMedia access status:", { hasAccess, userId: user?.id });

    return {
      user,
      hasAccess,
      isUserAuthenticated: !!user
    };
  }, [user, hasAccess]);
};
