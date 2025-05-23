
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import FeaturedAnimeCarousel from "@/components/anime/FeaturedAnimeCarousel";
import AnimeSection from "@/components/anime/AnimeSection";
import AllAnimesSection from "@/components/anime/AllAnimesSection";
import AdultContentSection from "@/components/anime/AdultContentSection";
import AnimeFilters from "@/components/anime/AnimeFilters";
import { useAnimeListings } from "@/hooks/anime/useAnimeListings";
import { useAnimeSearch } from "@/hooks/anime/useAnimeSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { 
  Calendar, 
  TrendingUp,
  Award,
} from "lucide-react";

const Animes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use our custom hook for anime listings
  const {
    allAnimes,
    displayedAnimes,
    sections,
    isLoading,
    isLoadingMore,
    hasMore,
    loadingRef,
    handleLoadMore
  } = useAnimeListings();

  // Search and filter functionality
  const {
    filteredAnimes,
    isFiltering,
    isSearching,
    handleSearch,
    handleYearFilter,
    handleRatingFilter,
    resetFilters
  } = useAnimeSearch({ allAnimes });

  // Setup infinite scroll
  useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: isLoadingMore
  });

  // Navigate to anime
  const handleMediaClick = (anime: MediaItem) => {
    navigate(`/anime/${anime.id}`);
  };

  // Active tab state
  const [activeTab, setActiveTab] = React.useState('all');

  // Loading state
  if (isLoading) {
    return <AnimeLoadingState />;
  }

  // Determine which animes to display
  const displayAnimes = isFiltering || isSearching ? filteredAnimes : displayedAnimes;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Featured Anime Carousel - only show when not filtering */}
        {!isFiltering && !isSearching && (
          <FeaturedAnimeCarousel 
            animes={sections.featured} 
            onAnimeClick={handleMediaClick} 
          />
        )}

        {/* Search and Filters */}
        <AnimeFilters 
          onSearch={handleSearch}
          onFilterYear={handleYearFilter}
          onFilterRating={handleRatingFilter}
          onResetFilters={resetFilters}
          isFiltering={isFiltering}
        />

        {/* Content Tabs - only show when not filtering */}
        {!isFiltering && !isSearching && (
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
          </Tabs>
        )}

        {/* Filtered Results */}
        {(isFiltering || isSearching) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {isSearching 
                ? `Resultados para "${handleSearch}"` 
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
              loadingRef={loadingRef}
            />
          </div>
        )}

        {/* Anime Sections - only show when not filtering */}
        {!isFiltering && !isSearching && (
          <div className="space-y-16">
            {/* Recent Releases */}
            <AnimeSection
              title="Lançamentos em Exibição"
              animes={sections.recent}
              icon={<Calendar className="mr-2 text-netflix-red" size={24} />}
              onMediaClick={handleMediaClick}
            />

            {/* Trending Animes */}
            <AnimeSection
              title="Em Alta"
              animes={sections.trending}
              icon={<TrendingUp className="mr-2 text-netflix-red" size={24} />}
              onMediaClick={handleMediaClick}
            />

            {/* Top Rated Animes */}
            <AnimeSection
              title="Melhores Animes"
              animes={sections.topRated}
              icon={<Award className="mr-2 text-netflix-red" size={24} />}
              onMediaClick={handleMediaClick}
            />

            {/* Adult Content Section */}
            {sections.adult.length > 0 && (
              <AdultContentSection
                title="Conteúdo Adulto"
                animes={sections.adult.slice(0, 12)}
                onMediaClick={handleMediaClick}
              />
            )}

            {/* All Animes with Infinite Scroll */}
            <AllAnimesSection
              animes={displayedAnimes}
              isLoading={isLoading}
              isFetchingMore={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onMediaClick={handleMediaClick}
              loadingRef={loadingRef}
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
          <div className="h-[50vh] w-full rounded-xl bg-gray-800/50 animate-pulse" />
          
          {/* Loading filters */}
          <div className="h-12 w-full rounded-lg bg-gray-800/30 animate-pulse" />
          
          {/* Loading tabs */}
          <div className="h-16 w-full rounded-lg bg-gray-800/30 animate-pulse" />
          
          {/* Loading sections */}
          {Array(3).fill(0).map((_, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="space-y-8">
              <div className="h-8 w-64 bg-gray-800/30 rounded animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array(12).fill(0).map((_, i) => (
                  <div key={`card-${sectionIndex}-${i}`} className="aspect-[2/3] w-full rounded-lg bg-gray-800/30 animate-pulse" />
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
