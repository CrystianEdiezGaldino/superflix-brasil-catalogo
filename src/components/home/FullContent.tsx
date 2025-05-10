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
  const [loadedItems, setLoadedItems] = useState<Record<string, number>>({});

  const loadMoreItems = (sectionId: string) => {
    setLoadedItems(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 10) + 10
    }));
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
          medias={filteredMovies.slice(0, 10)} 
        />
      )}
      
      {filteredPopularSeries.length > 0 && (
        <MediaSection 
          title="Séries Populares" 
          medias={filteredPopularSeries.slice(0, 10)} 
        />
      )}
      
      {filteredRecentAnimes.length > 0 && (
        <MediaSection 
          title="Anime em Alta" 
          medias={filteredRecentAnimes.slice(0, 10)} 
        />
      )}
      
      {filteredAnime.length > 0 && (
        <MediaSection 
          title="Animes Populares" 
          medias={filteredAnime.slice(0, 10)} 
        />
      )}
      
      {filteredTopAnime.length > 0 && (
        <MediaSection 
          title="Animes Bem Avaliados" 
          medias={filteredTopAnime.slice(0, 10)} 
        />
      )}
      
      {filteredDoramas.length > 0 && (
        <MediaSection 
          title="Doramas Coreanos" 
          medias={filteredDoramas.slice(0, 10)} 
        />
      )}
      
      {filteredSeries.length > 0 && (
        <MediaSection 
          title="Séries e Programas de TV" 
          medias={filteredSeries.slice(0, 10)} 
        />
      )}
      
      {/* Genre-specific movie sections */}
      {filteredActionMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Ação" 
          medias={filteredActionMovies.slice(0, 10)} 
        />
      )}
      
      {filteredComedyMovies.length > 0 && (
        <MediaSection 
          title="Comédias" 
          medias={filteredComedyMovies.slice(0, 10)} 
        />
      )}
      
      {filteredAdventureMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Aventura" 
          medias={filteredAdventureMovies.slice(0, 10)} 
        />
      )}
      
      {filteredSciFiMovies.length > 0 && (
        <MediaSection 
          title="Ficção Científica" 
          medias={filteredSciFiMovies.slice(0, 10)} 
        />
      )}
      
      {/* Franchise-specific movie sections */}
      {filteredMarvelMovies.length > 0 && (
        <MediaSection 
          title="Universo Marvel" 
          medias={filteredMarvelMovies.slice(0, 10)} 
        />
      )}
      
      {filteredDcMovies.length > 0 && (
        <MediaSection 
          title="DC Comics" 
          medias={filteredDcMovies.slice(0, 10)} 
        />
      )}

      {netflixOriginals.length > 0 && (
        <MediaSection 
          title="Netflix Originals" 
          medias={netflixOriginals.slice(0, loadedItems['netflixOriginals'] || 10)}
          showLoadMore={netflixOriginals.length > (loadedItems['netflixOriginals'] || 10)}
          onLoadMore={() => loadMoreItems('netflixOriginals')}
        />
      )}

      {netflixDoramas.length > 0 && (
        <MediaSection 
          title="Doramas Netflix" 
          medias={netflixDoramas.slice(0, loadedItems['netflixDoramas'] || 10)}
          showLoadMore={netflixDoramas.length > (loadedItems['netflixDoramas'] || 10)}
          onLoadMore={() => loadMoreItems('netflixDoramas')}
        />
      )}

      {koreanDramas.length > 0 && (
        <MediaSection 
          title="Doramas Coreanos" 
          medias={koreanDramas.slice(0, loadedItems['koreanDramas'] || 10)}
          showLoadMore={koreanDramas.length > (loadedItems['koreanDramas'] || 10)}
          onLoadMore={() => loadMoreItems('koreanDramas')}
        />
      )}

      {japaneseDramas.length > 0 && (
        <MediaSection 
          title="Doramas Japoneses" 
          medias={japaneseDramas.slice(0, loadedItems['japaneseDramas'] || 10)}
          showLoadMore={japaneseDramas.length > (loadedItems['japaneseDramas'] || 10)}
          onLoadMore={() => loadMoreItems('japaneseDramas')}
        />
      )}

      {chineseDramas.length > 0 && (
        <MediaSection 
          title="Doramas Chineses" 
          medias={chineseDramas.slice(0, loadedItems['chineseDramas'] || 10)}
          showLoadMore={chineseDramas.length > (loadedItems['chineseDramas'] || 10)}
          onLoadMore={() => loadMoreItems('chineseDramas')}
        />
      )}

      {trendingAnime.length > 0 && (
        <MediaSection 
          title="Animes em Alta no Brasil" 
          medias={trendingAnime.slice(0, loadedItems['trendingAnime'] || 10)}
          showLoadMore={trendingAnime.length > (loadedItems['trendingAnime'] || 10)}
          onLoadMore={() => loadMoreItems('trendingAnime')}
        />
      )}

      {primeOriginals.length > 0 && (
        <MediaSection 
          title="Amazon Prime Originals" 
          medias={primeOriginals.slice(0, loadedItems['primeOriginals'] || 10)}
          showLoadMore={primeOriginals.length > (loadedItems['primeOriginals'] || 10)}
          onLoadMore={() => loadMoreItems('primeOriginals')}
        />
      )}

      {hboOriginals.length > 0 && (
        <MediaSection 
          title="HBO Max Originals" 
          medias={hboOriginals.slice(0, loadedItems['hboOriginals'] || 10)}
          showLoadMore={hboOriginals.length > (loadedItems['hboOriginals'] || 10)}
          onLoadMore={() => loadMoreItems('hboOriginals')}
        />
      )}

      {disneyOriginals.length > 0 && (
        <MediaSection 
          title="Disney+ Originals" 
          medias={disneyOriginals.slice(0, loadedItems['disneyOriginals'] || 10)}
          showLoadMore={disneyOriginals.length > (loadedItems['disneyOriginals'] || 10)}
          onLoadMore={() => loadMoreItems('disneyOriginals')}
        />
      )}

      {awardWinningMovies.length > 0 && (
        <MediaSection 
          title="Filmes Premiados" 
          medias={awardWinningMovies.slice(0, loadedItems['awardWinningMovies'] || 10)}
          showLoadMore={awardWinningMovies.length > (loadedItems['awardWinningMovies'] || 10)}
          onLoadMore={() => loadMoreItems('awardWinningMovies')}
        />
      )}

      {awardWinningSeries.length > 0 && (
        <MediaSection 
          title="Séries Premiadas" 
          medias={awardWinningSeries.slice(0, loadedItems['awardWinningSeries'] || 10)}
          showLoadMore={awardWinningSeries.length > (loadedItems['awardWinningSeries'] || 10)}
          onLoadMore={() => loadMoreItems('awardWinningSeries')}
        />
      )}

      {documentaryMovies.length > 0 && (
        <MediaSection 
          title="Documentários" 
          medias={documentaryMovies.slice(0, loadedItems['documentaryMovies'] || 10)}
          showLoadMore={documentaryMovies.length > (loadedItems['documentaryMovies'] || 10)}
          onLoadMore={() => loadMoreItems('documentaryMovies')}
        />
      )}

      {documentarySeries.length > 0 && (
        <MediaSection 
          title="Séries Documentais" 
          medias={documentarySeries.slice(0, loadedItems['documentarySeries'] || 10)}
          showLoadMore={documentarySeries.length > (loadedItems['documentarySeries'] || 10)}
          onLoadMore={() => loadMoreItems('documentarySeries')}
        />
      )}

      {horrorMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Terror" 
          medias={horrorMovies.slice(0, loadedItems['horrorMovies'] || 10)}
          showLoadMore={horrorMovies.length > (loadedItems['horrorMovies'] || 10)}
          onLoadMore={() => loadMoreItems('horrorMovies')}
        />
      )}

      {romanceMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Romance" 
          medias={romanceMovies.slice(0, loadedItems['romanceMovies'] || 10)}
          showLoadMore={romanceMovies.length > (loadedItems['romanceMovies'] || 10)}
          onLoadMore={() => loadMoreItems('romanceMovies')}
        />
      )}

      {dramaMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Drama" 
          medias={dramaMovies.slice(0, loadedItems['dramaMovies'] || 10)}
          showLoadMore={dramaMovies.length > (loadedItems['dramaMovies'] || 10)}
          onLoadMore={() => loadMoreItems('dramaMovies')}
        />
      )}

      {thrillerMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Suspense" 
          medias={thrillerMovies.slice(0, loadedItems['thrillerMovies'] || 10)}
          showLoadMore={thrillerMovies.length > (loadedItems['thrillerMovies'] || 10)}
          onLoadMore={() => loadMoreItems('thrillerMovies')}
        />
      )}

      {familyMovies.length > 0 && (
        <MediaSection 
          title="Filmes para a Família" 
          medias={familyMovies.slice(0, loadedItems['familyMovies'] || 10)}
          showLoadMore={familyMovies.length > (loadedItems['familyMovies'] || 10)}
          onLoadMore={() => loadMoreItems('familyMovies')}
        />
      )}

      {animationMovies.length > 0 && (
        <MediaSection 
          title="Filmes de Animação" 
          medias={animationMovies.slice(0, loadedItems['animationMovies'] || 10)}
          showLoadMore={animationMovies.length > (loadedItems['animationMovies'] || 10)}
          onLoadMore={() => loadMoreItems('animationMovies')}
        />
      )}

      {crimeSeries.length > 0 && (
        <MediaSection 
          title="Séries de Crime" 
          medias={crimeSeries.slice(0, loadedItems['crimeSeries'] || 10)}
          showLoadMore={crimeSeries.length > (loadedItems['crimeSeries'] || 10)}
          onLoadMore={() => loadMoreItems('crimeSeries')}
        />
      )}

      {mysterySeries.length > 0 && (
        <MediaSection 
          title="Séries de Mistério" 
          medias={mysterySeries.slice(0, loadedItems['mysterySeries'] || 10)}
          showLoadMore={mysterySeries.length > (loadedItems['mysterySeries'] || 10)}
          onLoadMore={() => loadMoreItems('mysterySeries')}
        />
      )}

      {realitySeries.length > 0 && (
        <MediaSection 
          title="Reality Shows" 
          medias={realitySeries.slice(0, loadedItems['realitySeries'] || 10)}
          showLoadMore={realitySeries.length > (loadedItems['realitySeries'] || 10)}
          onLoadMore={() => loadMoreItems('realitySeries')}
        />
      )}

      {talkShows.length > 0 && (
        <MediaSection 
          title="Talk Shows" 
          medias={talkShows.slice(0, loadedItems['talkShows'] || 10)}
          showLoadMore={talkShows.length > (loadedItems['talkShows'] || 10)}
          onLoadMore={() => loadMoreItems('talkShows')}
        />
      )}
    </div>
  );
};

export default FullContent;
