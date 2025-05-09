
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import MediaCard from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Heart, Search, ArrowRight } from "lucide-react";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 24;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

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
        setFilteredFavorites(favoriteItems);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Erro ao carregar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleSearch = () => {
    setIsSearching(true);
    
    let results = [...favorites];
    
    if (searchQuery.trim() !== "") {
      results = favorites.filter(item => {
        const title = 'title' in item ? item.title : item.name;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (mediaTypeFilter !== "all") {
      results = results.filter(item => item.media_type === mediaTypeFilter);
    }
    
    setFilteredFavorites(results);
    setCurrentPage(1);
    setIsSearching(false);
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
      
      // Update both the full list and filtered list
      const updatedFavorites = favorites.filter(fav => 
        !(fav.id === mediaId && fav.media_type === mediaType)
      );
      setFavorites(updatedFavorites);
      
      const updatedFiltered = filteredFavorites.filter(fav => 
        !(fav.id === mediaId && fav.media_type === mediaType)
      );
      setFilteredFavorites(updatedFiltered);
      
      toast.success("Removido dos favoritos");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Erro ao remover dos favoritos");
    }
  };

  const loadMoreItems = () => {
    setCurrentPage(prev => prev + 1);
    if (currentPage * itemsPerPage >= filteredFavorites.length) {
      setHasMore(false);
    }
  };

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, filteredFavorites.length]);

  // Filter when mediaTypeFilter changes
  useEffect(() => {
    if (mediaTypeFilter === "all") {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(item => item.media_type === mediaTypeFilter);
      setFilteredFavorites(filtered);
    }
    setCurrentPage(1);
    setHasMore(true);
  }, [mediaTypeFilter, favorites]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setMediaTypeFilter("all");
    setFilteredFavorites(favorites);
    setCurrentPage(1);
    setHasMore(true);
  };

  // Get current items for pagination
  const currentItems = filteredFavorites.slice(0, currentPage * itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <Navbar onSearch={() => {}} />
        <div className="container max-w-full pt-28 pb-20 px-4 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <div className="container max-w-full pt-28 pb-20 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
          <Heart className="mr-2 text-netflix-red" /> Meus Favoritos
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-black/40 p-6 rounded-lg mb-8 backdrop-blur-sm border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-2">
              <Input 
                type="text" 
                placeholder="Pesquisar em favoritos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-netflix-red hover:bg-red-700"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={18} />
                )}
                <span className="ml-2 hidden md:inline">Pesquisar</span>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={mediaTypeFilter} onValueChange={setMediaTypeFilter}>
                <SelectTrigger className="w-[130px] bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Tipo de mídia" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="movie">Filmes</SelectItem>
                  <SelectItem value="tv">Séries/Animes</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="border-gray-700 text-white flex gap-2"
                onClick={resetFilters}
              >
                <Filter size={18} />
                <span className="hidden md:inline">Limpar Filtros</span>
              </Button>
            </div>
          </div>
        </div>
        
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
        ) : filteredFavorites.length === 0 ? (
          <Card className="bg-black/40 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 text-lg">Nenhum favorito corresponde aos filtros</p>
              <Button 
                onClick={resetFilters}
                variant="link" 
                className="text-netflix-red mt-2"
              >
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {currentItems.map((media, index) => (
                <div key={`${media.media_type}-${media.id}`} className="relative group movie-grid-item" style={{ '--delay': index } as React.CSSProperties}>
                  <MediaCard media={media} />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
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
            
            {/* Loading indicator for infinite scroll */}
            {hasMore && filteredFavorites.length > itemsPerPage && (
              <div ref={loadingRef} className="flex justify-center py-8">
                <Button 
                  onClick={loadMoreItems}
                  className="bg-netflix-red hover:bg-red-700 text-white"
                >
                  Carregar Mais <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
