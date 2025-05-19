
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/home/LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return <LoadingState />;
  }

  // Se não estiver autenticado e não tiver uma flag de redirecionamento, redireciona uma vez
  if (!user) {
    const redirectKey = `protected_redirect_${location.pathname}`;
    const hasRedirected = sessionStorage.getItem(redirectKey);
    
    if (!hasRedirected) {
      console.log("Usuário não autenticado em rota protegida, redirecionando para /auth");
      sessionStorage.setItem(redirectKey, "true");
      
      // Limpar flag após timeout
      setTimeout(() => {
        sessionStorage.removeItem(redirectKey);
      }, 5000);
      
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
