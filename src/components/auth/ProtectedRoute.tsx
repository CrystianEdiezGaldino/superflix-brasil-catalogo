
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/home/LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Handle case when AuthProvider isn't available
  let authData = { user: null, loading: true };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // If AuthProvider is not available, redirect to auth page
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  const { user, loading } = authData;

  // Show loading state while checking auth
  if (loading) {
    return <LoadingState />;
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated in ProtectedRoute, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
