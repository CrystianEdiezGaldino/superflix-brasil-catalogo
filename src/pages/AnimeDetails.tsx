
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAnimeDetails } from "@/hooks/anime/useAnimeDetails";
import AnimeHeader from "@/components/anime/AnimeHeader";
import AnimeActions from "@/components/anime/AnimeActions";
import AnimeContent from "@/components/anime/AnimeContent";
import AnimePlayer from "@/components/anime/AnimePlayer";
import AnimeLoadingState from "@/components/anime/AnimeLoadingState";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  
  const {
    anime,
    showPlayer,
    selectedSeason,
    selectedEpisode,
    handleEpisodeSelect,
    togglePlayer,
    isLoadingSeries,
    isLoadingSeason,
    hasAccess,
    seasons,
    seasonData,
    user,
    isFavorite,
    toggleFavoriteAnime
  } = useAnimeDetails(id);

  // Check if anime is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (anime?.id) {
        const result = await isFavorite();
        setIsFav(result);
      }
    };
    
    if (anime) {
      checkFavoriteStatus();
    }
  }, [anime, isFavorite]);

  // Handle loading state
  if (isLoadingSeries) {
    return <AnimeLoadingState />;
  }

  // Handle anime not found
  if (!anime) {
    toast.error("Anime não encontrado");
    navigate("/animes");
    return null;
  }

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar onSearch={() => {}} />

      {/* Anime Header Component */}
      <AnimeHeader
        anime={anime}
        isFavorite={isFav} 
        toggleFavorite={() => {
          toggleFavoriteAnime();
          setIsFav(!isFav); // Optimistically update UI immediately
        }} 
      />

      {/* Player Actions */}
      <AnimeActions 
        showPlayer={showPlayer} 
        togglePlayer={togglePlayer} 
        hasAccess={hasAccess}
      />

      {/* Video Player Component */}
      <AnimePlayer
        showPlayer={showPlayer}
        anime={anime}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        hasAccess={hasAccess}
      />

      {/* Anime Content/Details Component */}
      <AnimeContent
        anime={anime}
        seasonData={seasonData}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        seasons={seasons}
        setSelectedSeason={(season) => handleEpisodeSelect(season, 1)}
        handleEpisodeSelect={(episode) => handleEpisodeSelect(selectedSeason, episode)}
        isLoadingSeason={isLoadingSeason}
        subscriptionLoading={false}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default AnimeDetails;
