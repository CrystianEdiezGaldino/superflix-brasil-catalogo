
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

interface FavoriteButtonProps {
  mediaId: number;
  mediaType: string;
  className?: string;
}

const FavoriteButton = ({ mediaId, mediaType, className = "" }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Convert the mediaId to string for our favorites system
  const strMediaId = String(mediaId);
  
  useEffect(() => {
    if (user) {
      // Check if it's already a favorite
      setIsFav(isFavorite(strMediaId, mediaType as any));
    }
  }, [user, strMediaId, mediaType, isFavorite]);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent parent link activation
    
    if (!user) {
      toast.info("Faça login para adicionar aos favoritos", {
        action: {
          label: "Login",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      toggleFavorite(strMediaId, mediaType as any);
      
      if (isFav) {
        toast.success("Removido dos favoritos");
      } else {
        toast.success("Adicionado aos favoritos");
      }
      
      setIsFav(!isFav);
    } catch (error) {
      console.error("Erro ao gerenciar favoritos:", error);
      toast.error("Erro ao atualizar favoritos");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Button 
      className={`absolute top-2 right-2 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-netflix-red ${className}`}
      onClick={handleToggleFavorite}
      variant="ghost"
      size="sm"
      disabled={isProcessing}
    >
      <Heart 
        size={16} 
        className={`text-white ${isFav ? 'fill-red-500' : ''}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
