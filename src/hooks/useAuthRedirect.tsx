
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast"; // Updated import

export const useAuthRedirect = (user: User | null, authLoading: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect from pages that aren't auth pages
  useEffect(() => {
    // Don't redirect if we're still loading
    const isAuthPage = location.pathname === "/auth";
    if (authLoading) {
      return;
    }

    // Only redirect to auth if not logged in and not on the auth page
    if (!user && !isAuthPage) {
      // Save current location for after login
      navigate("/auth", { state: { from: location }, replace: true });
    } else if (user && isAuthPage) {
      // If user is logged in and on auth page, redirect to home or saved location
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);
};
