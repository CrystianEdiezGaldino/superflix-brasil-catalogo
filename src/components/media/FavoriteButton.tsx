
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FavoriteButtonProps {
  mediaId: number;
  mediaType: string;
  className?: string;
}

const FavoriteButton = ({ mediaId, mediaType, className = "" }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite, isLoading } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Verificar se já é favorito
      const checkFavorite = async () => {
        try {
          const result = await isFavorite(mediaId, mediaType);
          setIsFav(result);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };
      
      checkFavorite();
    }
  }, [user, mediaId, mediaType, isFavorite]);
  
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Impede que o link pai seja ativado
    
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
      
      if (isFav) {
        await removeFromFavorites(mediaId, mediaType);
        setIsFav(false);
        toast.success("Removido dos favoritos");
      } else {
        await addToFavorites(mediaId, mediaType);
        setIsFav(true);
        toast.success("Adicionado aos favoritos");
      }
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
      onClick={toggleFavorite}
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
