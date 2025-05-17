
import { MediaItem } from "@/types/movie";
import FullContent from "./FullContent";
import ContentPreview from "./ContentPreview";
import LargeSubscriptionUpsell from "./LargeSubscriptionUpsell";

interface MainContentProps {
  hasAccess: boolean;
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  recommendations: MediaItem[];
  topRatedAnime: MediaItem[];
  doramas: MediaItem[];
  actionMovies: MediaItem[];
  comedyMovies: MediaItem[];
  adventureMovies: MediaItem[];
  sciFiMovies: MediaItem[];
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  popularSeries?: MediaItem[];
  recentAnimes?: MediaItem[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMoreSection: (sectionId: string) => void;
  onMediaClick: (media: MediaItem) => void;
}

const MainContent = ({
  hasAccess,
  movies,
  series,
  anime,
  recommendations,
  topRatedAnime,
  doramas,
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  marvelMovies,
  dcMovies,
  popularSeries = [],
  recentAnimes = [],
  isLoadingMore,
  hasMore,
  onLoadMoreSection,
  onMediaClick
}: MainContentProps) => {
  if (!hasAccess) {
    return (
      <>
        <ContentPreview 
          movies={movies} 
          series={series} 
          anime={anime} 
        />
        <LargeSubscriptionUpsell />
      </>
    );
  }

  return (
    <FullContent 
      movies={movies}
      actionMovies={actionMovies}
      comedyMovies={comedyMovies}
      adventureMovies={adventureMovies}
      sciFiMovies={sciFiMovies}
      marvelMovies={marvelMovies}
      dcMovies={dcMovies}
      horrorMovies={[]}
      romanceMovies={[]}
      dramaMovies={[]}
      thrillerMovies={[]}
      familyMovies={[]}
      animationMovies={[]}
      documentaryMovies={[]}
      awardWinningMovies={[]}
      popularMovies={[]}
      trendingMovies={[]}
      series={series}
      anime={anime}
      topRatedAnime={topRatedAnime}
      recommendations={recommendations}
      doramas={doramas}
      popularSeries={popularSeries}
      recentAnimes={recentAnimes}
      onLoadMore={onLoadMoreSection}
      onMediaClick={onMediaClick}
      isLoading={isLoadingMore}
      hasMore={hasMore}
    />
  );
};

export default MainContent;
