
import React from "react";
import { MediaItem } from "@/types/movie";
import MoviesSections from "./sections/MoviesSections";
import SeriesSections from "./sections/SeriesSections";
import AnimeSections from "./sections/AnimeSections";
import DoramaSections from "./sections/DoramaSections";
import RecommendationsSection from "./sections/RecommendationsSection";

export interface FullContentProps {
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
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: (sectionId: string) => void;
  onMediaClick: (media: MediaItem) => void;
}

const FullContent: React.FC<FullContentProps> = ({
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
  isLoading,
  hasMore,
  onLoadMore,
  onMediaClick,
}) => {
  return (
    <div className="pt-4">
      {/* Movies Sections */}
      <MoviesSections 
        movies={moviesData}
        actionMovies={actionMoviesData}
        comedyMovies={comedyMoviesData}
        adventureMovies={adventureMoviesData}
        sciFiMovies={sciFiMoviesData}
        marvelMovies={marvelMoviesData}
        dcMovies={dcMoviesData}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Series Sections */}
      <SeriesSections
        series={seriesData}
        popularSeries={popularSeriesData}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Anime Sections */}
      <AnimeSections
        anime={animeData}
        topRatedAnime={topRatedAnimeData}
        recentAnimes={recentAnimesData}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Dorama Sections */}
      <DoramaSections
        doramas={doramasData}
        isLoading={isLoading}
        hasMore={hasMore} 
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />
      
      {/* Recommendations Section */}
      <RecommendationsSection
        recommendations={recommendations}
        isLoading={isLoading}
        onMediaClick={onMediaClick}
      />
    </div>
  );
};

export default FullContent;
