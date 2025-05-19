
import { useNavigate } from "react-router-dom";
import { useAnimes } from "@/hooks/anime/useAnimes";
import MediaView from "@/components/media/MediaView";
import { MediaItem, getMediaTitle } from "@/types/movie";
import AnimeCarousel from "@/components/anime/AnimeCarousel";
import { toast } from "sonner";
import MediaSection from "@/components/MediaSection";

const AnimesPage = () => {
  const navigate = useNavigate();
  const {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    seasonalAnimes,
    animeSections,
    searchQuery,
    yearFilter,
    ratingFilter,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    isFiltering,
    isSearching,
    page,
    handleSearch,
    loadMoreAnimes,
    loadMoreForSection,
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useAnimes();

  // Handle media click to navigate to the detail page
  const handleMediaClick = (media: MediaItem) => {
    if (!media || !media.id) {
      toast.error("Não foi possível abrir este anime");
      return;
    }
    
    // Navigate to anime detail page using the same ID format as series
    // Isso garante que usaremos a API de séries para os animes
    navigate(`/anime/${media.id}`);
    console.log(`Navigating to anime with ID: ${media.id}, title: ${getMediaTitle(media)}`);
  };

  // Create wrapper functions to convert string to number for the filters
  const handleYearFilterChange = (year: string) => {
    setYearFilter(year === "all" ? 0 : parseInt(year));
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating === "all" ? 0 : parseFloat(rating));
  };

  return (
    <MediaView
      title="Animes Dublados em Português"
      type="anime"
      mediaItems={animes}
      topRatedItems={topRatedAnimes}
      trendingItems={trendingAnimes}
      recentItems={recentAnimes}
      popularItems={animeSections?.popularAnime}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      yearFilter={yearFilter?.toString() || "all"}
      ratingFilter={ratingFilter?.toString() || "all"}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onYearFilterChange={handleYearFilterChange}
      onRatingFilterChange={handleRatingFilterChange}
      onLoadMore={loadMoreAnimes}
      onResetFilters={resetFilters}
      onMediaClick={handleMediaClick}
      focusedSection={0} // Add default focusedSection
    >
      {/* Featured Anime Carousel */}
      {!isSearching && !isFiltering && animeSections?.featuredAnime?.length > 0 && (
        <AnimeCarousel 
          animes={animeSections.featuredAnime.slice(0, 10)} 
          onAnimeClick={handleMediaClick}
        />
      )}

      {/* Additional Anime Sections */}
      {!isSearching && !isFiltering && (
        <>
          {/* New Releases Section */}
          {animeSections?.newReleases?.length > 0 && (
            <MediaSection
              title="Lançamentos de Animes"
              medias={animeSections.newReleases}
              sectionId="newReleases"
              showLoadMore={true}
              onLoadMore={() => loadMoreForSection("newReleases")}
              onMediaClick={handleMediaClick}
              sectionIndex={0}
            />
          )}
          
          {/* Classic Anime Section */}
          {animeSections?.classicAnime?.length > 0 && (
            <MediaSection
              title="Animes Clássicos"
              medias={animeSections.classicAnime}
              sectionId="classicAnime"
              showLoadMore={true}
              onLoadMore={() => loadMoreForSection("classicAnime")}
              onMediaClick={handleMediaClick}
              sectionIndex={1}
            />
          )}
          
          {/* Action Anime Section */}
          {animeSections?.actionAnime?.length > 0 && (
            <MediaSection
              title="Animes de Ação"
              medias={animeSections.actionAnime}
              sectionId="actionAnime"
              showLoadMore={true}
              onLoadMore={() => loadMoreForSection("actionAnime")}
              onMediaClick={handleMediaClick}
              sectionIndex={2}
            />
          )}
          
          {/* Seasonal Anime Section */}
          {seasonalAnimes?.length > 0 && (
            <MediaSection
              title="Temporada Atual"
              medias={seasonalAnimes}
              sectionId="seasonalAnime"
              showLoadMore={true}
              onLoadMore={() => loadMoreForSection("seasonalAnime")}
              onMediaClick={handleMediaClick}
              sectionIndex={3}
            />
          )}
        </>
      )}
    </MediaView>
  );
};

export default AnimesPage;
