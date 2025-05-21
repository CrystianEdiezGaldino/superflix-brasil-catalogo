import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useMemo } from "react";

export const useBaseMedia = () => {
  const { user } = useAuth();
  const { hasAccess } = useAccessControl();

  return useMemo(() => ({
    user,
    hasAccess,
    isUserAuthenticated: !!user
  }), [user, hasAccess]);
};
