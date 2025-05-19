
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast"; 

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
    
    // Usar uma key única para cada navegação para evitar loops
    const redirectKey = `redirect_${Date.now()}_${location.pathname}`;
    const hasAttemptedRedirect = sessionStorage.getItem("auth_redirect_attempt");
    
    if (user) {
      // Usuário autenticado
      if (isAuthPage && !hasAttemptedRedirect) {
        console.log("Usuário autenticado em página de auth, redirecionando para: /");
        sessionStorage.setItem("auth_redirect_attempt", "true");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
        
        // Limpar flag após navegação
        setTimeout(() => {
          sessionStorage.removeItem("auth_redirect_attempt");
        }, 3000);
      }
    } else if (!isAuthPage && !hasAttemptedRedirect) {
      // Usuário não autenticado em página protegida
      console.log("Usuário não autenticado, redirecionando para página de auth");
      sessionStorage.setItem("auth_redirect_attempt", "true");
      navigate("/auth", { state: { from: location }, replace: true });
      
      // Limpar flag após navegação
      setTimeout(() => {
        sessionStorage.removeItem("auth_redirect_attempt");
      }, 3000);
    }
  }, [user, authLoading, navigate, location]);
};
