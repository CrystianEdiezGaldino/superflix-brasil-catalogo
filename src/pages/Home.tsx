import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import HomeHeader from "@/components/home/HomeHeader";
import RecommendationsSection from "@/components/home/sections/RecommendationsSection";
import MediaView from "@/components/home/MediaView";
import DoramaSections from "@/components/home/sections/DoramaSections";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import SearchResults from "@/components/home/SearchResults";
import WatchHistory from "@/components/home/WatchHistory";
import TrialNotification from "@/components/home/TrialNotification";
import MediaSection from "@/components/MediaSection";
import useHomePageData from "@/hooks/useHomePageData";

const Home = () => {
  const navigate = useNavigate();
  
  // Get data from the useHomePageData hook
  const {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    featuredMedia,
    recommendations = [],
    moviesData = [],
    seriesData = [],
    doramasData = [],
    actionMoviesData = [],
    comedyMoviesData = [],
    adventureMoviesData = [],
    sciFiMoviesData = [],
    marvelMoviesData = [],
    dcMoviesData = [],
    popularContent = [],
    isLoading,
    hasError,
    searchResults = [],
    isSearchLoading,
    sectionData = {},
    handleLoadMoreSection,
    trilogiesData = [],
    horrorMoviesData = [],
    popularInBrazilData = [],
  } = useHomePageData();

  // Make sure all provided data is array
  const safeMovies = Array.isArray(moviesData) ? moviesData : [];
  const safeSeriesData = Array.isArray(seriesData) ? seriesData : [];

  // State for search functionality
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const handleMovieClick = useCallback((movie: MediaItem) => {
    navigate(`/filme/${movie.id}`);
  }, [navigate]);

  const handleSeriesClick = useCallback((series: MediaItem) => {
    navigate(`/serie/${series.id}`);
  }, [navigate]);

  const handleDoramaClick = useCallback((dorama: MediaItem) => {
    navigate(`/dorama/${dorama.id}`);
  }, [navigate]);

  const handlePlayFeatured = useCallback(() => {
    if (featuredMedia) {
      if (featuredMedia.media_type === 'movie') {
        navigate(`/filme/${featuredMedia.id}`);
      } else if (featuredMedia.media_type === 'tv') {
        navigate(`/serie/${featuredMedia.id}`);
      }
    }
  }, [navigate, featuredMedia]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState message={hasError.toString()} />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

  if (!hasAccess && !hasTrialAccess) {
    return (
      <>
        <Navbar />
   
        <HomeHeader 
          featuredMedia={featuredMedia}
          isAdmin={isAdmin}
          hasAccess={hasAccess}
          hasTrialAccess={hasTrialAccess}
          trialEnd={null}
          searchQuery={searchQuery}
          showFullContent={false}
          onButtonClick={handlePlayFeatured}
        />
             <LargeSubscriptionUpsell />
        <main className="container mx-auto px-4">
          {isSearching && (
            <div className="py-10 text-center">
              <div className="spinner mb-4"></div>
              <p className="text-white">Buscando resultados...</p>
            </div>
          )}
          
          {searchQuery && !isSearching && (
            <SearchResults 
              results={searchResults}
              onMovieClick={handleMovieClick}
              onSeriesClick={handleSeriesClick}
            />
          )}
          
          {!searchQuery && (
            <>
              {recommendations.length > 0 && (
                <section className="mb-12">
                  <RecommendationsSection 
                    recommendations={recommendations} 
                    onLoadMore={() => handleLoadMoreSection('recommendations')}
                    isLoading={false}
                    hasMore={true}
                  />
                </section>
              )}
              
              <section className="mb-12">
                <WatchHistory 
                  watchHistory={safeMovies.slice(0, 5) || []} 
                  onMediaClick={handleMovieClick}
                />
              </section>

              <MediaView
                title="Filmes"
                type="movie"
                mediaItems={safeMovies || []}
                trendingItems={moviesData || []}
                topRatedItems={actionMoviesData || []}
                recentItems={comedyMoviesData || []}
                sectionLoading={false}
                onMediaClick={handleMovieClick}
                onLoadMoreTrending={() => handleLoadMoreSection('movies')}
                onLoadMoreTopRated={() => handleLoadMoreSection('actionMovies')}
                onLoadMoreRecent={() => handleLoadMoreSection('comedyMovies')}
                hasMoreTrending={true}
                hasMoreTopRated={true}
                hasMoreRecent={true}
                trendingTitle="Em Alta"
                topRatedTitle="Ação e Aventura"
                recentTitle="Comédia"
                focusedSection={0}
                focusedItem={0}
              />
              
              <MediaView
                title="Séries"
                type="tv"
                mediaItems={safeSeriesData || []}
                trendingItems={safeSeriesData || []}
                topRatedItems={Array.isArray(popularContent) ? popularContent.slice(0, 10) : []}
                recentItems={Array.isArray(seriesData) ? seriesData.slice(10, 20) : []}
                sectionLoading={false}
                onMediaClick={handleSeriesClick}
                onLoadMoreTrending={() => handleLoadMoreSection('series')}
                onLoadMoreTopRated={() => {}}
                onLoadMoreRecent={() => {}}
                hasMoreTrending={true}
                hasMoreTopRated={false}
                hasMoreRecent={false}
                trendingTitle="Séries Populares"
                topRatedTitle="Mais Bem Avaliadas"
                recentTitle="Recentes"
                focusedSection={0}
                focusedItem={0}
              />
              
              <DoramaSections 
                doramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path;
                }).slice(0, 10) || []}
                topRatedDoramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path && d.vote_average >= 7.0;
                }).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 10) || []}
                popularDoramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path && d.popularity > 50;
                }).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 10) || []}
                koreanMovies={[]}
                onMediaClick={handleDoramaClick}
                onLoadMore={() => {}}
                isLoading={false}
                hasMore={false}
              />
              
              {/* Seção de Filmes Populares */}
              <div className="mb-10">
                <MediaSection 
                  title="Filmes Populares"
                  medias={moviesData}
                  showLoadMore={true}
                  onLoadMore={() => handleLoadMoreSection('movies')}
                  sectionIndex={0}
                />
              </div>

              {/* Seção da Marvel */}
              {marvelMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Marvel"
                    medias={marvelMoviesData}
                    showLoadMore={false}
                    sectionIndex={1}
                  />
                </div>
              )}

              {/* Seção da DC */}
              {dcMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="DC Comics"
                    medias={dcMoviesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={2}
                  />
                </div>
              )}

              {/* Seção de Filmes de Terror */}
              {horrorMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Filmes de Terror"
                    medias={horrorMoviesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={3}
                  />
                </div>
              )}

              {/* Seção de Populares no Brasil */}
              {popularInBrazilData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Populares no Brasil"
                    medias={popularInBrazilData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={4}
                  />
                </div>
              )}

              {/* Seção de Trilogias */}
              {trilogiesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Trilogias e Franquias"
                    medias={trilogiesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={5}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </>
    );
  }

  return (
    <div className="bg-netflix-background min-h-screen">
      <div className={hasTrialAccess ? "pt-10" : ""}>
        <Navbar />
        
        <HomeHeader 
          featuredMedia={featuredMedia}
          isAdmin={isAdmin}
          hasAccess={hasAccess}
          hasTrialAccess={hasTrialAccess}
          trialEnd={null}
          searchQuery={searchQuery}
          showFullContent={false}
          onButtonClick={handlePlayFeatured}
        />
        
        <main className="container mx-auto px-4">
          {isSearching && (
            <div className="py-10 text-center">
              <div className="spinner mb-4"></div>
              <p className="text-white">Buscando resultados...</p>
            </div>
          )}
          
          {searchQuery && !isSearching && (
            <SearchResults 
              results={searchResults}
              onMovieClick={handleMovieClick}
              onSeriesClick={handleSeriesClick}
            />
          )}
          
          {!searchQuery && (
            <>
              {recommendations.length > 0 && (
                <section className="mb-12">
                  <RecommendationsSection 
                    recommendations={recommendations} 
                    onLoadMore={() => handleLoadMoreSection('recommendations')}
                    isLoading={false}
                    hasMore={true}
                  />
                </section>
              )}
              
              <section className="mb-12">
                <WatchHistory 
                  watchHistory={safeMovies.slice(0, 5) || []} 
                  onMediaClick={handleMovieClick}
                />
              </section>

              <MediaView
                title="Filmes"
                type="movie"
                mediaItems={safeMovies || []}
                trendingItems={moviesData || []}
                topRatedItems={actionMoviesData || []}
                recentItems={comedyMoviesData || []}
                sectionLoading={false}
                onMediaClick={handleMovieClick}
                onLoadMoreTrending={() => handleLoadMoreSection('movies')}
                onLoadMoreTopRated={() => handleLoadMoreSection('actionMovies')}
                onLoadMoreRecent={() => handleLoadMoreSection('comedyMovies')}
                hasMoreTrending={true}
                hasMoreTopRated={true}
                hasMoreRecent={true}
                trendingTitle="Em Alta"
                topRatedTitle="Ação e Aventura"
                recentTitle="Comédia"
                focusedSection={0}
                focusedItem={0}
              />
              
              <MediaView
                title="Séries"
                type="tv"
                mediaItems={safeSeriesData || []}
                trendingItems={safeSeriesData || []}
                topRatedItems={Array.isArray(popularContent) ? popularContent.slice(0, 10) : []}
                recentItems={Array.isArray(seriesData) ? seriesData.slice(10, 20) : []}
                sectionLoading={false}
                onMediaClick={handleSeriesClick}
                onLoadMoreTrending={() => handleLoadMoreSection('series')}
                onLoadMoreTopRated={() => {}}
                onLoadMoreRecent={() => {}}
                hasMoreTrending={true}
                hasMoreTopRated={false}
                hasMoreRecent={false}
                trendingTitle="Séries Populares"
                topRatedTitle="Mais Bem Avaliadas"
                recentTitle="Recentes"
                focusedSection={0}
                focusedItem={0}
              />
              
              <DoramaSections 
                doramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path;
                }).slice(0, 10) || []}
                topRatedDoramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path && d.vote_average >= 7.0;
                }).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 10) || []}
                popularDoramas={doramasData?.filter(d => {
                  const year = new Date(d.first_air_date || d.release_date || '').getFullYear();
                  return year >= new Date().getFullYear() - 5 && d.poster_path && d.popularity > 50;
                }).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 10) || []}
                koreanMovies={[]}
                onMediaClick={handleDoramaClick}
                onLoadMore={() => {}}
                isLoading={false}
                hasMore={false}
              />
              
              {/* Seção de Filmes Populares */}
              <div className="mb-10">
                <MediaSection 
                  title="Filmes Populares"
                  medias={moviesData}
                  showLoadMore={true}
                  onLoadMore={() => handleLoadMoreSection('movies')}
                  sectionIndex={0}
                />
              </div>

              {/* Seção da Marvel */}
              {marvelMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Marvel"
                    medias={marvelMoviesData}
                    showLoadMore={false}
                    sectionIndex={1}
                  />
                </div>
              )}

              {/* Seção da DC */}
              {dcMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="DC Comics"
                    medias={dcMoviesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={2}
                  />
                </div>
              )}

              {/* Seção de Filmes de Terror */}
              {horrorMoviesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Filmes de Terror"
                    medias={horrorMoviesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={3}
                  />
                </div>
              )}

              {/* Seção de Populares no Brasil */}
              {popularInBrazilData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Populares no Brasil"
                    medias={popularInBrazilData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={4}
                  />
                </div>
              )}

              {/* Seção de Trilogias */}
              {trilogiesData?.length > 0 && (
                <div className="mb-10">
                  <MediaSection 
                    title="Trilogias e Franquias"
                    medias={trilogiesData}
                    showLoadMore={false}
                    onLoadMore={() => {}}
                    sectionIndex={5}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
