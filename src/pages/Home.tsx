
import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import HomeHeader from "@/components/home/HomeHeader";
import { useAuth } from "@/contexts/AuthContext";
import MediaSection from "@/components/MediaSection";
import ContinueWatchingSection from "@/components/sections/ContinueWatchingSection";
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
import useHomePageData from "@/hooks/useHomePageData";
import AdultContentSection from "@/components/sections/AdultContentSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import SpecialCollectionsSection from "@/components/sections/SpecialCollectionsSection";
import GenreSection from "@/components/sections/GenreSection";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from the useHomePageData hook
  const {
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
  const continueWatchingItems = safeMovies.slice(0, 8); // Mock data for continue watching

  // Create different subsets of movies for various sections
  const familyMovies = safeMovies.slice(10, 25);
  const childrenMovies = safeMovies.slice(30, 45);
  const dubbedMovies = safeMovies.slice(40, 55);
  const subtitledMovies = safeMovies.slice(50, 65);
  const comicsBasedMovies = safeMovies.slice(60, 75);
  const bookBasedMovies = safeMovies.slice(70, 85);
  const renownedDirectorsMovies = safeMovies.slice(80, 95);
  const blockbusterMovies = safeMovies.slice(90, 105);
  const cultMovies = safeMovies.slice(100, 115);
  const shortFilms = safeMovies.slice(110, 125);
  const nostalgicMovies = safeMovies.slice(120, 135);
  
  // Create different subsets of series
  const teenSeries = safeSeriesData.slice(10, 25);
  const internationalSeries = safeSeriesData.slice(20, 35);

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
        
        <main className="container mx-auto px-4 pb-20">
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
              {/* Continue Watching Section - Added mt-16 for extra margin below navbar */}
              <section className="mb-12 mt-16">
                <ContinueWatchingSection 
                  items={continueWatchingItems}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Recommendations For You */}
              {recommendations.length > 0 && (
                <section className="mb-12">
                  <RecommendationsSection 
                    recommendations={recommendations} 
                    onLoadMore={() => handleLoadMoreSection('recommendations')}
                    isLoading={false}
                    hasMore={true}
                    title="Recomendados para você"
                  />
                </section>
              )}
              
              {/* Recent Releases */}
              <section className="mb-12">
                <MediaSection 
                  title="Lançamentos recentes"
                  medias={Array.isArray(popularContent) ? popularContent.slice(0, 15) : []}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={0}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Trending in Brazil */}
              <section className="mb-12">
                <MediaSection 
                  title="Tendências no Brasil"
                  medias={popularInBrazilData || safeMovies.slice(10, 25)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={1}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Adult Content with Password Protection */}
              <section className="mb-12">
                <AdultContentSection 
                  adultContent={safeMovies.slice(25, 45)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Most Watched Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes mais assistidos"
                  medias={safeMovies.slice(0, 15)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={2}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Popular Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries populares"
                  medias={safeSeriesData.slice(0, 15)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={3}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* NaflixTV Originals */}
              <section className="mb-12">
                <MediaSection 
                  title="Originais NaflixTV"
                  medias={safeSeriesData.slice(15, 30)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={4}
                  onMediaClick={handleSeriesClick}
                  className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-6 px-2 rounded-lg"
                />
              </section>
              
              {/* NaflixTV Exclusive */}
              <section className="mb-12">
                <MediaSection 
                  title="Exclusivos NaflixTV"
                  medias={safeSeriesData.slice(5, 20)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={5}
                  onMediaClick={handleSeriesClick}
                  className="bg-gradient-to-r from-purple-900/30 to-red-900/30 py-6 px-2 rounded-lg"
                />
              </section>

              {/* Documentaries and Biographies */}
              <section className="mb-12">
                <MediaSection 
                  title="Documentários e biografias"
                  medias={safeMovies.slice(200, 215)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={6}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Award-winning Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes premiados"
                  medias={safeMovies.slice(30, 45)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={7}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Cinema Classics */}
              <section className="mb-12">
                <MediaSection 
                  title="Clássicos do cinema"
                  medias={safeMovies.slice(45, 60)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={8}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Special Franchise Collections */}
              <section className="mb-12">
                <SpecialCollectionsSection 
                  marvelMovies={marvelMoviesData}
                  dcMovies={dcMoviesData}
                  harryPotterMovies={safeMovies.slice(70, 78)}
                  starWarsMovies={safeMovies.slice(78, 86)}
                  lordOfTheRingsMovies={safeMovies.slice(86, 94)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Movie Collections */}
              <section className="mb-12">
                <CollectionsSection 
                  trilogies={trilogiesData || safeMovies.slice(95, 110)}
                  batmanMovies={safeMovies.slice(110, 118)}
                  supermanMovies={safeMovies.slice(118, 126)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Genre Sections */}
              <section className="mb-12">
                <GenreSection 
                  title="Aventura sem limites"
                  medias={adventureMoviesData || safeMovies.slice(126, 140)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              <section className="mb-12">
                <GenreSection 
                  title="Ação eletrizante"
                  medias={actionMoviesData || safeMovies.slice(140, 154)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              <section className="mb-12">
                <GenreSection 
                  title="Ficção científica"
                  medias={sciFiMoviesData || safeMovies.slice(154, 168)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              <section className="mb-12">
                <GenreSection 
                  title="Terror e suspense"
                  medias={horrorMoviesData || safeMovies.slice(168, 182)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              <section className="mb-12">
                <GenreSection 
                  title="Comédias para maratonar"
                  medias={comedyMoviesData || safeMovies.slice(182, 196)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              <section className="mb-12">
                <MediaSection 
                  title="Romances e dramas"
                  medias={safeSeriesData.slice(30, 45)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={9}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              <section className="mb-12">
                <MediaSection 
                  title="Séries de comédia brasileiras"
                  medias={safeSeriesData.slice(45, 60)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={10}
                  onMediaClick={handleSeriesClick}
                />
              </section>
              
              {/* New sections being added */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries teen"
                  medias={teenSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={11}
                  onMediaClick={handleSeriesClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Séries internacionais premiadas"
                  medias={internationalSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={12}
                  onMediaClick={handleSeriesClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes para toda a família"
                  medias={familyMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={13}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes infantis e animações"
                  medias={childrenMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={14}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Lançamentos dublados"
                  medias={dubbedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={15}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes legendados"
                  medias={subtitledMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={16}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes baseados em HQs"
                  medias={comicsBasedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={17}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes inspirados em livros"
                  medias={bookBasedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={18}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Diretores renomados"
                  medias={renownedDirectorsMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={19}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Sucessos de bilheteria"
                  medias={blockbusterMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={20}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Filmes cult"
                  medias={cultMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={21}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Curtas-metragens"
                  medias={shortFilms}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={22}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              <section className="mb-12">
                <MediaSection 
                  title="Nostalgia dos anos 80/90"
                  medias={nostalgicMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={23}
                  onMediaClick={handleMovieClick}
                />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
