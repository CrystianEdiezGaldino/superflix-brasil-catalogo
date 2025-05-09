import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/ui/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies, fetchPopularSeries, fetchAnime } from "@/services/tmdbApi";
import ContentPreview from "@/components/home/ContentPreview";
import MediaSection from "@/components/MediaSection";

const popularSeries = [
  { 
    id: 1, 
    name: "Eu, a Patroa e as Crianças", 
    poster_path: "/tXcJrFrSFVcpXTLcHAzU3AvlkUV.jpg", 
    media_type: "tv",
    vote_average: 8.3
  },
  { 
    id: 2, 
    name: "Dois Homens e Meio", 
    poster_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg", 
    media_type: "tv",
    vote_average: 7.8
  },
  { 
    id: 3, 
    name: "The Big Bang Theory", 
    poster_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg", 
    media_type: "tv",
    vote_average: 8.1
  },
  { 
    id: 4, 
    name: "Chaves", 
    poster_path: "/8D83nX7YFhR8YcvrJcnJ2PDgah5.jpg", 
    media_type: "tv",
    vote_average: 8.5
  },
  { 
    id: 5, 
    name: "Todo Mundo Odeia o Chris", 
    poster_path: "/3NbGsr4VgwugmZ7QA7k3SVIUeCo.jpg", 
    media_type: "tv",
    vote_average: 8.4
  },
  { 
    id: 6, 
    name: "Friends", 
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg", 
    media_type: "tv",
    vote_average: 8.4
  },
  { 
    id: 7, 
    name: "Um Maluco no Pedaço", 
    poster_path: "/1BmrF4J9fj2tT2zgfXrRnLQ1wWi.jpg", 
    media_type: "tv",
    vote_average: 8.2
  },
  { 
    id: 8, 
    name: "How I Met Your Mother", 
    poster_path: "/izncB6dCLV7LBQ5JcdNnUZt3vc9.jpg", 
    media_type: "tv",
    vote_average: 8.0
  },
  { 
    id: 9, 
    name: "That '70s Show", 
    poster_path: "/k2RjYOJ7nj68PwPJUzNueW6qGX5.jpg", 
    media_type: "tv",
    vote_average: 7.9
  },
  { 
    id: 10, 
    name: "Supernatural", 
    poster_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg", 
    media_type: "tv",
    vote_average: 8.3
  }
];

const popularAnimes = [
  {
    id: 11,
    name: "Naruto",
    poster_path: "/9ptbVZpKNy5NY9D4zq4KGiYWRQY.jpg",
    media_type: "tv",
    vote_average: 8.4,
    original_language: "ja"
  },
  {
    id: 12,
    name: "One Piece",
    poster_path: "/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg",
    media_type: "tv",
    vote_average: 8.7,
    original_language: "ja"
  },
  {
    id: 13,
    name: "Dragon Ball",
    poster_path: "/f2zhRLqwRLrKhEMeIM7Z5buJFo3.jpg",
    media_type: "tv",
    vote_average: 8.3,
    original_language: "ja"
  },
  {
    id: 14,
    name: "Attack on Titan",
    poster_path: "/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    media_type: "tv",
    vote_average: 8.7,
    original_language: "ja"
  },
  {
    id: 15,
    name: "Demon Slayer",
    poster_path: "/wrCVHdkBlBWdJUZPvnJWcBRuhSY.jpg",
    media_type: "tv",
    vote_average: 8.6,
    original_language: "ja"
  },
  {
    id: 16,
    name: "Death Note",
    poster_path: "/g8hHbsRmHxbDz7BT21cNjpBcFrn.jpg",
    media_type: "tv",
    vote_average: 8.5,
    original_language: "ja"
  },
  {
    id: 17,
    name: "Solo Leveling",
    poster_path: "/eCD7WS9h4lCT8N4Xavc9u8R1IGk.jpg",
    media_type: "tv",
    vote_average: 8.6,
    original_language: "ja"
  },
  {
    id: 18,
    name: "Jujutsu Kaisen",
    poster_path: "/hFWP5HkbVEe40adDOqgNy4kmQQy.jpg",
    media_type: "tv",
    vote_average: 8.5,
    original_language: "ja"
  },
  {
    id: 19,
    name: "Fullmetal Alchemist: Brotherhood",
    poster_path: "/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg",
    media_type: "tv",
    vote_average: 8.7,
    original_language: "ja"
  },
  {
    id: 20,
    name: "Sword Art Online",
    poster_path: "/ibe7AdW7CiabthEkJ4i9ZL1ITVb.jpg",
    media_type: "tv",
    vote_average: 7.9,
    original_language: "ja"
  }
];

const Auth = () => {
  const { user, loading } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState("");
  
  // Fetch content previews
  const { data: moviesPreview = [] } = useQuery({
    queryKey: ["authMoviesPreview"],
    queryFn: () => fetchPopularMovies(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  // Choose a random background from the fetched media
  useEffect(() => {
    const allMedia = [...moviesPreview, ...popularSeries, ...popularAnimes];
    if (allMedia.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      const randomMedia = allMedia[randomIndex];
      if (randomMedia.backdrop_path) {
        setBackgroundImage(`https://image.tmdb.org/t/p/original${randomMedia.backdrop_path}`);
      }
    }
  }, [moviesPreview]);
  
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
        <div className="mt-10 bg-black/50 py-10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white">Veja o que você está perdendo</h2>
              <p className="text-gray-300 mt-2">Crie sua conta para acessar todo o catálogo</p>
            </div>
            
            <ContentPreview 
              movies={moviesPreview}
              series={popularSeries}
              anime={popularAnimes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
