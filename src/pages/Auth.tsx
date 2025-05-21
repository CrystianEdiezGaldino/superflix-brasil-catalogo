
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/services/tmdbApi";
import { getFilteredSeries } from "@/data/series";
import { getFilteredAnimes } from "@/data/animes";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { FaGooglePlay, FaStar } from "react-icons/fa";
import AuthPageBanner from "@/components/auth/AuthPageBanner";
import AuthLegalSection from "@/components/auth/AuthLegalSection";
import AuthPreviewSection from "@/components/auth/AuthPreviewSection";
import { ShieldCheck, Star, TicketCheck } from "lucide-react";

const Auth = () => {
  const { user, loading, refreshSession } = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Get the intended redirect path from state, or default to home page
  const redirectTo = location.state?.from?.pathname || "/";
  
  // Buscar dados de filmes populares
  const { data: moviesPreview = [] } = useQuery({
    queryKey: ["authMoviesPreview"],
    queryFn: () => fetchPopularMovies(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
  
  // Filter only content with images
  const filteredMovies = moviesPreview.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = getFilteredSeries().filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnimes = getFilteredAnimes().filter(anime => anime.poster_path || anime.backdrop_path);

  // Improved user redirection with proper cleanup
  useEffect(() => {
    let intervalId: number | undefined;
    
    // Only redirect if user is logged in and not already redirecting
    if (user && !redirecting && !loading) {
      console.log("User authenticated, starting redirection process to:", redirectTo);
      setRedirecting(true);
      
      // Clear any redirect flags from session storage
      sessionStorage.removeItem('auth_redirect_shown');
      
      // Refresh session to ensure we have the most updated tokens
      refreshSession().catch(console.error);
      
      // Animate progress bar before redirecting
      intervalId = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            console.log("Progress complete, navigating to:", redirectTo);
            // Use setTimeout to ensure the progress completes visually before redirect
            setTimeout(() => {
              window.location.href = redirectTo;
            }, 50);
            return 100;
          }
          return newProgress;
        });
      }, 50);
    }
    
    // Cleanup function
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [user, redirecting, redirectTo, loading, refreshSession]);

  // Display loading during authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white">Verificando autenticação...</p>
      </div>
    );
  }

  // If user is already authenticated, redirect to home or intended destination
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Background Image - Desktop and Mobile */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/lovable-uploads/0173c088-feb1-4e22-92e7-40b5449b6501.png"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
        />
        <img 
          src="/lovable-uploads/9ea7cbed-ec65-4b2b-93c2-ea1d25d7e1cc.png"
          alt="Background Mobile"
          className="block md:hidden w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {redirecting && (
          <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
            <Progress value={progress} className="w-64 mb-4" />
            <p className="text-white">Redirecionando...</p>
          </div>
        )}

        <div className="container max-w-full pt-14 pb-20">
          <div className="flex flex-col items-center justify-center mb-10">
            <AuthPageBanner />
            <AuthForm />
            
            {/* VIP Membership Benefits */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-4 rounded-lg w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                <span>Benefícios de Membro VIP</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>Acesso antecipado a novos conteúdos</span>
                </li>
                <li className="flex items-center gap-2">
                  <TicketCheck className="h-4 w-4 text-blue-500" />
                  <span>Desconto especial quando a assinatura for lançada</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaStar className="h-4 w-4 text-yellow-400" />
                  <span>Suporte prioritário e recursos exclusivos</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-gray-400 italic">Criando sua conta hoje você automaticamente entra para nossa lista VIP!</p>
            </motion.div>
            
            <a 
              href="/naflixtv.apk"
              download
              className="mt-6 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 font-medium animate-pulse"
            >
              <FaGooglePlay className="text-2xl" />
              <div className="flex flex-col items-start">
                <span className="font-bold">Baixar App Android</span>
                <span className="text-xs opacity-90">Acesso mais rápido e sem anúncios!</span>
              </div>
            </a>
          </div>

          <div className="mt-8">
            <AuthPreviewSection 
              movies={filteredMovies.slice(0, 6)} 
              series={filteredSeries.slice(0, 6)}
              animes={filteredAnimes.slice(0, 6)}
            />
          </div>

          <AuthLegalSection />
        </div>
      </div>
    </div>
  );
};

export default Auth;
