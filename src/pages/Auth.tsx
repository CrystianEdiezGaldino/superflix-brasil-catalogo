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
import { QuickLogin } from "@/components/auth/QuickLogin";

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
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [autoShowQuickLogin, setAutoShowQuickLogin] = useState(false);
  const [quickLoginTimer, setQuickLoginTimer] = useState(30);
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
  
  // Choose a random background from all content with images
  useEffect(() => {
    const allMedia: MediaItem[] = [
      ...filteredMovies, 
      ...filteredSeries, 
      ...filteredAnimes
    ];
    
    if (allMedia.length > 0 && !selectedBackground) {
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      const selected = allMedia[randomIndex];
      setSelectedBackground(selected);
      
      if (selected.backdrop_path) {
        const backgroundUrl = `https://image.tmdb.org/t/p/original${selected.backdrop_path}`;
        setBackgroundImage(backgroundUrl);
      } else if (selected.poster_path) {
        const backgroundUrl = `https://image.tmdb.org/t/p/original${selected.poster_path}`;
        setBackgroundImage(backgroundUrl);
      }
    }
  }, [filteredMovies, filteredSeries, filteredAnimes, selectedBackground]);

  // Change background every 30 seconds
  useEffect(() => {
    if (!filteredMovies.length && !filteredSeries.length && !filteredAnimes.length) return;

    const interval = setInterval(() => {
      const allMedia: MediaItem[] = [
        ...filteredMovies, 
        ...filteredSeries, 
        ...filteredAnimes
      ];
      
      if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        const selected = allMedia[randomIndex];
        setSelectedBackground(selected);
        
        if (selected.backdrop_path) {
          const backgroundUrl = `https://image.tmdb.org/t/p/original${selected.backdrop_path}`;
          setBackgroundImage(backgroundUrl);
        } else if (selected.poster_path) {
          const backgroundUrl = `https://image.tmdb.org/t/p/original${selected.poster_path}`;
          setBackgroundImage(backgroundUrl);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [filteredMovies, filteredSeries, filteredAnimes]);
  
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
  
  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (focusedElement === 'email') {
            setFocusedElement('password');
            passwordRef.current?.focus();
          } else if (focusedElement === 'password' && !isLogin) {
            setFocusedElement('code');
            codeRef.current?.focus();
          } else if (focusedElement === 'code' || focusedElement === 'password') {
            setFocusedElement('terms');
            termsRef.current?.focus();
          } else if (focusedElement === 'terms') {
            setFocusedElement('submit');
            submitRef.current?.focus();
          } else if (focusedElement === 'submit') {
            setFocusedElement('toggle');
            toggleRef.current?.focus();
          } else if (focusedElement === 'toggle') {
            setFocusedElement('forgotPassword');
            forgotPasswordRef.current?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (focusedElement === 'password') {
            setFocusedElement('email');
            emailRef.current?.focus();
          } else if (focusedElement === 'code') {
            setFocusedElement('password');
            passwordRef.current?.focus();
          } else if (focusedElement === 'terms') {
            if (isLogin) {
              setFocusedElement('password');
              passwordRef.current?.focus();
            } else {
              setFocusedElement('code');
              codeRef.current?.focus();
            }
          } else if (focusedElement === 'submit') {
            setFocusedElement('terms');
            termsRef.current?.focus();
          } else if (focusedElement === 'toggle') {
            setFocusedElement('submit');
            submitRef.current?.focus();
          } else if (focusedElement === 'forgotPassword') {
            setFocusedElement('toggle');
            toggleRef.current?.focus();
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (focusedElement === 'submit') {
            setFocusedElement('terms');
            termsRef.current?.focus();
          } else if (focusedElement === 'toggle') {
            setFocusedElement('submit');
            submitRef.current?.focus();
          } else if (focusedElement === 'forgotPassword') {
            setFocusedElement('toggle');
            toggleRef.current?.focus();
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (focusedElement === 'terms') {
            setFocusedElement('submit');
            submitRef.current?.focus();
          } else if (focusedElement === 'submit') {
            setFocusedElement('toggle');
            toggleRef.current?.focus();
          } else if (focusedElement === 'toggle') {
            setFocusedElement('forgotPassword');
            forgotPasswordRef.current?.focus();
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedElement === 'submit') {
            handleSubmit();
          } else if (focusedElement === 'toggle') {
            setIsLogin(!isLogin);
          } else if (focusedElement === 'forgotPassword') {
            // Implementar lógica de "Esqueceu a senha?"
          } else if (focusedElement === 'terms') {
            setTermsAccepted(!termsAccepted);
          }
          break;

        case 'Backspace':
          e.preventDefault();
          window.history.back();
          break;

        case 'Escape':
          e.preventDefault();
          window.history.back();
          break;

        case 'Tab':
          e.preventDefault();
          // Navegação circular
          if (focusedElement === 'email') {
            setFocusedElement('password');
            passwordRef.current?.focus();
          } else if (focusedElement === 'password') {
            setFocusedElement('terms');
            termsRef.current?.focus();
          } else if (focusedElement === 'terms') {
            setFocusedElement('submit');
            submitRef.current?.focus();
          } else if (focusedElement === 'submit') {
            setFocusedElement('toggle');
            toggleRef.current?.focus();
          } else if (focusedElement === 'toggle') {
            setFocusedElement('forgotPassword');
            forgotPasswordRef.current?.focus();
          } else if (focusedElement === 'forgotPassword') {
            setFocusedElement('email');
            emailRef.current?.focus();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement, isLogin, termsAccepted]);

  // Adicionar classes de foco visível para TV
  const getFocusClasses = (element: string) => {
    return focusedElement === element 
      ? 'ring-2 ring-netflix-red ring-offset-2 ring-offset-black' 
      : '';
  };

  // Scroll automático para o formulário de login
  useEffect(() => {
    // Primeiro faz um scroll inicial para esconder o banner
    window.scrollTo({
      top: 300, // Ajuste este valor conforme necessário
      behavior: 'smooth'
    });

    // Depois faz o scroll para o formulário
    const loginForm = document.querySelector('.bg-black\\/75');
    if (loginForm) {
      setTimeout(() => {
        loginForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, []);

  // Focar no campo de email quando a página carregar
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
      setFocusedElement('email');
    }
  }, []);

  // Auto show quick login after 30 seconds
  useEffect(() => {
    if (user || showQuickLogin || autoShowQuickLogin) return;

    const timer = setInterval(() => {
      setQuickLoginTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAutoShowQuickLogin(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, showQuickLogin, autoShowQuickLogin]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Por favor, preencha email e senha");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // Se houver um código, valida ele
        if (code) {
          const { data: promoCode, error: promoError } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code)
            .single();

          if (promoError || !promoCode) {
            toast.error("Código de acesso inválido");
            setIsLoading(false);
            return;
          }
        }

        // Register with a default name based on email
        const defaultName = email.split('@')[0];
        await register(email, password, defaultName);
        
        // Get the current user after registration
        const { data: { user: newUser } } = await supabase.auth.getUser();
        
        if (newUser) {
          // Call the grant-trial-access function
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/grant-trial-access`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ userId: newUser.id })
          });

          if (!response.ok) {
            throw new Error('Failed to activate trial subscription');
          }

          toast.success("Conta criada com sucesso! Assinatura de teste ativada.");
        }
      }
      navigate("/");
    } catch (error) {
      console.error("Erro na autenticação:", error);
      toast.error(isLogin ? "Erro ao fazer login" : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };
  
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
            {showQuickLogin || autoShowQuickLogin ? (
              <QuickLogin onLogin={(session) => {
                navigate("/");
              }} />
            ) : (
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
                      className={`bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red ${getFocusClasses('email')}`}
                      onFocus={() => setFocusedElement('email')}
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
                      className={`bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red ${getFocusClasses('password')}`}
                      onFocus={() => setFocusedElement('password')}
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
                        className={`bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red ${getFocusClasses('code')}`}
                        onFocus={() => setFocusedElement('code')}
                        aria-label="Campo de código de acesso (opcional)"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      ref={termsRef}
                      id="terms"
                      checked={true}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className={`border-gray-600 data-[state=checked]:bg-netflix-red data-[state=checked]:border-netflix-red ${getFocusClasses('terms')}`}
                      onFocus={() => setFocusedElement('terms')}
                      aria-label="Aceitar termos de serviço"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-300">
                      Li e aceito os{" "}
                      <Link 
                        to="/termos-de-servico" 
                        className="text-netflix-red hover:underline"
                        target="_blank"
                      >
                        termos de serviço
                      </Link>
                      {" "}e{" "}
                      <Link 
                        to="/politica-de-privacidade" 
                        className="text-netflix-red hover:underline"
                        target="_blank"
                      >
                        política de privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button
                    ref={submitRef}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full bg-netflix-red hover:bg-red-700 ${getFocusClasses('submit')}`}
                    onFocus={() => setFocusedElement('submit')}
                    aria-label={isLogin ? "Botão de entrar" : "Botão de criar conta"}
                  >
                    {isLoading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
                  </Button>

                  <Button
                    ref={toggleRef}
                    variant="ghost"
                    onClick={() => setIsLogin(!isLogin)}
                    className={`w-full text-gray-400 hover:text-white ${getFocusClasses('toggle')}`}
                    onFocus={() => setFocusedElement('toggle')}
                    aria-label={isLogin ? "Botão para criar conta" : "Botão para fazer login"}
                  >
                    {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
                  </Button>

                  {isLogin && (
                    <>
                      <Button
                        ref={forgotPasswordRef}
                        variant="link"
                        className={`w-full text-netflix-red hover:text-red-400 ${getFocusClasses('forgotPassword')}`}
                        onFocus={() => setFocusedElement('forgotPassword')}
                        aria-label="Botão de esqueceu a senha"
                      >
                        Esqueceu a senha?
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-black/75 px-2 text-gray-400">ou</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          Login rápido disponível em {quickLoginTimer} segundos
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setShowQuickLogin(true)}
                          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          Login Rápido com Código
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
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
