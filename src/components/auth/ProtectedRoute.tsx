
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

  // If not authenticated, redirect to auth page once
  if (!user) {
    const redirectKey = `protected_redirect_${location.pathname}`;
    if (!sessionStorage.getItem(redirectKey)) {
      console.log("Usuário não autenticado em rota protegida, redirecionando para /auth");
      sessionStorage.setItem(redirectKey, "true");
      
      // Limpar flag após 2 segundos
      setTimeout(() => {
        sessionStorage.removeItem(redirectKey);
      }, 2000);
      
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
