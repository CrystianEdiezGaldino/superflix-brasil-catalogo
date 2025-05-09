
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies, fetchPopularSeries, fetchAnime } from "@/services/tmdbApi";
import ContentPreview from "@/components/home/ContentPreview";

const Auth = () => {
  const { user, loading } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState("");
  
  // Fetch content previews
  const { data: moviesPreview = [] } = useQuery({
    queryKey: ["authMoviesPreview"],
    queryFn: () => fetchPopularMovies(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  const { data: seriesPreview = [] } = useQuery({
    queryKey: ["authSeriesPreview"],
    queryFn: () => fetchPopularSeries(),
    staleTime: 1000 * 60 * 10,
  });
  
  const { data: animePreview = [] } = useQuery({
    queryKey: ["authAnimePreview"],
    queryFn: () => fetchAnime(),
    staleTime: 1000 * 60 * 10,
  });

  // Choose a random background from the fetched media
  useEffect(() => {
    const allMedia = [...moviesPreview, ...seriesPreview, ...animePreview];
    if (allMedia.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      const randomMedia = allMedia[randomIndex];
      if (randomMedia.backdrop_path) {
        setBackgroundImage(`https://image.tmdb.org/t/p/original${randomMedia.backdrop_path}`);
      }
    }
  }, [moviesPreview, seriesPreview, animePreview]);
  
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
      style={{ 
        backgroundImage: backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('${backgroundImage}')`
          : "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/32c47234-8398-4a4f-a6b5-6803881d38bf/e407a21c-7792-4587-a748-69bfe400ae8d/BR-pt-20240422-popsignuptwoweeks-perspective_alpha_website_large.jpg')"
      }}
    >
      <Navbar onSearch={() => {}} />
      
      <div className="container max-w-full pt-14 pb-20">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-netflix-red rounded-full mb-4">
              <Film size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Acesse sua conta</h2>
            <p className="text-xl text-gray-300 mt-2">Filmes, séries, animes e muito mais em um só lugar</p>
          </div>
          
          <AuthForm />
          
          <div className="mt-8 text-center max-w-md px-6">
            <p className="text-gray-400 text-sm">
              Ao fazer login ou criar uma conta, você concorda com nossos Termos de Uso e confirma que leu nossa Política de Privacidade.
            </p>
          </div>
        </div>
        
        {/* Preview Content Section */}
        {(moviesPreview.length > 0 || seriesPreview.length > 0 || animePreview.length > 0) && (
          <div className="mt-10 bg-black/50 py-10 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white">Veja o que você está perdendo</h2>
                <p className="text-gray-300 mt-2">Crie sua conta para acessar todo o catálogo</p>
              </div>
              
              <ContentPreview 
                movies={moviesPreview}
                series={seriesPreview}
                anime={animePreview}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
