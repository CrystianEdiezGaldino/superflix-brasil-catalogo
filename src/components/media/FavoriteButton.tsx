
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
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Check if it's already a favorite
      setIsFav(isFavorite(mediaId));
    }
  }, [user, mediaId, isFavorite]);
  
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
      await toggleFavorite(mediaId, mediaType);
      setIsFav(!isFav);
      toast.success(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos");
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
      disabled={isLoading || isProcessing}
    >
      <Heart 
        size={16} 
        className={`text-white ${isFav ? 'fill-red-500' : ''}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
