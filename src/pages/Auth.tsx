
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/services/tmdbApi";
import { getFilteredSeries } from "@/data/series";
import { getFilteredAnimes } from "@/data/animes";
import { selectRandomBackground } from "@/utils/backgroundSelector";
import AuthPageBanner from "@/components/auth/AuthPageBanner";
import AuthLegalSection from "@/components/auth/AuthLegalSection";
import AuthPreviewSection from "@/components/auth/AuthPreviewSection";
import { MediaItem } from "@/types/movie";

const Auth = () => {
  const { user, loading } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState("");
  
  // Buscar dados de filmes populares
  const { data: moviesPreview = [] } = useQuery({
    queryKey: ["authMoviesPreview"],
    queryFn: () => fetchPopularMovies(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
  
  // Filtrar apenas conteúdos com imagens
  const filteredMovies = moviesPreview.filter(
    movie => movie.poster_path || movie.backdrop_path
  );
  const filteredSeries = getFilteredSeries();
  const filteredAnimes = getFilteredAnimes();
  
  // Escolher um fundo aleatório entre todos os conteúdos
  useEffect(() => {
    const allMedia: MediaItem[] = [
      ...filteredMovies, 
      ...filteredSeries, 
      ...filteredAnimes
    ];
    
    if (allMedia.length > 0) {
      const backgroundUrl = selectRandomBackground(allMedia);
      setBackgroundImage(backgroundUrl);
    }
  }, [filteredMovies, filteredSeries, filteredAnimes]);
  
  // Exibir loading durante o carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirecionar usuário logado para a página inicial
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div 
      className="min-h-screen bg-netflix-background bg-cover bg-center"
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
          <AuthForm />
          <AuthLegalSection />
        </div>
        
        {/* Preview Content Section */}
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
