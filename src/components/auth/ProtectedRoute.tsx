
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/home/LoadingState";
import { useEffect } from "react";
import { cacheManager } from "@/utils/cacheManager";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Usar sessionStorage para evitar redirecionamentos em loop
  const isRedirecting = sessionStorage.getItem("auth_redirecting") === "true";
  
  useEffect(() => {
    // Limpa flag de redirecionamento quando o componente é desmontado
    return () => {
      if (user) {
        sessionStorage.removeItem("auth_redirecting");
      }
    };
  }, [user]);

  // Show loading state while checking auth
  if (loading) {
    return <LoadingState />;
  }

  // Se estiver já no meio de um redirecionamento, não faça nada
  if (isRedirecting) {
    return <LoadingState message="Redirecionando..." />;
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated in ProtectedRoute, redirecting to /auth");
    
    // Define que está redirecionando para evitar loops
    sessionStorage.setItem("auth_redirecting", "true");
    
    // Limpar cache relacionado a conteúdo autenticado
    cacheManager.remove("userProfile");
    cacheManager.remove("userSubscription");
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Certificar que não está redirecionando
  sessionStorage.removeItem("auth_redirecting");

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
