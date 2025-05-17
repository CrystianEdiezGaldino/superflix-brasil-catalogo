
import { MediaItem } from "@/types/movie";
import RecommendationsSection from "./sections/RecommendationsSection";
import MoviesSections from "./sections/MoviesSections";
import SeriesSections from "./sections/SeriesSections";
import AnimeSections from "./sections/AnimeSections";
import DoramaSections from "./sections/DoramaSections";

interface FullContentProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  topRatedAnime: MediaItem[];
  recommendations: MediaItem[];
  doramas: MediaItem[];
  actionMovies: MediaItem[];
  comedyMovies: MediaItem[];
  adventureMovies: MediaItem[];
  sciFiMovies: MediaItem[];
  marvelMovies: MediaItem[];
  dcMovies: MediaItem[];
  popularSeries?: MediaItem[];
  recentAnimes?: MediaItem[];
  netflixOriginals?: MediaItem[];
  primeOriginals?: MediaItem[];
  hboOriginals?: MediaItem[];
  disneyOriginals?: MediaItem[];
  netflixDoramas?: MediaItem[];
  trendingAnime?: MediaItem[];
  koreanDramas?: MediaItem[];
  japaneseDramas?: MediaItem[];
  chineseDramas?: MediaItem[];
  popularMovies?: MediaItem[];
  trendingMovies?: MediaItem[];
  awardWinningMovies?: MediaItem[];
  awardWinningSeries?: MediaItem[];
  documentaryMovies?: MediaItem[];
  documentarySeries?: MediaItem[];
  horrorMovies?: MediaItem[];
  romanceMovies?: MediaItem[];
  dramaMovies?: MediaItem[];
  thrillerMovies?: MediaItem[];
  familyMovies?: MediaItem[];
  animationMovies?: MediaItem[];
  crimeSeries?: MediaItem[];
  mysterySeries?: MediaItem[];
  realitySeries?: MediaItem[];
  talkShows?: MediaItem[];
  onLoadMore: (sectionId: string) => void;
  onMediaClick?: (media: MediaItem) => void;
  isLoading: boolean;
  hasMore: boolean;
}

const FullContent = ({
  movies,
  series,
  anime,
  topRatedAnime,
  recommendations,
  doramas,
  actionMovies,
  comedyMovies,
  adventureMovies,
  sciFiMovies,
  marvelMovies,
  dcMovies,
  popularSeries,
  recentAnimes,
  netflixOriginals,
  primeOriginals,
  hboOriginals,
  disneyOriginals,
  netflixDoramas,
  trendingAnime,
  koreanDramas,
  japaneseDramas,
  chineseDramas,
  popularMovies,
  trendingMovies,
  awardWinningMovies,
  awardWinningSeries,
  documentaryMovies,
  documentarySeries,
  horrorMovies,
  romanceMovies,
  dramaMovies,
  thrillerMovies,
  familyMovies,
  animationMovies,
  crimeSeries,
  mysterySeries,
  realitySeries,
  talkShows,
  onLoadMore,
  onMediaClick,
  isLoading,
  hasMore
}: FullContentProps) => {
  return (
    <div className="space-y-8">
      <RecommendationsSection
        recommendations={recommendations}
        isLoading={isLoading}
      />

      <MoviesSections
        movies={movies}
        actionMovies={actionMovies}
        comedyMovies={comedyMovies}
        adventureMovies={adventureMovies}
        sciFiMovies={sciFiMovies}
        marvelMovies={marvelMovies}
        dcMovies={dcMovies}
        popularMovies={popularMovies}
        trendingMovies={trendingMovies}
        awardWinningMovies={awardWinningMovies}
        documentaryMovies={documentaryMovies}
        horrorMovies={horrorMovies}
        romanceMovies={romanceMovies}
        dramaMovies={dramaMovies}
        thrillerMovies={thrillerMovies}
        familyMovies={familyMovies}
        animationMovies={animationMovies}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />

      <SeriesSections
        series={series}
        popularSeries={popularSeries}
        awardWinningSeries={awardWinningSeries}
        documentarySeries={documentarySeries}
        crimeSeries={crimeSeries}
        mysterySeries={mysterySeries}
        realitySeries={realitySeries}
        talkShows={talkShows}
        netflixOriginals={netflixOriginals}
        primeOriginals={primeOriginals}
        hboOriginals={hboOriginals}
        disneyOriginals={disneyOriginals}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />

      <AnimeSections
        anime={anime}
        topRatedAnime={topRatedAnime}
        recentAnimes={recentAnimes}
        trendingAnime={trendingAnime}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onMediaClick={onMediaClick}
      />

      <DoramaSections
        doramas={doramas}
        topRatedDoramas={koreanDramas || []}
        popularDoramas={japaneseDramas || []}
        koreanMovies={chineseDramas || []}
        romanceDoramas={romanceMovies || []} // Adding the missing romanceDoramas prop
        onMediaClick={onMediaClick}
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
};

export default FullContent;
