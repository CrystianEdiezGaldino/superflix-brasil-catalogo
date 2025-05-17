import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { MediaItem, getMediaTitle, isMovie, isSeries, Movie, Series } from "@/types/movie";
import { fetchMovieDetails } from "@/services/tmdb/movies";
import { fetchSeriesDetails } from "@/services/tmdb/series";
import Navbar from "@/components/Navbar";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, isLoading } = useFavorites();
  const [favoriteItems, setFavoriteItems] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [focusedItem, setFocusedItem] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Function to fetch favorite media items
  const fetchFavoriteItems = async () => {
    setIsLoadingMedia(true);
    try {
      // Buscar informações atualizadas do TMDB para cada item
      const updatedItems = await Promise.all(
        favorites.map(async (item) => {
          try {
            let mediaInfo;
            if (isMovie(item)) {
              mediaInfo = await fetchMovieDetails(item.id.toString());
              if (mediaInfo) {
                mediaInfo = { ...mediaInfo, media_type: 'movie' } as Movie;
              }
            } else if (isSeries(item)) {
              mediaInfo = await fetchSeriesDetails(item.id.toString());
              if (mediaInfo) {
                mediaInfo = { ...mediaInfo, media_type: 'tv' } as Series;
              }
            }
            return mediaInfo || item;
          } catch (error) {
            console.error(`Erro ao buscar informações do item ${item.id}:`, error);
            return item;
          }
        })
      );
      setFavoriteItems(updatedItems);
    } catch (error) {
      console.error("Error fetching favorite items:", error);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Fetch favorites on mount and when favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteItems();
    } else {
      setFavoriteItems([]);
    }
  }, [favorites]);

  // Navegação por controle de TV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsPerRow = window.innerWidth >= 1280 ? 6 : 
                         window.innerWidth >= 1024 ? 5 : 
                         window.innerWidth >= 768 ? 4 : 
                         window.innerWidth >= 640 ? 3 : 2;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + 1, favoriteItems.length - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedItem(prev => Math.min(prev + itemsPerRow, favoriteItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedItem(prev => Math.max(prev - itemsPerRow, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (favoriteItems[focusedItem]) {
            handleMediaClick(favoriteItems[focusedItem]);
          }
          break;
        case 'Backspace':
          e.preventDefault();
          navigate(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItem, favoriteItems, navigate]);

  const handleMediaClick = (media: MediaItem) => {
    console.log('Item clicado:', media);
    
    if (!media || !media.id) {
      console.error('Mídia inválida:', media);
      return;
    }

    // Verifica o tipo de mídia e redireciona para a rota correta
    if (isSeries(media)) {
      console.log('Redirecionando para série:', media.id);
      navigate(`/serie/${media.id}`);
    } else if (isMovie(media)) {
      console.log('Redirecionando para filme:', media.id);
      navigate(`/filme/${media.id}`);
    } else {
      console.error('Tipo de mídia desconhecido:', media);
    }
  };

  const getMediaTypeLabel = (item: MediaItem): string => {
    if (isSeries(item)) {
      if (item.original_language === 'ko') return 'Dorama';
      if (item.original_language === 'ja') return 'Anime';
      return 'Série';
    }
    return 'Filme';
  };

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar onSearch={() => {}} />
      
      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
        
        {isLoading || isLoadingMedia ? (
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
          <div 
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {favoriteItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`relative group cursor-pointer ${
                  index === focusedItem ? 'ring-2 ring-netflix-red scale-105' : ''
                }`}
                onClick={() => handleMediaClick(item)}
                tabIndex={index === focusedItem ? 0 : -1}
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
                    {getMediaTypeLabel(item)}
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
