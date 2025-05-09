import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import MediaSection from "@/components/MediaSection";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Just keeping the structure without implementing actual favorites functionality

const Favorites = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<MediaItem[]>([]);

  // Mock query for demonstration purposes
  const { isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      // This would be replaced with actual favorites fetching logic
      return [];
    },
    enabled: !!user,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveFromFavorites = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  // Placeholder for empty favorites
  const EmptyFavoritesPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-800 p-6 rounded-full mb-6">
        <Heart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Sua lista de favoritos está vazia</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Adicione filmes, séries e doramas aos seus favoritos para encontrá-los aqui.
      </p>
      <Button 
        onClick={() => window.location.href = "/"}
        className="bg-white text-black hover:bg-gray-200"
      >
        Explorar Conteúdo
      </Button>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={handleSearch} />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Faça login para acessar seus favoritos
          </h2>
          <Button 
            onClick={() => window.location.href = "/auth"}
            className="bg-netflix-red hover:bg-red-700"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-20 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Meus Favoritos</h1>
          {favorites.length > 0 && (
            <Button 
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setFavorites([])}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-white">Carregando...</div>
        ) : favorites.length > 0 ? (
          <MediaSection 
            title="Conteúdo Salvo" 
            medias={favorites}
            isLoading={false}
          />
        ) : (
          <EmptyFavoritesPlaceholder />
        )}
      </div>
    </div>
  );
};

export default Favorites;
