
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { MediaItem, getMediaTitle } from "@/types/movie";
import { fetchMediaById } from "@/services/tmdbApi";
import Navbar from "@/components/Navbar";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, getAllFavorites } = useFavorites();
  const [favoriteItems, setFavoriteItems] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Function to fetch favorite media items
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

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavoriteItems();
  }, [favorites]);

  // Refetch favorites when needed
  const refetchFavorites = () => {
    fetchFavoriteItems();
  };

  const handleMediaClick = (media: MediaItem) => {
    if (!media || !media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar onSearch={() => {}} />
      
      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
        
        {isLoadingMedia ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
          </div>
        ) : favoriteItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium text-gray-200">Você ainda não adicionou favoritos</h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto">
              Adicione filmes e séries aos seus favoritos para acessá-los facilmente depois.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {favoriteItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={getMediaTitle(item)}
                  className="rounded-md w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <h3 className="text-white font-medium truncate">{getMediaTitle(item)}</h3>
                  <p className="text-sm text-gray-300">
                    {item.media_type === "movie" ? "Filme" : item.original_language === "ja" ? "Anime" : item.original_language === "ko" ? "Dorama" : "Série"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
