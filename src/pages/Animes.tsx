
import { useNavigate } from "react-router-dom";
import { useAnimes } from "@/hooks/anime/useAnimes";
import MediaView from "@/components/media/MediaView";
import { MediaItem, getMediaTitle } from "@/types/movie";
import AnimeCarousel from "@/components/anime/AnimeCarousel";

const AnimesPage = () => {
  const navigate = useNavigate();
  const {
    animes,
    topRatedAnimes,
    trendingAnimes,
    recentAnimes,
    specificAnimes,
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
    setYearFilter,
    setRatingFilter,
    resetFilters
  } = useAnimes();

  // Handle media click to navigate to the detail page
  const handleMediaClick = (media: MediaItem) => {
    if (!media || !media.id) return;
    
    // Navigate to anime detail page
    navigate(`/anime/${media.id}`);
    console.log(`Navigating to anime with ID: ${media.id}, title: ${getMediaTitle(media)}`);
  };

  return (
    <MediaView
      title="Animes Dublados em Português"
      type="anime"
      mediaItems={animes}
      topRatedItems={topRatedAnimes}
      trendingItems={trendingAnimes}
      recentItems={recentAnimes}
      popularItems={specificAnimes}
      isLoading={isLoadingInitial}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      isFiltering={isFiltering}
      isSearching={isSearching}
      page={page}
      yearFilter={yearFilter}
      ratingFilter={ratingFilter}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onYearFilterChange={setYearFilter}
      onRatingFilterChange={setRatingFilter}
      onLoadMore={loadMoreAnimes}
      onResetFilters={resetFilters}
      onMediaClick={handleMediaClick}
    >
      {/* Featured Anime Carousel */}
      {!isSearching && !isFiltering && animeSections?.featuredAnime?.length > 0 && (
        <AnimeCarousel 
          animes={animeSections.featuredAnime.slice(0, 10)} 
          onAnimeClick={handleMediaClick}
        />
      )}

      {/* Seasonal Anime Section */}
      {!isSearching && !isFiltering && seasonalAnimes?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Temporada Atual</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {seasonalAnimes.slice(0, 14).map(anime => (
              <div 
                key={anime.id} 
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleMediaClick(anime)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w342${anime.poster_path}`} 
                  alt={getMediaTitle(anime)} 
                  className="rounded-md shadow-lg w-full h-auto"
                />
                <h3 className="text-sm font-medium text-white mt-2 truncate">{getMediaTitle(anime)}</h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </MediaView>
  );
};

export default AnimesPage;
