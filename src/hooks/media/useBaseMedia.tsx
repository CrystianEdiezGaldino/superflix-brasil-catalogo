
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/hooks/useAccessControl";

export const useBaseMedia = () => {
  const { user } = useAuth();
  const { hasAccess } = useAccessControl();

  // Debug log user access status
  console.log("useBaseMedia access status:", { hasAccess, userId: user?.id });

  return {
    user,
    hasAccess,
    isUserAuthenticated: !!user
  };
};
