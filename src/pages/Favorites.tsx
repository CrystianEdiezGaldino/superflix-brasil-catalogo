
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMediaSearch } from "@/hooks/useMediaSearch";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleSearch: originalHandleSearch } = useMediaSearch();

  // Handle search in this page
  const handleSearch = (query: string) => {
    if (query.trim()) {
      originalHandleSearch(query);
      navigate('/');
    }
  };

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        setIsLoading(true);
        // In a real app, we'd fetch from an API or database
        // For this demo, let's simulate a delayed response with some sample data
        setTimeout(() => {
          const mockFavorites: MediaItem[] = [
            {
              id: 1,
              title: "Example Movie",
              poster_path: "/placeholder.jpg",
              media_type: "movie",
              overview: "An example movie",
              backdrop_path: "/placeholder.jpg",
              vote_average: 8.5,
              release_date: "2023-01-01"
            },
            {
              id: 2,
              name: "Example Series",
              poster_path: "/placeholder.jpg",
              media_type: "tv",
              overview: "An example series",
              backdrop_path: "/placeholder.jpg",
              vote_average: 8.5,
              first_air_date: "2023-01-01",
              original_language: "en" // Add this property to fix the TypeScript error
            }
          ];
          
          setFavorites(mockFavorites);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      <div className="pt-24 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Seus Favoritos</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length > 0 ? (
          <MediaSection title="" media={favorites} isLoading={false} />
        ) : (
          <div className="text-center py-20 text-gray-400">
            <h3 className="text-xl mb-4">Nenhum favorito ainda</h3>
            <p>Adicione títulos aos seus favoritos para encontrá-los aqui!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
