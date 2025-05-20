import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKidsFilters } from "./useKidsFilters";
import { useKidsPagination } from "./useKidsPagination";
import { MediaItem } from "@/types/movie";
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
  const [allContent, setAllContent] = useState<MediaItem[]>([]);

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
    
    const newContent = [...animations, ...kidsMovies, ...kidsSeries, ...kidsAnimes];
    
    // Update all content
    setAllContent(prev => {
      if (page === 1) {
        return newContent;
      }
      return [...prev, ...newContent];
    });
    
    // Filter content based on search and filters
    let filteredContent = newContent;
    
    if (searchQuery) {
      filteredContent = filteredContent.filter((item) => {
        const title = 'title' in item ? item.title : item.name;
        return title?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (yearFilter) {
      filteredContent = filteredContent.filter((item) => {
        const date = 'release_date' in item ? item.release_date : item.first_air_date;
        return date?.includes(yearFilter);
      });
    }

    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filteredContent = filteredContent.filter((item) => item.vote_average >= minRating);
    }
    
    setKidsContent(prev => {
      if (page === 1) {
        return filteredContent;
      }
      return [...prev, ...filteredContent];
    });

    setHasMore(
      animations.length === 20 || 
      kidsMovies.length === 20 || 
      kidsSeries.length === 20 ||
      kidsAnimes.length === 20
    );
  }, [
    animationsQuery.data,
    kidsMoviesQuery.data, 
    kidsSeriesQuery.data,
    kidsAnimesQuery.data,
    searchQuery,
    yearFilter,
    ratingFilter,
    setHasMore,
    page
  ]);

  // Separate content for featured sections
  const trendingContent = allContent.slice(0, 6);
  const topRatedContent = allContent.slice(6, 12);
  const recentContent = allContent.slice(12, 18);
  const popularContent = allContent.slice(18, 24);

  const isLoading = 
    animationsQuery.isLoading || 
    kidsMoviesQuery.isLoading || 
    kidsSeriesQuery.isLoading ||
    kidsAnimesQuery.isLoading;

  return {
    kidsContent,
    trendingContent,
    topRatedContent,
    recentContent,
    popularContent,
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
