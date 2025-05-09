
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "@/types/movie";
import { 
  fetchPopularMovies, 
  fetchPopularSeries, 
  fetchAnime, 
  fetchTopRatedAnime,
  fetchSpecificAnimeRecommendations,
  searchMedia, 
  fetchRecommendations 
} from "@/services/tmdbApi";

export const useHomePageData = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading, 
    trialEnd 
  } = useSubscription();
  
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar o conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Fetch popular movies
  const moviesQuery = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchPopularMovies(),
    enabled: !!user,
  });

  // Fetch popular TV series
  const seriesQuery = useQuery({
    queryKey: ["popularSeries"],
    queryFn: () => fetchPopularSeries(),
    enabled: !!user,
  });
  
  // Fetch popular anime
  const animeQuery = useQuery({
    queryKey: ["anime"],
    queryFn: () => fetchAnime(),
    enabled: !!user,
  });
  
  // Fetch top rated anime
  const topRatedAnimeQuery = useQuery({
    queryKey: ["topRatedAnime"],
    queryFn: () => fetchTopRatedAnime(),
    enabled: !!user && hasAccess, // Only fetch if user has access
  });
  
  // Fetch specific anime recommendations like Solo Leveling
  const specificAnimeQuery = useQuery({
    queryKey: ["specificAnimeRecommendations"],
    queryFn: () => fetchSpecificAnimeRecommendations(),
    enabled: !!user && hasAccess, // Only fetch if user has access
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
    if (!user) return;
    
    // If user has access to premium content, include all media
    if (hasAccess) {
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
      // Show preview content only
      const freeMedia = [
        ...(moviesQuery.data || []).slice(0, 2),
        ...(seriesQuery.data || []).slice(0, 2),
        ...(animeQuery.data || []).slice(0, 2)
      ];
      
      if (freeMedia.length > 0) {
        const randomIndex = Math.floor(Math.random() * freeMedia.length);
        setFeaturedMedia(freeMedia[randomIndex]);
      }
    }
  }, [
    user,
    hasAccess,
    moviesQuery.data, 
    seriesQuery.data, 
    animeQuery.data, 
    topRatedAnimeQuery.data, 
    specificAnimeQuery.data
  ]);

  // Search function
  const handleSearch = async (query: string) => {
    if (!user) {
      toast.error("É necessário fazer login para pesquisar");
      navigate("/auth");
      return;
    }
    
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
  const isLoading = authLoading || subscriptionLoading || moviesQuery.isPending || seriesQuery.isPending || animeQuery.isPending;
  const hasError = moviesQuery.isError || seriesQuery.isError || animeQuery.isError;
  
  return {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    trialEnd,
    searchResults,
    isSearching,
    featuredMedia,
    recommendations,
    moviesData: moviesQuery.data || [],
    seriesData: seriesQuery.data || [],
    animeData: animeQuery.data || [],
    topRatedAnimeData: topRatedAnimeQuery.data,
    specificAnimeData: specificAnimeQuery.data,
    isLoading,
    hasError,
    handleSearch,
  };
};
