
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaCard from "@/components/MediaCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect } from "react";

const FavoritesTab = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, refetchFavorites } = useFavorites();

  useEffect(() => {
    // Only call refetchFavorites if it exists
    if (refetchFavorites) {
      refetchFavorites();
    }
  }, [refetchFavorites]);

  if (isLoading) {
    return (
      <Card className="bg-gray-900 text-white border-gray-700">
        <CardContent className="pt-6 flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <CardContent className="pt-6">
        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Você ainda não adicionou nenhum favorito</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Explorar Conteúdos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.map((media) => (
              <div key={`${media.media_type}-${media.id}`}>
                <MediaCard media={media} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesTab;
