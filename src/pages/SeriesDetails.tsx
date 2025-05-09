
import { useState } from "react";
import { useSeriesDetails } from "@/hooks/useSeriesDetails";
import SeriesLoadingState from "@/components/series/SeriesLoadingState";
import SeriesHeader from "@/components/series/SeriesHeader";
import SeriesActions from "@/components/series/SeriesActions";
import SeriesPlayer from "@/components/series/SeriesPlayer";
import SeriesContent from "@/components/series/SeriesContent";
import { toast } from "sonner";

const SeriesDetails = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const {
    series,
    seasonData,
    showPlayer,
    selectedSeason,
    selectedEpisode,
    setSelectedSeason,
    handleEpisodeSelect,
    togglePlayer,
    isLoadingSeries,
    isLoadingSeason,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess
  } = useSeriesDetails(undefined); // The ID comes from the URL params in the hook

  // Toggle favorite
  const toggleFavorite = () => {
    if (!user) {
      toast.error("É necessário fazer login para adicionar aos favoritos");
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
    // Here you would integrate with a favorites API
  };

  // Loading, auth and error states
  const isLoading = authLoading || subscriptionLoading || isLoadingSeries || isLoadingSeason;
  const hasError = !isLoading && !series;
  
  if (isLoading || !user || hasError) {
    return (
      <SeriesLoadingState 
        isLoading={isLoading}
        hasUser={!!user}
        hasError={hasError}
      />
    );
  }

  const seasons = Array.from(
    { length: series.number_of_seasons || 0 }, 
    (_, i) => i + 1
  );

  return (
    <div className="min-h-screen bg-netflix-background">
      {/* Header with banner and favorite button */}
      <SeriesHeader 
        series={series} 
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />

      {/* Watch Button */}
      <SeriesActions 
        showPlayer={showPlayer} 
        hasAccess={hasAccess}
        togglePlayer={togglePlayer}
      />

      {/* Video Player */}
      <SeriesPlayer 
        showPlayer={showPlayer}
        series={series}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        hasAccess={hasAccess}
      />

      {/* Series Content - Synopsis, Episodes, etc. */}
      <SeriesContent 
        series={series}
        seasonData={seasonData}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        seasons={seasons}
        setSelectedSeason={setSelectedSeason}
        handleEpisodeSelect={handleEpisodeSelect}
        isLoadingSeason={isLoadingSeason}
        subscriptionLoading={subscriptionLoading}
        hasAccess={hasAccess}
      />
    </div>
  );
};

export default SeriesDetails;
