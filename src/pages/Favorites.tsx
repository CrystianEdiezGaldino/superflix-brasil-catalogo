
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import MediaCard from "@/components/MediaCard";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        // Convert to MediaItem format
        const favoriteItems: MediaItem[] = data.map((fav: any) => {
          if (fav.media_type === "movie") {
            return {
              id: fav.media_id,
              title: fav.title,
              poster_path: fav.poster_path,
              media_type: "movie",
              overview: "",
              backdrop_path: "",
              vote_average: 0,
              release_date: ""
            };
          } else {
            return {
              id: fav.media_id,
              name: fav.title,
              poster_path: fav.poster_path,
              media_type: "tv",
              overview: "",
              backdrop_path: "",
              vote_average: 0,
              first_air_date: ""
            };
          }
        });

        setFavorites(favoriteItems);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Erro ao carregar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveFavorite = async (mediaId: number, mediaType: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ 
          user_id: user!.id,
          media_id: mediaId,
          media_type: mediaType 
        });

      if (error) throw error;
      
      setFavorites(favorites.filter(fav => 
        !(fav.id === mediaId && fav.media_type === mediaType)
      ));
      
      toast.success("Removido dos favoritos");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Erro ao remover dos favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={handleSearch} />
        <div className="container max-w-full pt-28 pb-20 px-4 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="container max-w-full pt-28 pb-20 px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Meus Favoritos</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">Você ainda não adicionou nenhum favorito</p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Explorar Conteúdos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((media) => (
              <div key={`${media.media_type}-${media.id}`} className="relative group">
                <MediaCard media={media} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveFavorite(media.id, media.media_type)}
                    className="z-10"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
