
import React from "react";
import { MediaItem } from "@/types/movie";
import FullContent from "./FullContent";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import UnauthenticatedState from "./UnauthenticatedState";
import SubscriptionUpsell from "./SubscriptionUpsell";

interface MainContentProps {
  user: any;
  hasAccess: boolean;
  isLoading: boolean;
  hasError: boolean;
  moviesData: MediaItem[];
  actionMoviesData: MediaItem[];
  comedyMoviesData: MediaItem[];
  adventureMoviesData: MediaItem[];
  sciFiMoviesData: MediaItem[];
  marvelMoviesData: MediaItem[];
  dcMoviesData: MediaItem[];
  seriesData: MediaItem[];
  popularSeriesData: MediaItem[];
  animeData: MediaItem[];
  topRatedAnimeData: MediaItem[];
  recentAnimesData: MediaItem[];
  doramasData: MediaItem[];
  recommendations: MediaItem[];
  popularContent: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  user,
  hasAccess,
  isLoading,
  hasError,
  moviesData,
  actionMoviesData,
  comedyMoviesData,
  adventureMoviesData,
  sciFiMoviesData,
  marvelMoviesData,
  dcMoviesData,
  seriesData,
  popularSeriesData,
  animeData,
  topRatedAnimeData,
  recentAnimesData,
  doramasData,
  recommendations,
  popularContent,
  onMediaClick,
}) => {
  
  // If loading, show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // If error, show error state
  if (hasError) {
    return <ErrorState />;
  }

  // If no user, show unauthenticated state
  if (!user) {
    return <UnauthenticatedState />;
  }

  // If user doesn't have access, show subscription upsell
  if (!hasAccess) {
    return <SubscriptionUpsell />;
  }

  // Handle load more sections
  const handleLoadMore = (sectionId: string) => {
    console.log(`Loading more for section: ${sectionId}`);
    // Implementation for loading more content
  };

  return (
    <FullContent
      moviesData={moviesData}
      actionMoviesData={actionMoviesData}
      comedyMoviesData={comedyMoviesData}
      adventureMoviesData={adventureMoviesData}
      sciFiMoviesData={sciFiMoviesData}
      marvelMoviesData={marvelMoviesData}
      dcMoviesData={dcMoviesData}
      seriesData={seriesData}
      popularSeriesData={popularSeriesData}
      animeData={animeData}
      topRatedAnimeData={topRatedAnimeData}
      recentAnimesData={recentAnimesData}
      doramasData={doramasData}
      recommendations={recommendations}
      popularContent={popularContent}
      isLoading={isLoading}
      hasMore={true}
      onLoadMore={handleLoadMore}
      onMediaClick={onMediaClick}
    />
  );
};

export default MainContent;
