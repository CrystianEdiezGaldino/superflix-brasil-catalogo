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
  onLoadMore: () => void;
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
  popularSeries = [],
  recentAnimes = [],
  netflixOriginals = [],
  primeOriginals = [],
  hboOriginals = [],
  disneyOriginals = [],
  netflixDoramas = [],
  trendingAnime = [],
  koreanDramas = [],
  japaneseDramas = [],
  chineseDramas = [],
  popularMovies = [],
  trendingMovies = [],
  awardWinningMovies = [],
  awardWinningSeries = [],
  documentaryMovies = [],
  documentarySeries = [],
  horrorMovies = [],
  romanceMovies = [],
  dramaMovies = [],
  thrillerMovies = [],
  familyMovies = [],
  animationMovies = [],
  crimeSeries = [],
  mysterySeries = [],
  realitySeries = [],
  talkShows = [],
  onLoadMore,
  isLoading,
  hasMore
}: FullContentProps) => {
  
  return (
    <div className="space-y-8 pb-10">
      {/* Recommendations Section */}
      <RecommendationsSection recommendations={recommendations} />
      
      {/* Movies Sections */}
      <MoviesSections 
        movies={movies}
        actionMovies={actionMovies}
        comedyMovies={comedyMovies}
        adventureMovies={adventureMovies}
        sciFiMovies={sciFiMovies}
        marvelMovies={marvelMovies}
        dcMovies={dcMovies}
        horrorMovies={horrorMovies}
        romanceMovies={romanceMovies}
        dramaMovies={dramaMovies}
        thrillerMovies={thrillerMovies}
        familyMovies={familyMovies}
        animationMovies={animationMovies}
        documentaryMovies={documentaryMovies}
        awardWinningMovies={awardWinningMovies}
        popularMovies={popularMovies}
        trendingMovies={trendingMovies}
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      
      {/* Series Sections */}
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
      />
      
      {/* Anime Sections */}
      <AnimeSections 
        anime={anime}
        topRatedAnime={topRatedAnime}
        recentAnimes={recentAnimes}
        trendingAnime={trendingAnime}
      />
      
      {/* Dorama Sections */}
      <DoramaSections 
        doramas={doramas}
        koreanDramas={koreanDramas}
        // japaneseDramas={japaneseDramas}
        // chineseDramas={chineseDramas}
        netflixDoramas={netflixDoramas}
      />
    </div>
  );
};

export default FullContent;
