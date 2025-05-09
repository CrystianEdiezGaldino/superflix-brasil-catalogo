import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import MediaSection from "@/components/MediaSection";
import { 
  fetchPopularMovies, 
  fetchPopularSeries, 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchSpecificAnimeRecommendations,
  searchMedia, 
  fetchRecommendations 
} from "@/services/tmdbApi";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MediaCard from "@/components/MediaCard";

const Index = () => {
  const { user } = useAuth();
  const { isSubscribed, isAdmin, hasTempAccess } = useSubscription();
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);

  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
  });

  // Fetch popular TV series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
  });
  
  // Fetch popular anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
  });
  
  // Fetch top rated anime
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(),
    enabled: isSubscribed || isAdmin || hasTempAccess, // Only fetch if user has access
  });
  
  // Fetch specific anime recommendations like Solo Leveling
  const specificAnimeQuery = useQuery({
    queryKey: ["specificAnimeRecommendations"],
    queryFn: () => fetchSpecificAnimeRecommendations(),
    enabled: isSubscribed || isAdmin || hasTempAccess, // Only fetch if user has access
  });

  // Fetch favorites and recommendations for logged-in users
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

  // Select a random item for the banner
  useEffect(() => {
    // If user has access to premium content, include all media
    // Otherwise, only use free content for the banner
    if (isSubscribed || isAdmin || hasTempAccess) {
      const allMedia = [
        ...(moviesQuery.data || []),
        ...(seriesQuery.data || []),
        ...(animeQuery.data || []),
        ...(topRatedAnimeQuery.data || []),
        ...(specificAnimeQuery.data || [])
      ];
      
      if (allMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMedia.length);
        setFeaturedMedia(allMedia[randomIndex]);
      }
    } else {
      const freeMedia = [
        ...(moviesQuery.data || []).slice(0, 5),
        ...(seriesQuery.data || []).slice(0, 5),
        ...(animeQuery.data || []).slice(0, 5)
      ];
      
      if (freeMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * freeMedia.length);
        setFeaturedMedia(freeMedia[randomIndex]);
      }
    }
  }, [
    moviesQuery.data, 
    seriesQuery.data, 
    animeQuery.data, 
    topRatedAnimeQuery.data, 
    specificAnimeQuery.data,
    isSubscribed,
    isAdmin,
    hasTempAccess
  ]);

  // Search function
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

  // Clear search when leaving the page
  useEffect(() => {
    return () => {
      setSearchResults([]);
      setIsSearching(false);
    };
  }, []);

  // Loading and error states
  const isLoading = moviesQuery.isPending || seriesQuery.isPending || animeQuery.isPending;
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
      
      {/* Upsell for non-subscribers */}
      {!isSubscribed && !isAdmin && !hasTempAccess && (
        <div className="bg-gradient-to-r from-netflix-red to-red-800 py-6 px-4 mb-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Assine para acessar todo o conteúdo!</h3>
              <p className="text-white/90">Planos a partir de R$9,90/mês com 7 dias grátis.</p>
            </div>
            <Link to="/subscribe">
              <Button className="bg-white text-netflix-red hover:bg-gray-100">
                Assinar Agora
              </Button>
            </Link>
          </div>
        </div>
      )}
      
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
            {/* Admin indicator */}
            {isAdmin && (
              <div className="mb-6 px-4">
                <Link to="/admin">
                  <Button variant="outline" className="border-netflix-red text-netflix-red hover:bg-netflix-red/20">
                    Acessar Painel de Administração
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Seções de conteúdo */}
            {user && recommendations.length > 0 && (
              <MediaSection 
                title="Recomendados para Você" 
                medias={recommendations} 
              />
            )}
            
            <MediaSection 
              title="Filmes Populares" 
              medias={moviesQuery.data || []} 
            />
            
            <MediaSection 
              title="Séries Populares" 
              medias={seriesQuery.data || []} 
            />
            
            {/* Enhanced Anime Sections */}
            <MediaSection 
              title="Anime em Alta" 
              medias={animeQuery.data || []} 
            />
            
            {/* Premium content - only for subscribers */}
            {(isSubscribed || isAdmin || hasTempAccess) && topRatedAnimeQuery.data && (
              <MediaSection 
                title="Animes Melhor Avaliados" 
                medias={topRatedAnimeQuery.data} 
              />
            )}
            
            {/* Specific anime recommendations featuring Solo Leveling */}
            {(isSubscribed || isAdmin || hasTempAccess) && specificAnimeQuery.data && (
              <MediaSection 
                title="Semelhantes a Solo Leveling" 
                medias={specificAnimeQuery.data} 
              />
            )}
            
            {/* Subscription upsell section */}
            {!isSubscribed && !isAdmin && !hasTempAccess && (
              <div className="px-4 py-8 mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mx-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Acesse conteúdo exclusivo!</h2>
                  <p className="text-gray-300 mb-6">
                    Assine agora e tenha acesso a mais animes, incluindo as coleções completas e recomendações personalizadas.
                  </p>
                  <Link to="/subscribe">
                    <Button size="lg" className="px-8 py-6 text-lg">
                      Ver Planos de Assinatura
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
