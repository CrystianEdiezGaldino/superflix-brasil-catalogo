
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaCard from "@/components/MediaCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect } from "react";
import { MediaItem } from "@/types/movie";

const FavoritesTab = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, refetchFavorites } = useFavorites();

  useEffect(() => {
    if (refetchFavorites) {
      refetchFavorites();
    }
  }, [refetchFavorites]);

  // Converter favoritos (que são IDs) em objetos MediaItem
  const favoriteItems: MediaItem[] = favorites.map(id => ({
    id,
    title: `Item ${id}`,
    name: `Item ${id}`,
    overview: "",
    poster_path: "",
    backdrop_path: "",
    media_type: "movie" as const,
    vote_average: 0,
    vote_count: 0,
    release_date: "", // Necessário para Movie
    first_air_date: "", // Necessário para Series
    genres: [],
    networks: [],
    episode_run_time: [],
    original_language: ""
  }));

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
            {favoriteItems.map((media) => (
              <div key={`movie-${media.id}`}>
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
