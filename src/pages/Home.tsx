import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useContentSections } from "@/hooks/home/useContentSections";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import HomeHeader from "@/components/home/HomeHeader";
import RecommendationsSection from "@/components/home/sections/RecommendationsSection";
import MediaView from "@/components/home/MediaView";
import AnimeSections from "@/components/home/sections/AnimeSections";
import DoramaSections from "@/components/home/sections/DoramaSections";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import SearchResults from "@/components/home/SearchResults";
import WatchHistory from "@/components/home/WatchHistory";
import AdminIndicator from "@/components/home/AdminIndicator";
import TrialNotification from "@/components/home/TrialNotification";
import { sectionData } from "autoprefixer";

const Home = () => {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    featuredMedia,
    recommendations,
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    marvelMoviesData,
    dcMoviesData,
    popularSeries,
    recentAnimes,
    movies,
    isLoading,
    isLoadingMore,
    hasMore,
    hasError,
    searchQuery,
    searchResults,
    isSearching,
    currentSection,
    handleSearch,
    handleLoadMoreSection,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    sectionData: allSectionData
  } = useContentSections();

  const handleMovieClick = useCallback((movie: MediaItem) => {
    navigate(`/filme/${movie.id}`);
  }, [navigate]);

  const handleSeriesClick = useCallback((series: MediaItem) => {
    navigate(`/serie/${series.id}`);
  }, [navigate]);

  const handleAnimeClick = useCallback((anime: MediaItem) => {
    navigate(`/anime/${anime.id}`);
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
    return <ErrorState message={hasError} />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

  if (!hasAccess && !hasTrialAccess) {
    return (
      <>
        <Navbar />
        <LargeSubscriptionUpsell />
      </>
    );
  }

  return (
    <div className="bg-netflix-background min-h-screen">
      <Navbar />
      
      {isAdmin && <AdminIndicator />}
      
      {hasTrialAccess && <TrialNotification />}
      
      <HomeHeader 
        featuredMedia={featuredMedia} 
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
            query={searchQuery}
            onMovieClick={handleMovieClick}
            onSeriesClick={handleSeriesClick}
            onAnimeClick={handleAnimeClick}
          />
        )}
        
        {!searchQuery && (
          <>
            {recommendations.length > 0 && (
              <section className="mb-12">
                <RecommendationsSection 
                  recommendations={recommendations} 
                  onLoadMore={() => handleLoadMoreSection('recommendations')}
                  isLoading={currentSection === 'recommendations' && isLoadingMore}
                  hasMore={true}
                />
              </section>
            )}
            
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Continue Assistindo</h2>
              <WatchHistory limit={5} />
            </section>

            <MediaView
              title="Filmes"
              type="movie"
              mediaItems={movies || []}
              trendingItems={moviesData || []}
              topRatedItems={actionMoviesData || []}
              recentItems={comedyMoviesData || []}
              sectionLoading={currentSection === 'movies' && isLoadingMore}
              onMediaClick={handleMovieClick}
              onLoadMoreTrending={() => handleLoadMoreSection('movies')}
              onLoadMoreTopRated={() => handleLoadMoreSection('actionMovies')}
              onLoadMoreRecent={() => handleLoadMoreSection('comedyMovies')}
              hasMoreTrending={allSectionData.movies?.hasMore || true}
              hasMoreTopRated={allSectionData.actionMovies?.hasMore || true}
              hasMoreRecent={allSectionData.comedyMovies?.hasMore || true}
              trendingTitle="Em Alta"
              topRatedTitle="Ação e Aventura"
              recentTitle="Comédia"
              focusedSection={0}
              focusedItem={0}
            />
            
            <MediaView
              title="Séries"
              type="tv"
              mediaItems={seriesData || []}
              trendingItems={seriesData || []}
              topRatedItems={popularSeries || []}
              recentItems={seriesData?.slice(10, 20) || []}
              sectionLoading={currentSection === 'series' && isLoadingMore}
              onMediaClick={handleSeriesClick}
              onLoadMoreTrending={() => handleLoadMoreSection('series')}
              onLoadMoreTopRated={() => {}}
              onLoadMoreRecent={() => {}}
              hasMoreTrending={allSectionData.series?.hasMore || true}
              hasMoreTopRated={false}
              hasMoreRecent={false}
              trendingTitle="Séries Populares"
              topRatedTitle="Mais Bem Avaliadas"
              recentTitle="Recentes"
              focusedSection={0}
              focusedItem={0}
            />
            
            <div className="mb-16">
              <AnimeSections 
                animes={animeData || []}
                topRatedAnimes={topRatedAnimeData || []}
                popularAnimes={animeData?.slice(5, 10) || []}
                recentAnimes={recentAnimes || []}
                onMediaClick={handleAnimeClick}
                onLoadMore={handleLoadMoreSection}
                isLoading={currentSection.includes('anime') && isLoadingMore}
                hasMore={true}
              />
            </div>
            
            <DoramaSections 
              doramas={doramasData || []}
              topRatedDoramas={doramasData?.slice(5, 10) || []}
              popularDoramas={doramasData?.slice(10, 15) || []}
              koreanMovies={doramasData?.slice(15, 20) || []}
              onMediaClick={handleDoramaClick}
              onLoadMore={handleLoadMoreSection}
              isLoading={currentSection.includes('dorama') && isLoadingMore}
              hasMore={true}
            />
            
            {(marvelMoviesData?.length > 0 || dcMoviesData?.length > 0) && (
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Universos</h2>
                
                {marvelMoviesData?.length > 0 && (
                  <div className="mb-10">
                    <MediaSection 
                      title="Marvel"
                      medias={marvelMoviesData}
                      showLoadMore={false}
                      onLoadMore={() => {}}
                      isLoading={false}
                      onMediaClick={handleMovieClick}
                      sectionId="marvel"
                      mediaType="movie"
                      sectionIndex={0}
                    />
                  </div>
                )}
                
                {dcMoviesData?.length > 0 && (
                  <div>
                    <MediaSection 
                      title="DC"
                      medias={dcMoviesData}
                      showLoadMore={false}
                      onLoadMore={() => {}}
                      isLoading={false}
                      onMediaClick={handleMovieClick}
                      sectionId="dc"
                      mediaType="movie"
                      sectionIndex={1}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
