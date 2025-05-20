
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/services/tmdbApi";
import { getFilteredSeries } from "@/data/series";
import { getFilteredAnimes } from "@/data/animes";
import { MediaItem } from "@/types/movie";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { FaGooglePlay } from "react-icons/fa";
import AuthPageBanner from "@/components/auth/AuthPageBanner";
import AuthLegalSection from "@/components/auth/AuthLegalSection";
import AuthPreviewSection from "@/components/auth/AuthPreviewSection";

const Auth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Get the intended redirect path from state, or default to home page
  const redirectTo = location.state?.from?.pathname || "/";
  
  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  }, [user, redirecting, redirectTo, loading]);

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
            <a 
              href="/naflixtv.apk"
              download
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-netflix-red hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            >
              <FaGooglePlay className="text-xl" />
              <span>Baixar App</span>
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
