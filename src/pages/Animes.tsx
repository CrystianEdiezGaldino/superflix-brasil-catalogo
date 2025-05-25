
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Import custom hook
import { useAnimeData } from "@/hooks/anime/useAnimeData";

// Import components
import AnimeCarousel from "@/components/anime/AnimeCarousel";
import AnimeSectionGrid from "@/components/anime/AnimeSectionGrid";
import AllAnimesSection from "@/components/anime/AllAnimesSection";
import AdultContentSection from "@/components/anime/AdultContentSection";
import HentaiSection from "@/components/anime/HentaiSection";
import AnimeFilters from "@/components/anime/AnimeFilters";

const Animes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isHentaiVisible, setIsHentaiVisible] = useState(false);
  
  // Use our custom hook for anime data
  const {
    featuredAnimes,
    recentReleases,
    topRatedAnimes,
    adultContent,
    isAdultContentVisible,
    displayedAnimes,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMoreAnimes,
    toggleAdultContent
  } = useAnimeData();

  // Mock hentai data - você pode substituir por dados reais da API
  const hentaiList: MediaItem[] = [
    {
      id: 999001,
      name: "High School DxD",
      overview: "Anime de comédia romântica com elementos sobrenaturais.",
      poster_path: "/example1.jpg",
      backdrop_path: "/example1_bg.jpg",
      first_air_date: "2012-01-06",
      media_type: "tv",
      vote_average: 7.2,
      vote_count: 500,
      original_language: "ja",
      original_name: "ハイスクールD×D",
      popularity: 45.6,
      adult: true
    },
    {
      id: 999002,
      name: "Prison School",
      overview: "Comédia escolar com elementos adultos.",
      poster_path: "/example2.jpg",
      backdrop_path: "/example2_bg.jpg",
      first_air_date: "2015-07-11",
      media_type: "tv",
      vote_average: 7.8,
      vote_count: 300,
      original_language: "ja",
      original_name: "監獄学園",
      popularity: 38.2,
      adult: true
    }
  ];

  // Navigate to anime details
  const handleMediaClick = (anime: MediaItem) => {
    navigate(`/anime/${anime.id}`);
  };

  // Handle hentai visibility toggle
  const toggleHentaiVisibility = (password: string) => {
    if (!password) {
      setIsHentaiVisible(false);
      return true;
    }
    
    if (password === "admin123" || password === "senha123" || password === "password") {
      setIsHentaiVisible(true);
      return true;
    }
    
    return false;
  };
  
  // Filter animes based on search and filters
  const filteredAnimes = React.useMemo(() => {
    // Função para verificar se o texto contém apenas caracteres japoneses
    const isJapaneseOnly = (text: string) => {
      const japaneseRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+$/;
      return japaneseRegex.test(text);
    };

    const isValidAnime = (anime: MediaItem) => {
      const hasImage = anime.poster_path || anime.backdrop_path;
      const title = anime.name || anime.title || '';
      return hasImage && !isJapaneseOnly(title);
    };

    const validAnimes = displayedAnimes.filter(isValidAnime);
    
    if (!searchQuery && !yearFilter && !ratingFilter) {
      return validAnimes;
    }
    
    return validAnimes.filter(anime => {
      if (searchQuery) {
        const title = (anime.name || anime.title || '').toLowerCase();
        const overview = (anime.overview || '').toLowerCase();
        if (!title.includes(searchQuery.toLowerCase()) && !overview.includes(searchQuery.toLowerCase())) {
          return false;
        }
      }
      
      if (yearFilter) {
        const releaseYear = new Date(anime.first_air_date || anime.release_date || '').getFullYear();
        if (releaseYear !== yearFilter) {
          return false;
        }
      }
      
      if (ratingFilter && anime.vote_average < ratingFilter) {
        return false;
      }
      
      return true;
    });
  }, [displayedAnimes, searchQuery, yearFilter, ratingFilter]);
  
  // Check if we're filtering
  const isFiltering = !!searchQuery || !!yearFilter || !!ratingFilter;

  // Loading state
  if (isLoading && displayedAnimes.length === 0) {
    return <AnimeLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Featured Anime Carousel - only show when not filtering */}
        {!isFiltering && featuredAnimes.length > 0 && (
          <AnimeCarousel 
            animes={featuredAnimes} 
            onAnimeClick={handleMediaClick}
            autoPlay={true}
          />
        )}

        {/* Search and Filters */}
        <AnimeFilters 
          onSearch={setSearchQuery}
          onFilterYear={setYearFilter}
          onFilterRating={setRatingFilter}
          onResetFilters={() => {
            setSearchQuery("");
            setYearFilter(null);
            setRatingFilter(null);
          }}
          isFiltering={isFiltering}
        />

        {/* Content Tabs - only show when not filtering */}
        {!isFiltering && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-gray-800/50 p-1 rounded-lg w-full md:w-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
                Todos os Animes
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
                Lançamentos
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
                Populares
              </TabsTrigger>
              <TabsTrigger value="rated" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
                Bem Avaliados
              </TabsTrigger>
            </TabsList>

            <div className="space-y-16">
              <TabsContent value="all" className="space-y-16 mt-0">
                {/* Recent Releases */}
                {recentReleases.length > 0 && (
                  <AnimeSectionGrid
                    title="Lançamentos em Exibição"
                    animes={recentReleases}
                    icon={<Calendar className="mr-2 text-netflix-red" size={24} />}
                    onMediaClick={handleMediaClick}
                    isLoading={isLoading && recentReleases.length === 0}
                  />
                )}

                {/* Top Rated Animes */}
                {topRatedAnimes.length > 0 && (
                  <AnimeSectionGrid
                    title="Melhores Animes"
                    animes={topRatedAnimes}
                    icon={<Award className="mr-2 text-netflix-red" size={24} />}
                    onMediaClick={handleMediaClick}
                    isLoading={isLoading && topRatedAnimes.length === 0}
                    showGenres={true}
                  />
                )}

                {/* Hentai Section */}
                {hentaiList.length > 0 && (
                  <HentaiSection
                    title="Hentai"
                    hentais={hentaiList}
                    onMediaClick={handleMediaClick}
                    isVisible={isHentaiVisible}
                    onToggleVisibility={toggleHentaiVisibility}
                  />
                )}

                {/* Adult Content Section */}
                {adultContent.length > 0 && (
                  <AdultContentSection
                    title="Conteúdo Adulto"
                    animes={adultContent.slice(0, 24)}
                    onMediaClick={handleMediaClick}
                    isVisible={isAdultContentVisible}
                    onToggleVisibility={toggleAdultContent}
                  />
                )}

                {/* All Animes with Infinite Scroll */}
                <AllAnimesSection
                  animes={displayedAnimes}
                  isLoading={isLoading}
                  isFetchingMore={isFetchingMore}
                  hasMore={hasMore}
                  onLoadMore={loadMoreAnimes}
                  onMediaClick={handleMediaClick}
                />
              </TabsContent>

              <TabsContent value="new" className="mt-0">
                <AnimeSectionGrid
                  title="Lançamentos em Exibição"
                  animes={recentReleases}
                  icon={<Calendar className="mr-2 text-netflix-red" size={24} />}
                  onMediaClick={handleMediaClick}
                  isLoading={isLoading && recentReleases.length === 0}
                />
              </TabsContent>

              <TabsContent value="popular" className="mt-0">
                <AnimeSectionGrid
                  title="Animes Populares"
                  animes={featuredAnimes}
                  icon={<TrendingUp className="mr-2 text-netflix-red" size={24} />}
                  onMediaClick={handleMediaClick}
                  isLoading={isLoading && featuredAnimes.length === 0}
                />
              </TabsContent>

              <TabsContent value="rated" className="mt-0">
                <AnimeSectionGrid
                  title="Melhores Animes"
                  animes={topRatedAnimes}
                  icon={<Award className="mr-2 text-netflix-red" size={24} />}
                  onMediaClick={handleMediaClick}
                  isLoading={isLoading && topRatedAnimes.length === 0}
                  showGenres={true}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}

        {/* Filtered Results */}
        {isFiltering && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {searchQuery 
                ? `Resultados para "${searchQuery}"` 
                : "Resultados filtrados"}
              <span className="text-gray-400 text-lg ml-2">({filteredAnimes.length})</span>
            </h2>
            
            <AllAnimesSection
              animes={filteredAnimes}
              isLoading={false}
              isFetchingMore={false}
              hasMore={false}
              onLoadMore={() => {}}
              onMediaClick={handleMediaClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Loading state component
const AnimeLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Loading carousel */}
          <div className="h-[60vh] w-full rounded-xl bg-gray-800/50 animate-pulse" />
          
          {/* Loading filters */}
          <div className="h-12 w-full rounded-lg bg-gray-800/30 animate-pulse" />
          
          {/* Loading tabs */}
          <div className="h-12 w-full max-w-md rounded-lg bg-gray-800/30 animate-pulse" />
          
          {/* Loading sections */}
          {Array(3).fill(0).map((_, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="space-y-6">
              <div className="h-8 w-64 bg-gray-800/30 rounded animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array(12).fill(0).map((_, i) => (
                  <div key={`card-${sectionIndex}-${i}`} className="animate-pulse">
                    <div className="aspect-[2/3] bg-gray-800/30 rounded-lg mb-2" />
                    <div className="h-4 w-3/4 bg-gray-800/30 rounded mb-1" />
                    <div className="h-3 w-1/2 bg-gray-800/30 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Animes;
