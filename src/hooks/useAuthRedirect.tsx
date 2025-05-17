
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
    if (authLoading) {
      return;
    }

    const isAuthPage = location.pathname === "/auth";
    const isPublicRoute = ["/", "/filmes", "/series"].includes(location.pathname);
    
    // If user is not logged in and not on auth page or public route, redirect to auth
    if (!user && !isAuthPage && !isPublicRoute) {
      // Save current location for after login
      navigate("/auth", { state: { from: location }, replace: true });
    } else if (user && isAuthPage) {
      // If user is logged in and on auth page, redirect to home or saved location
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);
};
