import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/services/tmdbApi";
import { getFilteredSeries } from "@/data/series";
import { getFilteredAnimes } from "@/data/animes";
import { selectRandomBackground } from "@/utils/backgroundSelector";
import AuthPageBanner from "@/components/auth/AuthPageBanner";
import AuthLegalSection from "@/components/auth/AuthLegalSection";
import AuthPreviewSection from "@/components/auth/AuthPreviewSection";
import { MediaItem } from "@/types/movie";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState<MediaItem | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);
  const forgotPasswordRef = useRef<HTMLButtonElement>(null);
  
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
  
  // Combine all content for background selection
  const allContent = [...filteredMovies, ...filteredSeries, ...filteredAnimes];
  
  // Select random background on mount and change it periodically
  useEffect(() => {
    let intervalId: number | undefined;
    
    // Set initial background
    const setInitialBackground = () => {
      const backgroundUrl = selectRandomBackground(allContent);
      if (backgroundUrl) {
        setBackgroundImage(backgroundUrl);
      }
    };

    // Change background periodically
    const startBackgroundRotation = () => {
      intervalId = window.setInterval(() => {
        const backgroundUrl = selectRandomBackground(allContent);
        if (backgroundUrl) {
          setBackgroundImage(backgroundUrl);
        }
      }, 15000); // Change every 15 seconds
    };

    // Set initial background and start rotation after a delay
    setInitialBackground();
    const timeoutId = setTimeout(startBackgroundRotation, 10000); // Start rotation after 10 seconds

    // Cleanup function
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
      clearTimeout(timeoutId);
    };
  }, [allContent]);
  
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
              navigate(redirectTo, { replace: true });
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
  }, [user, redirecting, navigate, redirectTo, loading]);
  
  // Display loading during authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white">Verificando autenticação...</p>
      </div>
    );
  }
  
  // If redirecting, show progress indicator
  if (redirecting) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <p className="text-white mb-4">Redirecionando...</p>
          <div className="w-64">
            <Progress value={progress} className="h-1 bg-gray-700" />
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Skip progress animation and redirect immediately if user is logged in
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <div 
      className="min-h-screen bg-netflix-background bg-cover bg-center transition-all duration-1000"
      style={{ 
        backgroundImage: backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('${backgroundImage}')`
          : "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/32c47234-8398-4a4f-a6b5-6803881d38bf/e407a21c-7792-4587-a748-69bfe400ae8d/BR-pt-20240422-popsignuptwoweeks-perspective_alpha_website_large.jpg')"
      }}
    >
      <Navbar onSearch={() => {}} />
      
      <div className="container max-w-full pt-14 pb-20">
        <div className="flex flex-col items-center justify-center mb-10">
          <AuthPageBanner />
          <div className="w-full max-w-md">
            <Card className="bg-black/75 border-gray-800 p-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    autoFocus
                    aria-label="Campo de email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Senha</Label>
                  <Input
                    ref={passwordRef}
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    aria-label="Campo de senha"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-gray-300">Código de Acesso (Opcional)</Label>
                    <Input
                      ref={codeRef}
                      id="code"
                      type="text"
                      placeholder="Digite o código de acesso (opcional)"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={isLoading}
                      className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                      aria-label="Campo de código de acesso (opcional)"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-300"
                  >
                    Eu concordo com os{" "}
                    <Link to="/terms" className="text-netflix-red hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link to="/privacy" className="text-netflix-red hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                <Button
                  ref={submitRef}
                  onClick={async () => {
                    if (!termsAccepted) {
                      toast.error("Você precisa aceitar os termos para continuar");
                      return;
                    }

                    setIsLoading(true);
                    try {
                      if (isLogin) {
                        await login(email, password);
                      } else {
                        await register(email, password, code);
                      }
                    } catch (error: any) {
                      toast.error(error.message || "Ocorreu um erro");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full bg-netflix-red hover:bg-red-700"
                >
                  {isLoading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
                </Button>

                <Button
                  ref={toggleRef}
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-gray-400 hover:text-white"
                  aria-label={isLogin ? "Botão para criar conta" : "Botão para fazer login"}
                >
                  {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
                </Button>

                {isLogin && (
                  <Button
                    ref={forgotPasswordRef}
                    variant="link"
                    className="w-full text-netflix-red hover:text-red-400"
                    aria-label="Botão de esqueceu a senha"
                  >
                    Esqueceu a senha?
                  </Button>
                )}
              </div>
            </Card>
          </div>
          <AuthLegalSection />
        </div>
        
        <AuthPreviewSection 
          movies={filteredMovies}
          series={filteredSeries}
          animes={filteredAnimes}
        />
      </div>
    </div>
  );
};

export default Auth;
