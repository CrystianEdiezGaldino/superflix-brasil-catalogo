
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesDetails, fetchSeasonDetails } from "@/services/tmdb/series";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import AnimeHeader from "@/components/anime/AnimeHeader";
import AnimeContent from "@/components/anime/AnimeContent";
import AnimeActions from "@/components/anime/AnimeActions";
import AnimeLoadingState from "@/components/anime/AnimeLoadingState";
import ContentNotAvailable from "@/components/ContentNotAvailable";
import AdblockSuggestion from "@/components/AdblockSuggestion";
import SuperFlixPlayer from "@/components/series/SuperFlixPlayer";
import AnimeRecommendations from "@/components/anime/AnimeRecommendations";
import { Series, MediaItem } from "@/types/movie";

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
  const [recommendationsPage, setRecommendationsPage] = useState(1);
  const [isLoadingMoreRecommendations, setIsLoadingMoreRecommendations] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { 
    isSubscribed, 
    isAdmin, 
    hasTempAccess,
    hasTrialAccess,
    isLoading: subscriptionLoading 
  } = useSubscription();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

  // Memoize player options to prevent unnecessary re-renders
  const playerOptions = useMemo(() => ({
    transparent: true,
    noLink: true,
    noEpList: true
  }), []);

  const { data: anime, isLoading, error } = useQuery({
    queryKey: ["anime", id],
    queryFn: () => fetchSeriesDetails(id as string, 'pt-BR'),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Configurar o Intersection Observer para carregamento automático de recomendações
  useEffect(() => {
    if (!anime) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMoreRecommendations && anime.recommendations?.results.length) {
        handleLoadMoreRecommendations();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoadingMoreRecommendations, anime]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário fazer login para acessar este conteúdo");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch season data
  const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
    queryKey: ["anime-season", id, selectedSeason],
    queryFn: () => fetchSeasonDetails(id as string, selectedSeason),
    enabled: !!id && !!anime,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Carregar mais recomendações
  const handleLoadMoreRecommendations = async () => {
    if (isLoadingMoreRecommendations || !anime) return;

    setIsLoadingMoreRecommendations(true);
    try {
      // Simular carregamento de mais recomendações
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRecommendations = await fetchSeriesDetails(id as string, 'pt-BR');
      if (newRecommendations?.recommendations?.results) {
        anime.recommendations.results = [
          ...anime.recommendations.results,
          ...newRecommendations.recommendations.results
        ];
        setRecommendationsPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao carregar mais recomendações:", error);
      toast.error("Erro ao carregar mais recomendações");
    } finally {
      setIsLoadingMoreRecommendations(false);
    }
  };

  // Verify if content is available
  useEffect(() => {
    if (anime && !anime.external_ids?.imdb_id) {
      setIsContentAvailable(false);
    } else {
      setIsContentAvailable(true);
    }
  }, [anime]);

  // Scroll to player when it becomes visible or when episode changes
  useEffect(() => {
    if (showPlayer) {
      const playerElement = document.getElementById('SuperFlixAPIContainerVideo');
      if (playerElement) {
        setTimeout(() => {
          playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [showPlayer, selectedEpisode]);

  // Handle season change
  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  // Handle episode selection
  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    
    // Scroll to player after a short delay to ensure it's rendered
    setTimeout(() => {
      const playerElement = document.getElementById('SuperFlixAPIContainerVideo');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle recommendation click - new function to handle MediaItem parameter
  const handleRecommendationClick = (media: MediaItem) => {
    // Navigate to the anime details page for the selected recommendation
    navigate(`/anime/${media.id}`);
  };

  // Show subscription modal if trying to watch without access
  const handleWatchClick = () => {
    if (!hasAccess) {
      toast.error("É necessário ter uma assinatura para assistir");
      navigate("/subscribe");
    } else {
      setShowPlayer(!showPlayer);
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    if (anime) {
      if (isFavorite(anime.id)) {
        removeFromFavorites(anime.id, user?.id);
        toast.success("Removido dos favoritos");
      } else {
        addToFavorites(anime.id, user?.id);
        toast.success("Adicionado aos favoritos");
      }
    }
  };

  // Efeito para voltar ao topo quando a página carregar
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]); // Executa quando o ID do anime mudar

  if (isLoading || !anime) {
    return <AnimeLoadingState isLoading={true} hasUser={!!user} hasError={false} />;
  }

  // Create seasons array based on anime data
  const seasons = anime.number_of_seasons 
    ? Array.from({ length: anime.number_of_seasons }, (_, i) => i + 1) 
    : [1];

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-netflix-background pointer-events-none" />
        
        <AnimeLoadingState 
          isLoading={authLoading || subscriptionLoading || isLoading}
          hasUser={!!user}
          hasError={!!error || !anime}
        />

        {anime && (
          <div className="relative z-10">
            <div className="max-w-[2000px] mx-auto">
              <AnimeHeader 
                anime={anime} 
                isFavorite={isFavorite(anime.id)} 
                toggleFavorite={handleToggleFavorite} 
              />

              <div className="px-4 sm:px-6 md:px-10 lg:px-16">
                <AdblockSuggestion />
              </div>

              <div className="px-4 sm:px-6 md:px-10 lg:px-16 mb-6 sm:mb-8">
                <AnimeActions 
                  showPlayer={showPlayer} 
                  hasAccess={hasAccess} 
                  togglePlayer={handleWatchClick}
                  isFavorite={isFavorite(anime.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>

              {showPlayer && (
                <div className="px-4 sm:px-6 md:px-10 lg:px-16 mb-8 sm:mb-12">
                  <div className="max-w-7xl mx-auto">
                    <div id="SuperFlixAPIContainerVideo" className="aspect-[16/9] sm:aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                      <SuperFlixPlayer
                        key={`player-${anime.id}-${selectedSeason}-${selectedEpisode}`}
                        type="serie"
                        imdb={anime.id.toString()}
                        season={selectedSeason}
                        episode={selectedEpisode}
                        options={playerOptions}
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isContentAvailable && (
                <div className="px-4 sm:px-6 md:px-10 lg:px-16 mb-8 sm:mb-12">
                  <div className="max-w-7xl mx-auto">
                    <ContentNotAvailable onAddToFavorites={handleToggleFavorite} />
                  </div>
                </div>
              )}

              <div className="px-4 sm:px-6 md:px-10 lg:px-16 mb-8 sm:mb-12">
                <div className="max-w-7xl mx-auto">
                  <AnimeContent 
                    anime={anime} 
                    hasAccess={hasAccess}
                    seasonData={seasonData}
                    selectedSeason={selectedSeason}
                    selectedEpisode={selectedEpisode}
                    seasons={seasons}
                    setSelectedSeason={handleSeasonChange}
                    handleEpisodeSelect={handleEpisodeSelect}
                    isLoadingSeason={isSeasonLoading}
                    subscriptionLoading={subscriptionLoading}
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 md:px-10 lg:px-16 mb-8 sm:mb-12">
                <div className="max-w-7xl mx-auto">
                  <AnimeRecommendations 
                    recommendations={anime.recommendations?.results || []} 
                    onAnimeClick={handleRecommendationClick} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
};

export default AnimeDetails;
