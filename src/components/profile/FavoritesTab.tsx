
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { MediaItem } from "@/types/movie";
import { fetchMediaById } from "@/services/tmdbApi";
import { useQuery } from "@tanstack/react-query";

const FavoritesTab = () => {
  const { favorites, getAllFavorites } = useFavorites();
  const [favoriteItems, setFavoriteItems] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Fetch all favorites data
  const fetchFavoriteItems = async () => {
    setIsLoadingMedia(true);
    try {
      const favoriteIds = getAllFavorites();
      const mediaPromises = favoriteIds.map(id => fetchMediaById(id));
      const mediaItems = await Promise.all(mediaPromises);
      setFavoriteItems(mediaItems.filter(item => item !== null) as MediaItem[]);
    } catch (error) {
      console.error("Error fetching favorite items:", error);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavoriteItems();
  }, [favorites]);

  // Refetch favorites when needed
  const refetchFavorites = () => {
    fetchFavoriteItems();
  };

  if (isLoadingMedia) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-200">Sem favoritos ainda</h3>
        <p className="text-gray-400 mt-2">
          Adicione conteúdos aos seus favoritos para acessá-los facilmente depois.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {favoriteItems.map((item) => (
        <div key={item.id} className="relative group">
          <img
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={item.title || item.name}
            className="rounded-md w-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <h3 className="text-white font-medium">{item.title || item.name}</h3>
            <p className="text-sm text-gray-300">
              {item.media_type === "movie" ? "Filme" : "Série"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesTab;
