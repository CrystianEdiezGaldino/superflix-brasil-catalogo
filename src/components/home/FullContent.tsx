import { MediaItem, Movie, Series } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { useState } from "react";

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
  talkShows = []
}: FullContentProps) => {
  const [loadedItems, setLoadedItems] = useState<Record<string, number>>({
    movies: 30,
    series: 30,
    anime: 30,
    topRatedAnime: 30,
    recommendations: 30,
    doramas: 30,
    actionMovies: 30,
    comedyMovies: 30,
    adventureMovies: 30,
    sciFiMovies: 30,
    marvelMovies: 30,
    dcMovies: 30,
    popularSeries: 30,
    recentAnimes: 30,
    netflixOriginals: 30,
    primeOriginals: 30,
    hboOriginals: 30,
    disneyOriginals: 30,
    netflixDoramas: 30,
    trendingAnime: 30,
    koreanDramas: 30,
    japaneseDramas: 30,
    chineseDramas: 30,
    popularMovies: 30,
    trendingMovies: 30,
    awardWinningMovies: 30,
    awardWinningSeries: 30,
    documentaryMovies: 30,
    documentarySeries: 30,
    horrorMovies: 30,
    romanceMovies: 30,
    dramaMovies: 30,
    thrillerMovies: 30,
    familyMovies: 30,
    animationMovies: 30,
    crimeSeries: 30,
    mysterySeries: 30,
    realitySeries: 30,
    talkShows: 30
  });
  
  const [loadingSections, setLoadingSections] = useState<Record<string, boolean>>({});

  const loadMoreItems = (sectionId: string, items: MediaItem[]) => {
    setLoadingSections(prev => ({...prev, [sectionId]: true}));
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoadedItems(prev => ({
        ...prev,
        [sectionId]: Math.min((prev[sectionId] || 30) + 30, items.length)
      }));
      
      setLoadingSections(prev => ({...prev, [sectionId]: false}));
    }, 800);
  };

  // Filter out content without images
  const filteredMovies = movies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSeries = series.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredAnime = anime.filter(item => item.poster_path || item.backdrop_path);
  const filteredTopAnime = topRatedAnime.filter(item => item.poster_path || item.backdrop_path);
  const filteredRecommendations = recommendations
    .filter(item => item.poster_path || item.backdrop_path)
    .filter(item => {
      const releaseDate = new Date(
        item.media_type === 'movie' 
          ? (item as Movie).release_date 
          : (item as Series).first_air_date || ''
      );
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      return releaseDate >= fiveYearsAgo;
    })
    .slice(0, 5);
  const filteredDoramas = doramas.filter(item => item.poster_path || item.backdrop_path);

  // Filter genre-specific content
  const filteredActionMovies = actionMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredComedyMovies = comedyMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredAdventureMovies = adventureMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredSciFiMovies = sciFiMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  
  // Filter franchise-specific content
  const filteredMarvelMovies = marvelMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  const filteredDcMovies = dcMovies.filter(movie => movie.poster_path || movie.backdrop_path);
  
  // Filter additional content
  const filteredPopularSeries = popularSeries.filter(serie => serie.poster_path || serie.backdrop_path);
  const filteredRecentAnimes = recentAnimes.filter(anime => anime.poster_path || anime.backdrop_path);
  
  return (
    <div className="space-y-8 pb-10">
      {filteredRecommendations.length > 0 && (
        <MediaSection 
          title="Recomendados para Você" 
          medias={filteredRecommendations}
          showLoadMore={false}
        />
      )}
      
      {filteredMovies.length > 0 && (
        <MediaSection 
          title="Filmes Populares" 
          medias={filteredMovies.slice(0, loadedItems.movies || 30)}
          showLoadMore={filteredMovies.length > (loadedItems.movies || 30)}
          onLoadMore={() => loadMoreItems('movies', filteredMovies)}
          isLoading={loadingSections.movies}
        />
      )}
      
      {filteredPopularSeries.length > 0 && (
        <MediaSection 
          title="Séries Populares" 
          medias={filteredPopularSeries.slice(0, loadedItems.popularSeries || 30)} 
          showLoadMore={filteredPopularSeries.length > (loadedItems.popularSeries || 30)}
          onLoadMore={() => loadMoreItems('popularSeries', filteredPopularSeries)}
          isLoading={loadingSections.popularSeries}
        />
      )}
      
      {filteredRecentAnimes.length > 0 && (
        <MediaSection 
          title="Anime em Alta" 
          medias={filteredRecentAnimes.slice(0, loadedItems.recentAnimes || 30)} 
          showLoadMore={filteredRecentAnimes.length > (loadedItems.recentAnimes || 30)}
          onLoadMore={() => loadMoreItems('recentAnimes', filteredRecentAnimes)}
          isLoading={loadingSections.recentAnimes}
        />
      )}
      
      {filteredAnime.length > 0 && (
        <MediaSection 
          title="Animes Populares" 
          medias={filteredAnime.slice(0, loadedItems.anime || 30)} 
          showLoadMore={filteredAnime.length > (loadedItems.anime || 30)}
          onLoadMore={() => loadMoreItems('anime', filteredAnime)}
          isLoading={loadingSections.anime}
        />
      )}
      
      {filteredTopAnime.length > 0 && (
        <MediaSection 
          title="Animes Bem Avaliados" 
          medias={filteredTopAnime.slice(0, loadedItems.topRatedAnime || 30)} 
          showLoadMore={filteredTopAnime.length > (loadedItems.topRatedAnime || 30)}
          onLoadMore={() => loadMoreItems('topRatedAnime', filteredTopAnime)}
          isLoading={loadingSections.topRatedAnime}
        />
      )}
      
      {filteredDoramas.length > 0 && (
        <MediaSection 
          title="Doramas Coreanos" 
          medias={filteredDoramas.slice(0, loadedItems.doramas || 30)} 
          showLoadMore={filteredDoramas.length > (loadedItems.doramas || 30)}
          onLoadMore={() => loadMoreItems('doramas', filteredDoramas)}
          isLoading={loadingSections.doramas}
        />
      )}
      
      {filteredSeries.length > 0 && (
        <MediaSection 
          title="Séries e Programas de TV" 
          medias={filteredSeries.slice(0, loadedItems.series || 30)} 
          showLoadMore={filteredSeries.length > (loadedItems.series || 30)}
          onLoadMore={() => loadMoreItems('series', filteredSeries)}
          isLoading={loadingSections.series}
        />
      )}
      
      {/* Genre-specific movie sections */}
      {filteredActionMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Ação" 
          medias={filteredActionMovies.slice(0, loadedItems.actionMovies || 30)} 
          showLoadMore={filteredActionMovies.length > (loadedItems.actionMovies || 30)}
          onLoadMore={() => loadMoreItems('actionMovies', filteredActionMovies)}
          isLoading={loadingSections.actionMovies}
        />
      )}
      
      {filteredComedyMovies.length > 0 && (
        <MediaSection 
          title="Comédias" 
          medias={filteredComedyMovies.slice(0, loadedItems.comedyMovies || 30)} 
          showLoadMore={filteredComedyMovies.length > (loadedItems.comedyMovies || 30)}
          onLoadMore={() => loadMoreItems('comedyMovies', filteredComedyMovies)}
          isLoading={loadingSections.comedyMovies}
        />
      )}
      
      {filteredAdventureMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Aventura" 
          medias={filteredAdventureMovies.slice(0, loadedItems.adventureMovies || 30)} 
          showLoadMore={filteredAdventureMovies.length > (loadedItems.adventureMovies || 30)}
          onLoadMore={() => loadMoreItems('adventureMovies', filteredAdventureMovies)}
          isLoading={loadingSections.adventureMovies}
        />
      )}
      
      {filteredSciFiMovies.length > 0 && (
        <MediaSection 
          title="Ficção Científica" 
          medias={filteredSciFiMovies.slice(0, loadedItems.sciFiMovies || 30)} 
          showLoadMore={filteredSciFiMovies.length > (loadedItems.sciFiMovies || 30)}
          onLoadMore={() => loadMoreItems('sciFiMovies', filteredSciFiMovies)}
          isLoading={loadingSections.sciFiMovies}
        />
      )}
      
      {/* Franchise-specific movie sections */}
      {filteredMarvelMovies.length > 0 && (
        <MediaSection 
          title="Universo Marvel" 
          medias={filteredMarvelMovies.slice(0, loadedItems.marvelMovies || 30)} 
          showLoadMore={filteredMarvelMovies.length > (loadedItems.marvelMovies || 30)}
          onLoadMore={() => loadMoreItems('marvelMovies', filteredMarvelMovies)}
          isLoading={loadingSections.marvelMovies}
        />
      )}
      
      {filteredDcMovies.length > 0 && (
        <MediaSection 
          title="DC Comics" 
          medias={filteredDcMovies.slice(0, loadedItems.dcMovies || 30)} 
          showLoadMore={filteredDcMovies.length > (loadedItems.dcMovies || 30)}
          onLoadMore={() => loadMoreItems('dcMovies', filteredDcMovies)}
          isLoading={loadingSections.dcMovies}
        />
      )}

      {netflixOriginals.length > 0 && (
        <MediaSection 
          title="Netflix Originals" 
          medias={netflixOriginals.slice(0, loadedItems.netflixOriginals || 10)}
          showLoadMore={netflixOriginals.length > (loadedItems.netflixOriginals || 10)}
          onLoadMore={() => loadMoreItems('netflixOriginals', netflixOriginals)}
          isLoading={loadingSections.netflixOriginals}
        />
      )}

      {netflixDoramas.length > 0 && (
        <MediaSection 
          title="Doramas Netflix" 
          medias={netflixDoramas.slice(0, loadedItems.netflixDoramas || 10)}
          showLoadMore={netflixDoramas.length > (loadedItems.netflixDoramas || 10)}
          onLoadMore={() => loadMoreItems('netflixDoramas', netflixDoramas)}
          isLoading={loadingSections.netflixDoramas}
        />
      )}

      {koreanDramas.length > 0 && (
        <MediaSection 
          title="Doramas Coreanos" 
          medias={koreanDramas.slice(0, loadedItems.koreanDramas || 10)}
          showLoadMore={koreanDramas.length > (loadedItems.koreanDramas || 10)}
          onLoadMore={() => loadMoreItems('koreanDramas', koreanDramas)}
          isLoading={loadingSections.koreanDramas}
        />
      )}

      {japaneseDramas.length > 0 && (
        <MediaSection 
          title="Doramas Japoneses" 
          medias={japaneseDramas.slice(0, loadedItems.japaneseDramas || 10)}
          showLoadMore={japaneseDramas.length > (loadedItems.japaneseDramas || 10)}
          onLoadMore={() => loadMoreItems('japaneseDramas', japaneseDramas)}
          isLoading={loadingSections.japaneseDramas}
        />
      )}

      {chineseDramas.length > 0 && (
        <MediaSection 
          title="Doramas Chineses" 
          medias={chineseDramas.slice(0, loadedItems.chineseDramas || 10)}
          showLoadMore={chineseDramas.length > (loadedItems.chineseDramas || 10)}
          onLoadMore={() => loadMoreItems('chineseDramas', chineseDramas)}
          isLoading={loadingSections.chineseDramas}
        />
      )}

      {trendingAnime.length > 0 && (
        <MediaSection 
          title="Animes em Alta no Brasil" 
          medias={trendingAnime.slice(0, loadedItems.trendingAnime || 10)}
          showLoadMore={trendingAnime.length > (loadedItems.trendingAnime || 10)}
          onLoadMore={() => loadMoreItems('trendingAnime', trendingAnime)}
          isLoading={loadingSections.trendingAnime}
        />
      )}

      {primeOriginals.length > 0 && (
        <MediaSection 
          title="Amazon Prime Originals" 
          medias={primeOriginals.slice(0, loadedItems.primeOriginals || 10)}
          showLoadMore={primeOriginals.length > (loadedItems.primeOriginals || 10)}
          onLoadMore={() => loadMoreItems('primeOriginals', primeOriginals)}
          isLoading={loadingSections.primeOriginals}
        />
      )}

      {hboOriginals.length > 0 && (
        <MediaSection 
          title="HBO Max Originals" 
          medias={hboOriginals.slice(0, loadedItems.hboOriginals || 10)}
          showLoadMore={hboOriginals.length > (loadedItems.hboOriginals || 10)}
          onLoadMore={() => loadMoreItems('hboOriginals', hboOriginals)}
          isLoading={loadingSections.hboOriginals}
        />
      )}

      {disneyOriginals.length > 0 && (
        <MediaSection 
          title="Disney+ Originals" 
          medias={disneyOriginals.slice(0, loadedItems.disneyOriginals || 10)}
          showLoadMore={disneyOriginals.length > (loadedItems.disneyOriginals || 10)}
          onLoadMore={() => loadMoreItems('disneyOriginals', disneyOriginals)}
          isLoading={loadingSections.disneyOriginals}
        />
      )}

      {awardWinningMovies.length > 0 && (
        <MediaSection 
          title="Filmes Premiados" 
          medias={awardWinningMovies.slice(0, loadedItems.awardWinningMovies || 10)}
          showLoadMore={awardWinningMovies.length > (loadedItems.awardWinningMovies || 10)}
          onLoadMore={() => loadMoreItems('awardWinningMovies', awardWinningMovies)}
          isLoading={loadingSections.awardWinningMovies}
        />
      )}

      {awardWinningSeries.length > 0 && (
        <MediaSection 
          title="Séries Premiadas" 
          medias={awardWinningSeries.slice(0, loadedItems.awardWinningSeries || 10)}
          showLoadMore={awardWinningSeries.length > (loadedItems.awardWinningSeries || 10)}
          onLoadMore={() => loadMoreItems('awardWinningSeries', awardWinningSeries)}
          isLoading={loadingSections.awardWinningSeries}
        />
      )}

      {documentaryMovies.length > 0 && (
        <MediaSection 
          title="Documentários" 
          medias={documentaryMovies.slice(0, loadedItems.documentaryMovies || 10)}
          showLoadMore={documentaryMovies.length > (loadedItems.documentaryMovies || 10)}
          onLoadMore={() => loadMoreItems('documentaryMovies', documentaryMovies)}
          isLoading={loadingSections.documentaryMovies}
        />
      )}

      {documentarySeries.length > 0 && (
        <MediaSection 
          title="Séries Documentais" 
          medias={documentarySeries.slice(0, loadedItems.documentarySeries || 10)}
          showLoadMore={documentarySeries.length > (loadedItems.documentarySeries || 10)}
          onLoadMore={() => loadMoreItems('documentarySeries', documentarySeries)}
          isLoading={loadingSections.documentarySeries}
        />
      )}

      {horrorMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Terror" 
          medias={horrorMovies.slice(0, loadedItems.horrorMovies || 10)}
          showLoadMore={horrorMovies.length > (loadedItems.horrorMovies || 10)}
          onLoadMore={() => loadMoreItems('horrorMovies', horrorMovies)}
          isLoading={loadingSections.horrorMovies}
        />
      )}

      {romanceMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Romance" 
          medias={romanceMovies.slice(0, loadedItems.romanceMovies || 10)}
          showLoadMore={romanceMovies.length > (loadedItems.romanceMovies || 10)}
          onLoadMore={() => loadMoreItems('romanceMovies', romanceMovies)}
          isLoading={loadingSections.romanceMovies}
        />
      )}

      {dramaMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Drama" 
          medias={dramaMovies.slice(0, loadedItems.dramaMovies || 10)}
          showLoadMore={dramaMovies.length > (loadedItems.dramaMovies || 10)}
          onLoadMore={() => loadMoreItems('dramaMovies', dramaMovies)}
          isLoading={loadingSections.dramaMovies}
        />
      )}

      {thrillerMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Suspense" 
          medias={thrillerMovies.slice(0, loadedItems.thrillerMovies || 10)}
          showLoadMore={thrillerMovies.length > (loadedItems.thrillerMovies || 10)}
          onLoadMore={() => loadMoreItems('thrillerMovies', thrillerMovies)}
          isLoading={loadingSections.thrillerMovies}
        />
      )}

      {familyMovies.length > 0 && (
        <MediaSection 
          title="Filmes para a Família" 
          medias={familyMovies.slice(0, loadedItems.familyMovies || 10)}
          showLoadMore={familyMovies.length > (loadedItems.familyMovies || 10)}
          onLoadMore={() => loadMoreItems('familyMovies', familyMovies)}
          isLoading={loadingSections.familyMovies}
        />
      )}

      {animationMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Animação" 
          medias={animationMovies.slice(0, loadedItems.animationMovies || 10)}
          showLoadMore={animationMovies.length > (loadedItems.animationMovies || 10)}
          onLoadMore={() => loadMoreItems('animationMovies', animationMovies)}
          isLoading={loadingSections.animationMovies}
        />
      )}

      {crimeSeries.length > 0 && (
        <MediaSection 
          title="Séries de Crime" 
          medias={crimeSeries.slice(0, loadedItems.crimeSeries || 10)}
          showLoadMore={crimeSeries.length > (loadedItems.crimeSeries || 10)}
          onLoadMore={() => loadMoreItems('crimeSeries', crimeSeries)}
          isLoading={loadingSections.crimeSeries}
        />
      )}

      {mysterySeries.length > 0 && (
        <MediaSection 
          title="Séries de Mistério" 
          medias={mysterySeries.slice(0, loadedItems.mysterySeries || 10)}
          showLoadMore={mysterySeries.length > (loadedItems.mysterySeries || 10)}
          onLoadMore={() => loadMoreItems('mysterySeries', mysterySeries)}
          isLoading={loadingSections.mysterySeries}
        />
      )}

      {realitySeries.length > 0 && (
        <MediaSection 
          title="Reality Shows" 
          medias={realitySeries.slice(0, loadedItems.realitySeries || 10)}
          showLoadMore={realitySeries.length > (loadedItems.realitySeries || 10)}
          onLoadMore={() => loadMoreItems('realitySeries', realitySeries)}
          isLoading={loadingSections.realitySeries}
        />
      )}

      {talkShows.length > 0 && (
        <MediaSection 
          title="Talk Shows" 
          medias={talkShows.slice(0, loadedItems.talkShows || 10)}
          showLoadMore={talkShows.length > (loadedItems.talkShows || 10)}
          onLoadMore={() => loadMoreItems('talkShows', talkShows)}
          isLoading={loadingSections.talkShows}
        />
      )}
    </div>
  );
};

export default FullContent;
