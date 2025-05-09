
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import MediaGrid from "@/components/media/MediaGrid";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const { user } = useAuth();
  const { getFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        toast.error("Erro ao carregar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, getFavorites]);

  const handleClearFavorites = () => {
    // Em uma implementação real, você chamaria uma função para limpar favoritos no backend
    setFavorites([]);
    toast.success("Favoritos limpos com sucesso");
  };

  // Placeholder para estado vazio de favoritos
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
        <Navbar onSearch={() => {}} />
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
      <Navbar onSearch={() => {}} />
      
      <div className="pt-20 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Meus Favoritos</h1>
          {favorites.length > 0 && (
            <Button 
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={handleClearFavorites}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length > 0 ? (
          <MediaGrid 
            mediaItems={favorites}
            isLoading={false}
            isLoadingMore={false}
            hasMore={false}
            isSearching={false}
            isFiltering={false}
            onLoadMore={() => {}}
            onResetFilters={() => {}}
          />
        ) : (
          <EmptyFavoritesPlaceholder />
        )}
      </div>
    </div>
  );
};

export default Favorites;
