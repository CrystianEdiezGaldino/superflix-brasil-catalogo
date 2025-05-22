
import { useMemo } from "react";
import useHomePageData from "../useHomePageData";
import { useMovies } from "../movies/useMovies";
import { MediaItem } from "@/types/movie";
import { useSectionData } from "./useSectionData";
import { useSectionSearch } from "./useSectionSearch";
import { useSectionNavigation } from "./useSectionNavigation";
import { useSectionPagination } from "./useSectionPagination";

export const useContentSections = () => {
  // Get all media data from the home page data hook
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
    popularContent,
    isLoading,
    hasError,
    searchMedia, // Use searchMedia from useHomePageData directly
  } = useHomePageData();

  // Define popularSeriesData and recentAnimesData with fallbacks
  const popularSeriesData = Array.isArray(seriesData) ? seriesData.slice(0, 5) : [];
  const recentAnimesData = Array.isArray(animeData) ? animeData.slice(0, 5) : [];

  // Add hook for loading more content
  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

  // Create an object with all available media data for section initialization
  const allMediaData = useMemo(() => ({
    movies: Array.isArray(moviesData) ? moviesData : [],
    series: Array.isArray(seriesData) ? seriesData : [],
    anime: Array.isArray(animeData) ? animeData : [],
    topRatedAnime: Array.isArray(topRatedAnimeData) ? topRatedAnimeData : [],
    doramas: Array.isArray(doramasData) ? doramasData : [],
    actionMovies: Array.isArray(actionMoviesData) ? actionMoviesData : [],
    comedyMovies: Array.isArray(comedyMoviesData) ? comedyMoviesData : [],
    adventureMovies: Array.isArray(adventureMoviesData) ? adventureMoviesData : [],
    sciFiMovies: Array.isArray(sciFiMoviesData) ? sciFiMoviesData : [],
    popularSeries: popularSeriesData,
    recentAnimes: recentAnimesData
  }), [
    moviesData,
    seriesData,
    animeData,
    topRatedAnimeData,
    doramasData,
    actionMoviesData,
    comedyMoviesData,
    adventureMoviesData,
    sciFiMoviesData,
    popularSeriesData,
    recentAnimesData
  ]);

  // Section data management
  const {
    sectionData,
    loadMoreForSection,
    isLoadingMore: isSectionLoading
  } = useSectionData(allMediaData);

  // Section navigation
  const {
    currentSection,
    setCurrentSection
  } = useSectionNavigation();

  // Search functionality
  const {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    setSearchQuery,
    setSearchResults,
    setIsSearching
  } = useSectionSearch(searchMedia);

  // Handle loading more content for a specific section
  const handleLoadMoreSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    console.log(`Loading more content for section: ${sectionId}`);
    
    // Determine which data source to use based on sectionId
    let sourceData: MediaItem[] = [];
    
    switch (sectionId) {
      case 'movies':
        sourceData = allMediaData.movies;
        break;
      case 'series':
        sourceData = allMediaData.series;
        break;
      case 'anime':
        sourceData = allMediaData.anime;
        break;
      case 'topRatedAnime':
        sourceData = allMediaData.topRatedAnime;
        break;
      case 'doramas':
        sourceData = allMediaData.doramas;
        break;
      case 'actionMovies':
        sourceData = allMediaData.actionMovies;
        break;
      case 'comedyMovies':
        sourceData = allMediaData.comedyMovies;
        break;
      case 'adventureMovies':
        sourceData = allMediaData.adventureMovies;
        break;
      case 'sciFiMovies':
        sourceData = allMediaData.sciFiMovies;
        break;
      case 'popularSeries':
        sourceData = allMediaData.popularSeries;
        break;
      case 'recentAnimes':
        sourceData = allMediaData.recentAnimes;
        break;
      default:
        sourceData = [];
    }
    
    loadMoreForSection(sectionId, sourceData);
  };

  // Section pagination
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useSectionPagination(sectionData, handleLoadMoreSection);
  
  // Build the return object with all necessary data
  return {
    // User data
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    
    // Media data
    featuredMedia,
    recommendations,
    moviesData: sectionData.movies?.items || allMediaData.movies,
    seriesData: sectionData.series?.items || allMediaData.series,
    animeData: sectionData.anime?.items || allMediaData.anime,
    topRatedAnimeData: sectionData.topRatedAnime?.items || allMediaData.topRatedAnime,
    doramasData: sectionData.doramas?.items || allMediaData.doramas,
    actionMoviesData: sectionData.actionMovies?.items || allMediaData.actionMovies,
    comedyMoviesData: sectionData.comedyMovies?.items || allMediaData.comedyMovies,
    adventureMoviesData: sectionData.adventureMovies?.items || allMediaData.adventureMovies,
    sciFiMoviesData: sectionData.sciFiMovies?.items || allMediaData.sciFiMovies,
    marvelMoviesData: Array.isArray(marvelMoviesData) ? marvelMoviesData : [],
    dcMoviesData: Array.isArray(dcMoviesData) ? dcMoviesData : [],
    popularSeries: sectionData.popularSeries?.items || popularSeriesData,
    recentAnimes: sectionData.recentAnimes?.items || recentAnimesData,
    movies: Array.isArray(movies) ? movies : [],
    
    // Status flags
    isLoading,
    isLoadingMore: isLoadingMore || isSectionLoading,
    hasMore,
    hasError,
    
    // Search functionality
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    
    // Section navigation
    currentSection,
    handleLoadMoreSection,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    
    // Section data
    sectionData,
    
    // Pagination
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
