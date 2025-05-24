
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
import { GENRE_IDS, DIRECTOR_IDS, FRANCHISE_KEYWORDS } from "@/services/tmdb/genres";

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
    // Add more data from the hook as needed
  } = useHomePageData();

  // Make sure all provided data is array
  const safeMovies = Array.isArray(moviesData) ? moviesData : [];
  const safeSeriesData = Array.isArray(seriesData) ? seriesData : [];
  const continueWatchingItems = safeMovies.slice(0, 8); // Mock data for continue watching

  // Create different subsets of movies for various sections
  const familyMovies = safeMovies.slice(10, 60);
  const childrenMovies = safeMovies.slice(30, 80);
  const dubbedMovies = safeMovies.slice(40, 90);
  const subtitledMovies = safeMovies.slice(50, 100);
  const comicsBasedMovies = safeMovies.slice(60, 110);
  const bookBasedMovies = safeMovies.slice(70, 120);
  const renownedDirectorsMovies = safeMovies.slice(80, 130);
  const blockbusterMovies = safeMovies.slice(90, 140);
  const cultMovies = safeMovies.slice(100, 150);
  const shortFilms = safeMovies.slice(110, 160);
  const nostalgicMovies = safeMovies.slice(120, 170);
  const brazilianMovies = safeMovies.slice(130, 180);
  const lgbtMovies = safeMovies.slice(140, 190);
  const warMovies = safeMovies.slice(150, 200);
  const thrillerMovies = safeMovies.slice(160, 210);
  const psychologicalThrillerMovies = safeMovies.slice(170, 220);
  
  // Special franchise subsets
  const starWarsMovies = safeMovies.slice(180, 195);
  const harryPotterMovies = safeMovies.slice(190, 205);
  const lotrMovies = safeMovies.slice(200, 215);
  const tolkienMovies = safeMovies.slice(210, 225);
  const ghibliMovies = safeMovies.slice(220, 235);
  
  // Directors collections
  const nolanMovies = safeMovies.slice(230, 245);
  const tarantinoMovies = safeMovies.slice(240, 255);
  const spielbergMovies = safeMovies.slice(250, 265);
  
  // Special categories
  const newThisWeekMovies = safeMovies.slice(260, 310);
  const last30DaysMovies = safeMovies.slice(270, 320);
  const indieMovies = safeMovies.slice(280, 330);
  const asianActionMovies = safeMovies.slice(290, 340);
  const weekendBingeContent = [...safeMovies.slice(300, 325), ...safeSeriesData.slice(30, 55)];
  const nostalgic2000sContent = safeMovies.slice(310, 360);
  
  // Create different subsets of series
  const teenSeries = safeSeriesData.slice(10, 60);
  const internationalSeries = safeSeriesData.slice(20, 70);
  const brazilianSeries = safeSeriesData.slice(30, 80);
  const popularBrazilianSeries = safeSeriesData.slice(40, 90);
  const crimeSeries = safeSeriesData.slice(50, 100);
  const realityShows = safeSeriesData.slice(60, 110);
  const crimeDocs = safeSeriesData.slice(70, 120);
  const periodSeries = safeSeriesData.slice(80, 130);
  const scifiFantasySeries = safeSeriesData.slice(90, 140);
  const dramaSeries = safeSeriesData.slice(100, 150);
  const shortSeries = safeSeriesData.slice(110, 160);
  const miniseries = safeSeriesData.slice(120, 170);

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
              
              {/* NaflixTV Exclusive */}
              <section className="mb-12">
                <MediaSection 
                  title="Exclusivos NaflixTV"
                  medias={safeSeriesData.slice(5, 55)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={5}
                  onMediaClick={handleSeriesClick}
                  className="bg-gradient-to-r from-purple-900/30 to-red-900/30 py-6 px-2 rounded-lg"
                />
              </section>

              {/* Series Popular in Brazil */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries populares no Brasil"
                  medias={popularBrazilianSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={6}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Action Without Limits - Grid Display */}
              <section className="mb-12">
                <MediaSection 
                  title="Ação sem limites"
                  medias={actionMoviesData || safeMovies.slice(140, 190)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={7}
                  onMediaClick={handleMovieClick}
                  displayStyle="grid"
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

              {/* Superhero Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de super-heróis"
                  medias={comicsBasedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={11}
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

              {/* Global Blockbusters */}
              <section className="mb-12">
                <MediaSection 
                  title="Sucessos de bilheteria mundial"
                  medias={blockbusterMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={14}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Award-winning Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes premiados (Oscar, Cannes, etc.)"
                  medias={safeMovies.slice(30, 80)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={15}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Teen Series - Grid Display */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries teen"
                  medias={teenSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={16}
                  onMediaClick={handleSeriesClick}
                  displayStyle="grid"
                />
              </section>
              
              {/* Acclaimed International Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries internacionais aclamadas"
                  medias={internationalSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={17}
                  onMediaClick={handleSeriesClick}
                />
              </section>
              
              {/* Brazilian Comedy Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries de comédia brasileiras"
                  medias={brazilianSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={18}
                  onMediaClick={handleSeriesClick}
                />
              </section>
              
              {/* Documentaries and Biographies */}
              <section className="mb-12">
                <MediaSection 
                  title="Documentários e biografias"
                  medias={safeMovies.slice(200, 250)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={19}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Movies Based on True Stories */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes baseados em fatos reais"
                  medias={safeMovies.slice(210, 260)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={20}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Trilogies and Sagas - Grid Display */}
              <section className="mb-12">
                <MediaSection 
                  title="Trilogias e sagas (Matrix, John Wick, Senhor dos Anéis)"
                  medias={trilogiesData || safeMovies.slice(95, 145)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={21}
                  onMediaClick={handleMovieClick}
                  displayStyle="grid"
                />
              </section>

              {/* Cinema Classics */}
              <section className="mb-12">
                <MediaSection 
                  title="Clássicos do cinema (anos 70, 80 e 90)"
                  medias={safeMovies.slice(45, 95)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={22}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Cult Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes cult"
                  medias={cultMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={23}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Asian Action Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de ação asiáticos"
                  medias={asianActionMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={24}
                  onMediaClick={handleMovieClick}
                />
              </section>

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

              {/* Weekend Binge Content */}
              <section className="mb-12">
                <MediaSection 
                  title="Conteúdos para maratonar no fim de semana"
                  medias={weekendBingeContent}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={26}
                  onMediaClick={(media) => {
                    if (media.media_type === 'tv') {
                      handleSeriesClick(media);
                    } else {
                      handleMovieClick(media);
                    }
                  }}
                />
              </section>

              {/* Movies Inspired by Books */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes inspirados em livros"
                  medias={bookBasedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={27}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* LGBTQIA+ Movies and Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes e séries LGBTQIA+"
                  medias={lgbtMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={28}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Nostalgic Content from 2000s */}
              <section className="mb-12">
                <MediaSection 
                  title="Conteúdo nostálgico dos anos 2000"
                  medias={nostalgic2000sContent}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={29}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* New This Week */}
              <section className="mb-12">
                <MediaSection 
                  title="Novidades da semana"
                  medias={newThisWeekMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={30}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Released in Last 30 Days */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes lançados recentemente (últimos 30 dias)"
                  medias={last30DaysMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={31}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Portuguese Dubbed Titles */}
              <section className="mb-12">
                <MediaSection 
                  title="Títulos dublados em português"
                  medias={dubbedMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={32}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Subtitled Titles with Original Audio */}
              <section className="mb-12">
                <MediaSection 
                  title="Títulos legendados com áudio original"
                  medias={subtitledMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={33}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Famous Directors' Films */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de diretores famosos (Nolan, Tarantino, Spielberg etc.)"
                  medias={renownedDirectorsMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={34}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Miniseries and Anthologies */}
              <section className="mb-12">
                <MediaSection 
                  title="Minisséries e antologias"
                  medias={miniseries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={35}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Crime and Investigation Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries policiais e de investigação"
                  medias={crimeSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={36}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Reality Shows and Competition Programs */}
              <section className="mb-12">
                <MediaSection 
                  title="Reality shows e programas de competição"
                  medias={realityShows}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={37}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Criminal Documentary Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries documentais criminais"
                  medias={crimeDocs}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={38}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Period and Historical Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries de época e históricas"
                  medias={periodSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={39}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Sci-fi and Fantasy Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries sci-fi e fantasia"
                  medias={scifiFantasySeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={40}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Drama Series */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries dramáticas"
                  medias={dramaSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={41}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Short Series (less than 6 episodes) */}
              <section className="mb-12">
                <MediaSection 
                  title="Séries curtas (menos de 6 episódios)"
                  medias={shortSeries}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={42}
                  onMediaClick={handleSeriesClick}
                />
              </section>

              {/* Featured Brazilian Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes brasileiros de destaque"
                  medias={brazilianMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={43}
                  onMediaClick={handleMovieClick}
                />
              </section>

              {/* Popular Releases in Brazil */}
              <section className="mb-12">
                <MediaSection 
                  title="Lançamentos populares no Brasil"
                  medias={popularInBrazilData || safeMovies.slice(130, 180)}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={44}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Star Wars Special */}
              <section className="mb-12">
                <MediaSection 
                  title="Especial Star Wars"
                  medias={starWarsMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={45}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Harry Potter Special */}
              <section className="mb-12">
                <MediaSection 
                  title="Especial Harry Potter"
                  medias={harryPotterMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={46}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Lord of the Rings Special */}
              <section className="mb-12">
                <MediaSection 
                  title="Especial Senhor dos Anéis"
                  medias={lotrMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={47}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Tolkien Universe Special */}
              <section className="mb-12">
                <MediaSection 
                  title="Especial Universo Tolkien"
                  medias={tolkienMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={48}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Studio Ghibli Special */}
              <section className="mb-12">
                <MediaSection 
                  title="Especial Studio Ghibli"
                  medias={ghibliMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={49}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Independent Productions */}
              <section className="mb-12">
                <MediaSection 
                  title="Produções independentes"
                  medias={indieMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={50}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* War Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de guerra"
                  medias={warMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={51}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Heist and Thriller Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de assalto e suspense"
                  medias={thrillerMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={52}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Psychological Thriller Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes de terror psicológico"
                  medias={psychologicalThrillerMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={53}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Special Franchise Collections */}
              <section className="mb-12">
                <SpecialCollectionsSection 
                  marvelMovies={marvelMoviesData}
                  dcMovies={dcMoviesData}
                  harryPotterMovies={harryPotterMovies}
                  starWarsMovies={starWarsMovies}
                  lordOfTheRingsMovies={lotrMovies}
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

              {/* Director's Collections */}
              <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Christopher Nolan</h3>
                    <MediaSection 
                      title=""
                      medias={nolanMovies}
                      showLoadMore={false}
                      onLoadMore={() => {}}
                      sectionIndex={54}
                      onMediaClick={handleMovieClick}
                      displayStyle="grid"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Quentin Tarantino</h3>
                    <MediaSection 
                      title=""
                      medias={tarantinoMovies}
                      showLoadMore={false}
                      onLoadMore={() => {}}
                      sectionIndex={55}
                      onMediaClick={handleMovieClick}
                      displayStyle="grid"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Steven Spielberg</h3>
                    <MediaSection 
                      title=""
                      medias={spielbergMovies}
                      showLoadMore={false}
                      onLoadMore={() => {}}
                      sectionIndex={56}
                      onMediaClick={handleMovieClick}
                      displayStyle="grid"
                    />
                  </div>
                </div>
              </section>

              {/* Family Movies */}
              <section className="mb-12">
                <MediaSection 
                  title="Filmes para toda a família"
                  medias={familyMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={57}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Nostalgic Movies from 80s/90s */}
              <section className="mb-12">
                <MediaSection 
                  title="Nostalgia dos anos 80/90"
                  medias={nostalgicMovies}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={58}
                  onMediaClick={handleMovieClick}
                />
              </section>
              
              {/* Short Films */}
              <section className="mb-12">
                <MediaSection 
                  title="Curtas-metragens"
                  medias={shortFilms}
                  showLoadMore={false}
                  onLoadMore={() => {}}
                  sectionIndex={59}
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
