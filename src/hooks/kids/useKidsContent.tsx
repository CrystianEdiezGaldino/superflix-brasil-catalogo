
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKidsFilters } from "./useKidsFilters";
import { useKidsPagination } from "./useKidsPagination";
import { MediaItem, Movie, Series } from "@/types/movie";
import { 
  fetchKidsMovies, 
  fetchKidsAnimations, 
  fetchKidsSeries, 
  fetchKidsAnimes 
} from "@/services/tmdb/kids";

export const useKidsContent = () => {
  const {
    yearFilter,
    ratingFilter,
    searchQuery,
    isSearching,
    isFiltering,
    handleSearchChange,
    handleYearFilterChange,
    handleRatingFilterChange,
    resetFilters
  } = useKidsFilters();

  const {
    page,
    hasMore,
    isLoadingMore,
    loadMore,
    setHasMore,
    setIsLoadingMore
  } = useKidsPagination();

  const [kidsContent, setKidsContent] = useState<MediaItem[]>([]);

  // Query for animations (movies)
  const animationsQuery = useQuery({
    queryKey: ['kids-animations', page],
    queryFn: () => fetchKidsAnimations(page),
  });

  // Query for kids movies that are not animations
  const kidsMoviesQuery = useQuery({
    queryKey: ['kids-movies', page],
    queryFn: () => fetchKidsMovies(page),
  });

  // Query for kids series
  const kidsSeriesQuery = useQuery({
    queryKey: ['kids-series', page],
    queryFn: () => fetchKidsSeries(page),
  });

  // Query for kids animes
  const kidsAnimesQuery = useQuery({
    queryKey: ['kids-animes', page],
    queryFn: () => fetchKidsAnimes(page),
  });

  // Combine all data
  useEffect(() => {
    const animations = animationsQuery.data || [];
    const kidsMovies = kidsMoviesQuery.data || [];
    const kidsSeries = kidsSeriesQuery.data || [];
    const kidsAnimes = kidsAnimesQuery.data || [];
    
    let allContent = [...animations, ...kidsMovies, ...kidsSeries, ...kidsAnimes];
    
    // Filter content based on search and filters
    if (searchQuery) {
      allContent = allContent.filter((item) => {
        const title = 'title' in item ? item.title : item.name;
        return title?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (yearFilter) {
      allContent = allContent.filter((item) => {
        const date = 'release_date' in item ? item.release_date : item.first_air_date;
        return date?.includes(yearFilter);
      });
    }

    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      allContent = allContent.filter((item) => item.vote_average >= minRating);
    }
    
    setKidsContent(allContent);
    setHasMore(animations.length === 20 || kidsMovies.length === 20 || kidsSeries.length === 20);
  }, [
    animationsQuery.data,
    kidsMoviesQuery.data, 
    kidsSeriesQuery.data,
    kidsAnimesQuery.data,
    searchQuery,
    yearFilter,
    ratingFilter,
    setHasMore
  ]);

  // Separate content for featured sections
  const trendingAnimations = animationsQuery.data?.slice(0, 6) || [];
  const recentAnimations = animationsQuery.data?.slice(6, 12) || [];
  const popularKidsMovies = kidsMoviesQuery.data?.slice(0, 6) || [];
  const popularKidsSeries = kidsSeriesQuery.data?.slice(0, 6) || [];

  const isLoading = 
    animationsQuery.isLoading || 
    kidsMoviesQuery.isLoading || 
    kidsSeriesQuery.isLoading ||
    kidsAnimesQuery.isLoading;

  // Load more data
  useEffect(() => {
    if (page > 1) {
      setIsLoadingMore(true);
      
      Promise.all([
        fetchKidsAnimations(page),
        fetchKidsMovies(page),
        fetchKidsSeries(page),
        fetchKidsAnimes(page)
      ]).then(([newAnimations, newMovies, newSeries, newAnimes]) => {
        setKidsContent(prev => [...prev, ...newAnimations, ...newMovies, ...newSeries, ...newAnimes]);
        setIsLoadingMore(false);
        setHasMore(
          newAnimations.length > 0 || 
          newMovies.length > 0 || 
          newSeries.length > 0 || 
          newAnimes.length > 0
        );
      });
    }
  }, [page, setIsLoadingMore, setHasMore]);

  return {
    kidsContent,
    trendingContent: trendingAnimations,
    topRatedContent: recentAnimations,
    recentContent: popularKidsSeries,
    popularContent: popularKidsMovies,
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    yearFilter,
    ratingFilter,
    searchQuery,
    isSearching,
    isFiltering,
    handleSearchChange,
    handleYearFilterChange,
    handleRatingFilterChange,
    loadMore,
    resetFilters
  };
};
