
import { MediaItem } from "@/types/movie";
import { useNavigate } from "react-router-dom";
import MoviesSections from "@/components/home/sections/MoviesSections";
import SeriesSections from "@/components/home/sections/SeriesSections";
import AnimeSections from "@/components/home/sections/AnimeSections";
import DoramaSections from "@/components/home/sections/DoramaSections";
import RecommendationsSection from "@/components/home/sections/RecommendationsSection";

interface FullContentProps {
  recommendations: MediaItem[];
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
  topRatedDoramasData?: MediaItem[];
  popularDoramasData?: MediaItem[];
  koreanMoviesData?: MediaItem[];
  isLoading: boolean;
}

export const FullContent = ({
  recommendations,
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
  topRatedDoramasData = [],
  popularDoramasData = [],
  koreanMoviesData = [],
  isLoading,
}: FullContentProps) => {
  const navigate = useNavigate();

  const handleMediaClick = (media: MediaItem) => {
    if (!media || !media.id) return;
    
    const mediaId = media.id.toString();
    
    switch (media.media_type) {
      case 'movie':
        navigate(`/filme/${mediaId}`);
        break;
      case 'tv':
        navigate(`/serie/${mediaId}`);
        break;
      case 'anime':
        navigate(`/anime/${mediaId}`);
        break;
      default:
        console.warn(`Unknown media type: ${media.media_type}`);
    }
  };

  const handleLoadMore = (sectionId: string) => {
    console.log(`Load more for section: ${sectionId}`);
    // Implementation for loading more content
  };

  return (
    <div className="space-y-12 pb-16">
      {recommendations.length > 0 && (
        <RecommendationsSection
          recommendations={recommendations}
          isLoading={isLoading}
          onMediaClick={handleMediaClick}
        />
      )}
      
      <MoviesSections
        movies={moviesData}
        actionMovies={actionMoviesData}
        comedyMovies={comedyMoviesData}
        adventureMovies={adventureMoviesData}
        sciFiMovies={sciFiMoviesData}
        marvelMovies={marvelMoviesData}
        dcMovies={dcMoviesData}
        isLoading={isLoading}
        hasMore={false}
        onLoadMore={handleLoadMore}
        onMediaClick={handleMediaClick}
      />
      
      <SeriesSections
        series={seriesData}
        popularSeries={popularSeriesData}
        isLoading={isLoading}
        hasMore={false}
        onLoadMore={handleLoadMore}
        onMediaClick={handleMediaClick}
      />
      
      <AnimeSections
        anime={animeData}
        topRatedAnime={topRatedAnimeData}
        recentAnimes={recentAnimesData}
        isLoading={isLoading}
        hasMore={false}
        onLoadMore={handleLoadMore}
        onMediaClick={handleMediaClick}
      />
      
      <DoramaSections
        doramas={doramasData}
        topRatedDoramas={topRatedDoramasData}
        popularDoramas={popularDoramasData}
        koreanMovies={koreanMoviesData}
        isLoading={isLoading}
        hasMore={false}
        onLoadMore={handleLoadMore}
        onMediaClick={handleMediaClick}
      />
    </div>
  );
};

export default FullContent;
