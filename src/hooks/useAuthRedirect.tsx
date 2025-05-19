
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { cacheManager } from "@/utils/cacheManager";

const REDIRECT_FLAG = "auth_redirect_handled";
const REDIRECT_TIMESTAMP = "auth_redirect_timestamp";
const REDIRECT_COOLDOWN = 2000; // 2 segundos de cooldown entre redirecionamentos

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

    // Verificar se já redirecionou recentemente
    const lastRedirect = parseInt(sessionStorage.getItem(REDIRECT_TIMESTAMP) || "0");
    const now = Date.now();
    
    if (now - lastRedirect < REDIRECT_COOLDOWN) {
      console.log("Redirecionamento recente, aguardando cooldown...");
      return;
    }

    // Prevent multiple redirect attempts in the same session
    const hasRedirected = sessionStorage.getItem(REDIRECT_FLAG) === "true";
    if (redirectAttemptedRef.current || hasRedirected) {
      return;
    }

    if (user) {
      console.log("User authenticated, starting redirection process to:", isAuthPage ? "/" : location.pathname);
      
      // Only redirect away from auth page if the user is logged in
      if (isAuthPage) {
        redirectAttemptedRef.current = true;
        sessionStorage.setItem(REDIRECT_FLAG, "true");
        sessionStorage.setItem(REDIRECT_TIMESTAMP, now.toString());
        
        // Pre-aquecer cache
        cacheManager.set("isLoggedIn", true, 30 * 60 * 1000); // 30 minutos
        
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else if (!isAuthPage) {
      // Only redirect to auth if not logged in and not already on the auth page
      console.log("User not authenticated, redirecting to auth page");
      redirectAttemptedRef.current = true;
      sessionStorage.setItem(REDIRECT_FLAG, "true");
      sessionStorage.setItem(REDIRECT_TIMESTAMP, now.toString());
      
      // Save current location for after login
      navigate("/auth", { state: { from: location }, replace: true });
    }
    
    // Reset the redirect flag when the pathname changes
    return () => {
      if (location.pathname !== "/auth") {
        sessionStorage.removeItem(REDIRECT_FLAG);
        redirectAttemptedRef.current = false;
      }
    };
  }, [user, authLoading, navigate, location]);
};
