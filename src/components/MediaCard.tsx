
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MediaCardProps {
  media: MediaItem;
}

const MediaCard = ({ media }: MediaCardProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "/placeholder.svg";
    
  const mediaLink = media.media_type === "movie"
    ? `/filme/${media.id}`
    : `/serie/${media.id}`;
    
  const mediaTitle = media.media_type === "movie" 
    ? media.title 
    : (media as any).name || "Sem título";

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("media_id", media.id)
        .eq("media_type", media.media_type)
        .single();
        
      setIsFavorite(!!data);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };
  
  // Check if favorite when component mounts
  useState(() => {
    checkIfFavorite();
  });

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Faça login para adicionar aos favoritos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("media_id", media.id)
          .eq("media_type", media.media_type);
          
        toast.info("Removido dos favoritos");
      } else {
        // Add to favorites
        await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            media_id: media.id,
            media_type: media.media_type,
            title: mediaTitle,
            poster_path: media.poster_path
          });
          
        toast.success("Adicionado aos favoritos");
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Erro ao atualizar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movie-card relative">
      <Link to={mediaLink}>
        <img
          src={posterUrl}
          alt={mediaTitle}
          className="rounded-md w-full h-auto object-cover"
          loading="lazy"
        />
        <div className="movie-info absolute inset-0 bg-black/75 flex flex-col justify-end p-2 rounded-md opacity-0 transition-opacity">
          <h3 className="text-white text-sm font-medium line-clamp-2">{mediaTitle}</h3>
          
          <button 
            onClick={toggleFavorite}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-netflix-red transition-colors"
          >
            <Heart 
              size={16} 
              className={isFavorite ? "fill-netflix-red text-netflix-red" : "text-white"} 
            />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
