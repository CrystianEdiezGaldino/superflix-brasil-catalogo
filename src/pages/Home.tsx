
import React, { useCallback, useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import HomeHeader from "@/components/home/HomeHeader";
import { useAuth } from "@/contexts/AuthContext";
import MediaSection from "@/components/MediaSection";
import ContinueWatchingSection from "@/components/sections/ContinueWatchingSection";
import RecommendationsSection from "@/components/home/sections/RecommendationsSection";
import LoadingState from "@/components/home/LoadingState";
import ErrorState from "@/components/home/ErrorState";
import UnauthenticatedState from "@/components/home/UnauthenticatedState";
import LargeSubscriptionUpsell from "@/components/home/LargeSubscriptionUpsell";
import SearchResults from "@/components/home/SearchResults";
import useHomePageData from "@/hooks/useHomePageData";
import AdultContentSection from "@/components/sections/AdultContentSection";
// Optimized loading by using lazy loading for less critical components
const CollectionsSection = lazy(() => import("@/components/sections/CollectionsSection"));
const SpecialCollectionsSection = lazy(() => import("@/components/sections/SpecialCollectionsSection"));
const FamilyMoviesSection = lazy(() => import("@/components/sections/FamilyMoviesSection"));
const PopularTVSeriesSection = lazy(() => import("@/components/sections/PopularTVSeriesSection"));
import { usePopularTVSeries } from "@/hooks/usePopularTVSeries";

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

  // Get popular TV series
  const { popularTVSeries, isLoading: isSeriesLoading } = usePopularTVSeries(30);

  // Make sure all provided data is array
  const safeMovies = Array.isArray(moviesData) ? moviesData : [];
  const safeSeriesData = Array.isArray(seriesData) ? seriesData : [];
  const continueWatchingItems = safeMovies.slice(0, 8); // Mock data for continue watching

  // Create different subsets of movies for various sections
  const familyMovies = safeMovies; // Use all movies, filtering will happen in component
  const childrenMovies = safeMovies.slice(30, 80);
  const batmanMovies = safeMovies.slice(110, 130);
  const supermanMovies = safeMovies.slice(140, 160);
  
  // Reduce animations for better performance
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Look for reducedMotion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Add a class to the body to control animations
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

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
              {/* Continue Watching Section - Using mt-16 for extra margin below navbar */}
              <section className="mb-12 mt-16">
                <ContinueWatchingSection 
                  items={continueWatchingItems}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Popular Series in Brazil */}
              <section className="mb-12">
                <PopularTVSeriesSection
                  title="Séries Populares no Brasil"
                  series={popularTVSeries}
                  onSeriesClick={handleSeriesClick}
                  isLoading={isSeriesLoading}
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
                    onMediaClick={handleMovieClick}
                  />
                </section>
              )}
              
              {/* Recent Releases */}
              <section className="mb-12">
                <MediaSection 
                  title="Lançamentos recentes"
                  medias={Array.isArray(popularContent) ? popularContent.slice(0, 50) : []}
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
                  medias={popularInBrazilData || safeMovies.slice(10, 60)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={1}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Collections Section */}
              <Suspense fallback={<div className="w-full h-40 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>}>
                <section className="mb-12">
                  <CollectionsSection 
                    trilogies={trilogiesData || safeMovies.slice(95, 110)}
                    batmanMovies={batmanMovies}
                    supermanMovies={supermanMovies}
                    onMediaClick={handleMovieClick}
                  />
                </section>
              </Suspense>

              {/* Family Movies Section (Grid Layout) */}
              <Suspense fallback={<div className="w-full h-40 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>}>
                <section className="mb-12">
                  <FamilyMoviesSection
                    title="Filmes para toda a família"
                    movies={familyMovies}
                    onMediaClick={handleMovieClick}
                  />
                </section>
              </Suspense>

              {/* Adult Content with Password Protection */}
              <section className="mb-12">
                <AdultContentSection 
                  adultContent={safeMovies.slice(25, 75)}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Most Watched Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes mais assistidos"
                  medias={safeMovies.slice(0, 50)}
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
                  medias={safeSeriesData.slice(0, 50)}
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
                  medias={safeSeriesData.slice(15, 65)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={4}
                  onMediaClick={handleSeriesClick}
                  className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-6 px-2 rounded-lg"
                />
              </section>
              
              {/* Action Without Limits */}
              <section className="mb-12">
                <MediaSection 
                  title="Ação sem limites"
                  medias={actionMoviesData || safeMovies.slice(140, 190)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={7}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Epic Adventure */}
              <section className="mb-12">
                <MediaSection 
                  title="Aventura épica"
                  medias={adventureMoviesData || safeMovies.slice(126, 176)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={8}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Science Fiction and Dystopian Futures */}
              <section className="mb-12">
                <MediaSection 
                  title="Ficção científica e futuros distópicos"
                  medias={sciFiMoviesData || safeMovies.slice(154, 204)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={9}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Suspense and Horror */}
              <section className="mb-12">
                <MediaSection 
                  title="Suspense e terror"
                  medias={horrorMoviesData || safeMovies.slice(168, 218)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={10}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* DC Universe */}
              <section className="mb-12">
                <MediaSection 
                  title="Universo DC (Batman, Superman, Mulher-Maravilha, etc.)"
                  medias={dcMoviesData || safeMovies.slice(118, 168)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={12}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Marvel Universe */}
              <section className="mb-12">
                <MediaSection 
                  title="Universo Marvel (Homem-Aranha, Vingadores, etc.)"
                  medias={marvelMoviesData || safeMovies.slice(110, 160)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={13}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Special Franchise Collections */}
              <Suspense fallback={<div className="w-full h-40 flex-none bg-gray-800/60 rounded-md animate-pulse"></div>}>
                <section className="mb-12">
                  <SpecialCollectionsSection 
                    marvelMovies={marvelMoviesData}
                    dcMovies={dcMoviesData}
                    harryPotterMovies={safeMovies.slice(190, 210)}
                    starWarsMovies={safeMovies.slice(180, 200)}
                    lordOfTheRingsMovies={safeMovies.slice(200, 220)}
                    onMediaClick={handleMovieClick}
                  />
                </section>
              </Suspense>

              {/* Animations and Kids Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Animações e filmes infantis"
                  medias={childrenMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={25}
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
