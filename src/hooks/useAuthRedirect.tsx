
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

    // Configuração para evitar loops de redirecionamento
    const redirectKey = `redirect_${location.pathname}`;
    const hasRedirected = sessionStorage.getItem(redirectKey);

    if (user) {
      // Usuário autenticado
      if (isAuthPage && !hasRedirected) {
        console.log("Usuário autenticado em página de auth, redirecionando para: /");
        sessionStorage.setItem(redirectKey, "true");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else if (!isAuthPage && !hasRedirected) {
      // Usuário não autenticado em página protegida
      console.log("Usuário não autenticado, redirecionando para página de auth");
      sessionStorage.setItem(redirectKey, "true");
      navigate("/auth", { state: { from: location }, replace: true });
    }
    
    // Limpar flag de redirecionamento após 1 segundo
    const timer = setTimeout(() => {
      sessionStorage.removeItem(redirectKey);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [user, authLoading, navigate, location]);
};
