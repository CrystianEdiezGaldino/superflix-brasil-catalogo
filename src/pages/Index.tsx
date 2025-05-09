
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import MediaSection from "@/components/MediaSection";
import { fetchPopularMovies, fetchPopularSeries, fetchAnime, searchMedia, fetchRecommendations } from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);

  // Buscar filmes populares com dublagem em português
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
  });

  // Buscar séries populares com dublagem em português
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
  });
  
  // Buscar anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
  });

  // Buscar favoritos e recomendações se usuário estiver logado
  useEffect(() => {
    const fetchFavoritesAndRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        return;
      }

      try {
        const { data: favorites, error } = await supabase
          .from("favorites")
          .select("media_id, media_type")
          .eq("user_id", user.id);

        if (error) throw error;

        if (favorites && favorites.length > 0) {
          // Separate movies and TV shows
          const movieIds = favorites
            .filter(fav => fav.media_type === "movie")
            .map(fav => fav.media_id);
            
          const tvIds = favorites
            .filter(fav => fav.media_type === "tv")
            .map(fav => fav.media_id);

          // Get recommendations based on favorites
          let recs: MediaItem[] = [];
          
          if (movieIds.length > 0) {
            const movieRecs = await fetchRecommendations(movieIds, "movie");
            recs = [...recs, ...movieRecs];
          }
          
          if (tvIds.length > 0) {
            const tvRecs = await fetchRecommendations(tvIds, "tv");
            recs = [...recs, ...tvRecs];
          }
          
          // Shuffle and limit recommendations
          setRecommendations(recs.slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavoritesAndRecommendations();
  }, [user]);

  // Selecionar um item aleatório para destaque
  useEffect(() => {
    const allMedia = [
      ...(moviesQuery.data || []),
      ...(seriesQuery.data || []),
      ...(animeQuery.data || [])
    ];
    
    if (allMedia.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      setFeaturedMedia(allMedia[randomIndex]);
    }
  }, [moviesQuery.data, seriesQuery.data, animeQuery.data]);

  // Função de pesquisa
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchMedia(query);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("Nenhum resultado encontrado para sua pesquisa.");
      }
    } catch (error) {
      console.error("Erro na pesquisa:", error);
      toast.error("Ocorreu um erro durante a pesquisa.");
    }
    setIsSearching(false);
  };

  // Limpar pesquisa ao retornar para a página inicial
  useEffect(() => {
    return () => {
      setSearchResults([]);
      setIsSearching(false);
    };
  }, []);

  // Estado de carregamento
  const isLoading = moviesQuery.isPending || seriesQuery.isPending || animeQuery.isPending;

  // Estado de erro
  const hasError = moviesQuery.isError || seriesQuery.isError || animeQuery.isError;
  
  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar conteúdo</h1>
          <p className="text-gray-400">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      {/* Banner principal */}
      <Banner media={featuredMedia} />
      
      <main className="container max-w-full pt-4 pb-20">
        {isSearching ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-4 px-4">Resultados da Pesquisa</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
              {searchResults.map((media) => (
                <div key={`${media.media_type}-${media.id}`}>
                  <MediaCard media={media} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Seções de conteúdo */}
            {user && recommendations.length > 0 && (
              <MediaSection 
                title="Recomendados para Você" 
                medias={recommendations} 
              />
            )}
            
            <MediaSection 
              title="Filmes Populares em Português" 
              medias={moviesQuery.data || []} 
            />
            
            <MediaSection 
              title="Séries Populares em Português" 
              medias={seriesQuery.data || []} 
            />
            
            <MediaSection 
              title="Anime" 
              medias={animeQuery.data || []} 
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
