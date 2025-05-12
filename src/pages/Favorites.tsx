
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MediaSection from "@/components/MediaSection";
import { MediaItem } from "@/types/movie";

const Favorites = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { favorites, isLoading, refetchFavorites } = useFavorites();
  
  // Create a placeholder array of MediaItems from favorite IDs
  const favoriteItems: MediaItem[] = favorites.map(id => ({
    id,
    title: `Item ${id}`,
    name: `Item ${id}`,
    overview: "",
    poster_path: "",
    backdrop_path: "",
    media_type: "movie",
    vote_average: 0,
    vote_count: 0,
    first_air_date: "",
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: ""
  }));

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar esta página");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Refresh favorites when component mounts
  useEffect(() => {
    if (refetchFavorites) {
      refetchFavorites();
    }
  }, [refetchFavorites]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Meus Favoritos
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Você ainda não adicionou nenhum título aos favoritos.
            </p>
          </div>
        ) : (
          <MediaSection 
            title="Favoritos"
            medias={favoriteItems}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;
