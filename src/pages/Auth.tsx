
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Film } from "lucide-react";

const Auth = () => {
  const { user, loading } = useAuth();
  
  // If user is already logged in, redirect to home
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div 
      className="min-h-screen bg-netflix-background bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/32c47234-8398-4a4f-a6b5-6803881d38bf/e407a21c-7792-4587-a748-69bfe400ae8d/BR-pt-20240422-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}
    >
      <Navbar onSearch={() => {}} />
      
      <div className="container max-w-full pt-20 pb-20">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-netflix-red rounded-full mb-4">
              <Film size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Acesse sua conta</h2>
            <p className="text-gray-300 mt-2">Assista a filmes, séries, animes e muito mais</p>
          </div>
          
          <AuthForm />
          
          <div className="mt-8 text-center max-w-md px-6">
            <p className="text-gray-400 text-sm">
              Ao fazer login ou criar uma conta, você concorda com nossos Termos de Uso e confirma que leu nossa Política de Privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
