
import { useState, useEffect } from "react";
import { useHomePageData } from "../useHomePageData";
import { useMovies } from "../movies/useMovies";
import { MediaItem } from "@/types/movie";

export const useContentSections = () => {
  const [currentSection, setCurrentSection] = useState<string>("movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Store section-specific data
  const [sectionData, setSectionData] = useState<Record<string, {
    items: MediaItem[],
    page: number,
    hasMore: boolean,
    isLoading: boolean
  }>>({});
  
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
    // Fix references to popularSeriesData and recentAnimesData
    popularContent, // This will be used as a fallback for popularSeriesData
    isLoading,
    hasError,
    // Renamed this to apiSearchResults to avoid conflict
    searchResults: apiSearchResults, 
    isSearchLoading,
    handleSearch: originalHandleSearch,
  } = useHomePageData();

  // Define popularSeriesData and recentAnimesData with fallbacks
  // Ensure seriesData is an array before using slice
  const popularSeriesData = Array.isArray(seriesData) ? seriesData.slice(0, 5) : [];
  // Ensure animeData is an array before using slice
  const recentAnimesData = Array.isArray(animeData) ? animeData.slice(0, 5) : [];

  // Add hook for loading more content
  const {
    movies,
    loadMoreMovies,
    isLoadingMore,
    hasMore
  } = useMovies();

  // Initialize section data
  useEffect(() => {
    const updateSectionData = (key: string, data: MediaItem[] | undefined) => {
      if (data && data.length > 0) {
        setSectionData(prev => {
          // Only update if the data is different
          if (JSON.stringify(prev[key]?.items) === JSON.stringify(data)) {
            return prev;
          }
          return {
            ...prev,
            [key]: { items: data, page: 1, hasMore: true, isLoading: false }
          };
        });
      }
    };

    // Ensure all data is in array format before updating sections
    updateSectionData('movies', Array.isArray(moviesData) ? moviesData : []);
    updateSectionData('series', Array.isArray(seriesData) ? seriesData : []);
    updateSectionData('anime', Array.isArray(animeData) ? animeData : []);
    updateSectionData('topRatedAnime', Array.isArray(topRatedAnimeData) ? topRatedAnimeData : []);
    updateSectionData('doramas', Array.isArray(doramasData) ? doramasData : []);
    updateSectionData('actionMovies', Array.isArray(actionMoviesData) ? actionMoviesData : []);
    updateSectionData('comedyMovies', Array.isArray(comedyMoviesData) ? comedyMoviesData : []);
    updateSectionData('adventureMovies', Array.isArray(adventureMoviesData) ? adventureMoviesData : []);
    updateSectionData('sciFiMovies', Array.isArray(sciFiMoviesData) ? sciFiMoviesData : []);
    // Add new sections for popularSeries and recentAnimes
    updateSectionData('popularSeries', popularSeriesData);
    updateSectionData('recentAnimes', recentAnimesData);
  }, [
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

  // Enhanced search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (!query || query.trim() === "") {
      // If query is empty, clear search results but don't show loader
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    try {
      if (originalHandleSearch) {
        await originalHandleSearch(query);
        // Use apiSearchResults instead of searchResults
        setSearchResults(apiSearchResults || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Mock function to simulate loading more items for a specific section
  const mockLoadMoreForSection = async (sectionId: string, limit = 20) => {
    // Update section loading state
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { 
        ...prev[sectionId],
        isLoading: true
      }
    }));
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the current section data
      const currentSectionData = sectionData[sectionId];
      if (!currentSectionData) return;
      
      // Determine which data source to use based on sectionId
      let sourceData: MediaItem[] = [];
      
      switch (sectionId) {
        case 'movies':
          sourceData = moviesData || [];
          break;
        case 'series':
          sourceData = seriesData || [];
          break;
        case 'anime':
          sourceData = animeData || [];
          break;
        case 'topRatedAnime':
          sourceData = topRatedAnimeData || [];
          break;
        case 'doramas':
          sourceData = doramasData || [];
          break;
        case 'actionMovies':
          sourceData = actionMoviesData || [];
          break;
        case 'comedyMovies':
          sourceData = comedyMoviesData || [];
          break;
        case 'adventureMovies':
          sourceData = adventureMoviesData || [];
          break;
        case 'sciFiMovies':
          sourceData = sciFiMoviesData || [];
          break;
        case 'popularSeries':
          sourceData = popularSeriesData || [];
          break;
        case 'recentAnimes':
          sourceData = recentAnimesData || [];
          break;
        default:
          sourceData = [];
      }
      
      // Calculate start and end indices for pagination
      const nextPage = currentSectionData.page + 1;
      const startIdx = currentSectionData.items.length;
      const endIdx = startIdx + limit;
      
      // Get next batch of items (simulating pagination)
      // Since we're using the same source data, we'll take a random subset
      // In a real app, you'd fetch new data from an API
      const moreItems = sourceData
        .filter(item => !currentSectionData.items.some(existing => existing.id === item.id))
        .slice(0, limit);
      
      const hasMoreItems = moreItems.length > 0;
      
      // Update section data with new items and page
      setSectionData(prev => ({
        ...prev,
        [sectionId]: {
          items: [...prev[sectionId].items, ...moreItems],
          page: nextPage,
          hasMore: hasMoreItems,
          isLoading: false
        }
      }));
      
    } catch (error) {
      console.error(`Error loading more items for section ${sectionId}:`, error);
    } finally {
      // Reset loading state
      setSectionData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          isLoading: false
        }
      }));
    }
  };

  // Handle loading more content for a specific section
  const handleLoadMoreSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    console.log(`Loading more content for section: ${sectionId}`);
    mockLoadMoreForSection(sectionId);
  };
  
  return {
    user,
    isAdmin,
    hasAccess,
    hasTrialAccess,
    featuredMedia,
    recommendations,
    moviesData: sectionData.movies?.items || (Array.isArray(moviesData) ? moviesData : []),
    seriesData: sectionData.series?.items || (Array.isArray(seriesData) ? seriesData : []),
    animeData: sectionData.anime?.items || (Array.isArray(animeData) ? animeData : []),
    topRatedAnimeData: sectionData.topRatedAnime?.items || (Array.isArray(topRatedAnimeData) ? topRatedAnimeData : []),
    doramasData: sectionData.doramas?.items || (Array.isArray(doramasData) ? doramasData : []),
    actionMoviesData: sectionData.actionMovies?.items || (Array.isArray(actionMoviesData) ? actionMoviesData : []),
    comedyMoviesData: sectionData.comedyMovies?.items || (Array.isArray(comedyMoviesData) ? comedyMoviesData : []),
    adventureMoviesData: sectionData.adventureMovies?.items || (Array.isArray(adventureMoviesData) ? adventureMoviesData : []),
    sciFiMoviesData: sectionData.sciFiMovies?.items || (Array.isArray(sciFiMoviesData) ? sciFiMoviesData : []),
    marvelMoviesData: Array.isArray(marvelMoviesData) ? marvelMoviesData : [],
    dcMoviesData: Array.isArray(dcMoviesData) ? dcMoviesData : [],
    popularSeries: sectionData.popularSeries?.items || popularSeriesData || [], 
    recentAnimes: sectionData.recentAnimes?.items || recentAnimesData || [], 
    movies: Array.isArray(movies) ? movies : [],
    isLoading,
    isLoadingMore: Object.values(sectionData).some(section => section.isLoading),
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
    sectionData,
    fetchNextPage: {
      anime: () => handleLoadMoreSection('anime'),
      topRated: () => handleLoadMoreSection('topRatedAnime'),
      recent: () => handleLoadMoreSection('recentAnimes')
    },
    hasNextPage: {
      anime: sectionData.anime?.hasMore || false,
      topRated: sectionData.topRatedAnime?.hasMore || false,
      recent: sectionData.recentAnimes?.hasMore || false
    },
    isFetchingNextPage: {
      anime: sectionData.anime?.isLoading || false,
      topRated: sectionData.topRatedAnime?.isLoading || false,
      recent: sectionData.recentAnimes?.isLoading || false
    }
  };
};
