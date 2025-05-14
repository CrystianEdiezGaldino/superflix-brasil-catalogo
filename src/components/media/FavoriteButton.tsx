
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

interface FavoriteButtonProps {
  mediaId: number;
  mediaType?: string; // Make mediaType optional with string type
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const FavoriteButton = ({
  mediaId,
  mediaType = "movie", // Default to "movie" if not provided
  size = "md",
  showText = false,
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (mediaId) {
      setIsFavorited(isFavorite(mediaId));
    }
  }, [mediaId, isFavorite]);

  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!mediaId) return;

    setIsLoading(true);
    try {
      toggleFavorite(mediaId);
      
      const newStatus = !isFavorited;
      setIsFavorited(newStatus);
      
      toast.success(
        newStatus
          ? "Adicionado aos seus favoritos"
          : "Removido dos seus favoritos"
      );
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isLoading}
      onClick={handleToggleFavorite}
      className={`rounded-full border border-white/20 bg-black/50 hover:bg-black/70 ${
        sizeClasses[size]
      } ${isFavorited ? "border-red-500" : ""}`}
    >
      <Heart
        size={iconSizes[size]}
        className={isFavorited ? "fill-netflix-red text-netflix-red" : "text-white"}
      />
      {showText && (
        <span className={`ml-2 ${isFavorited ? "text-red-500" : "text-white"}`}>
          {isFavorited ? "Favorito" : "Favoritar"}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
