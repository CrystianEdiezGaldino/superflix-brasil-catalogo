
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaCard from "@/components/MediaCard";
import { MediaItem } from "@/types/movie";

interface FavoritesTabProps {
  favorites: MediaItem[];
}

const FavoritesTab = ({ favorites }: FavoritesTabProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <CardContent className="pt-6">
        {favorites.length === 0 ? (
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
