
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast"; // Updated import

export const useAuthRedirect = (user: User | null, authLoading: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectAttemptedRef = useRef(false);

  // Only redirect from pages that aren't auth pages
  useEffect(() => {
    // Don't redirect if we're still loading
    const isAuthPage = location.pathname === "/auth";
    if (authLoading) {
      return;
    }

    // Prevent multiple redirect attempts
    if (redirectAttemptedRef.current) {
      return;
    }

    if (user) {
      console.log("User authenticated, starting redirection process to:", isAuthPage ? "/" : location.pathname);
      
      // Only redirect away from auth page if the user is logged in
      if (isAuthPage) {
        redirectAttemptedRef.current = true;
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else if (!isAuthPage) {
      // Only redirect to auth if not logged in and not already on the auth page
      console.log("User not authenticated, redirecting to auth page");
      redirectAttemptedRef.current = true;
      
      // Save current location for after login
      navigate("/auth", { state: { from: location }, replace: true });
    }
    
    // Reset the redirect flag when the pathname changes
    return () => {
      if (location.pathname !== "/auth") {
        redirectAttemptedRef.current = false;
      }
    };
  }, [user, authLoading, navigate, location]);
};
