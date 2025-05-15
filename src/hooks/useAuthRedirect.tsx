
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast"; // Updated import

export const useAuthRedirect = (user: User | null, authLoading: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect from pages that aren't auth pages
  useEffect(() => {
    // Don't redirect if we're already on the auth page or still loading
    const isAuthPage = location.pathname === "/auth";
    if (authLoading || isAuthPage) {
      return;
    }

    // Only redirect to auth if not logged in and not on the auth page
    if (!user && !isAuthPage) {
      // Prevent multiple toasts
      const shouldShowToast = !sessionStorage.getItem('auth_redirect_shown');
      if (shouldShowToast) {
        toast({
          variant: "destructive",
          title: "Autenticação necessária",
          description: "É necessário fazer login para acessar o conteúdo"
        });
        sessionStorage.setItem('auth_redirect_shown', 'true');
      }
      
      // Save current location for after login
      navigate("/auth", { state: { from: location }, replace: true });
    } else if (user && isAuthPage) {
      // If user is logged in and on auth page, redirect to home
      navigate("/", { replace: true });
    } else if (user) {
      // Clear the redirect flag when user is logged in
      sessionStorage.removeItem('auth_redirect_shown');
    }
  }, [user, authLoading, navigate, location]);
};
