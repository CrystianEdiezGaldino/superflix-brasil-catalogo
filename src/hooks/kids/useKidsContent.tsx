
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKidsFilters } from "./useKidsFilters";
import { useKidsPagination } from "./useKidsPagination";
import { MediaItem, Movie, Series } from "@/types/movie";

// Mock API service for kids content - replace with real API later
const fetchKidsContent = async (page = 1): Promise<MediaItem[]> => {
  // This would call your actual API
  // For now returning mock data that conforms to MediaItem type
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockMovies: Movie[] = Array(20).fill(null).map((_, i) => ({
    id: 1000 + i,
    title: `Kids Movie ${i + 1}`,
    name: undefined,
    poster_path: "/placeholder.svg",
    backdrop_path: "/placeholder.svg",
    vote_average: 4.5,
    release_date: "2023-01-01",
    first_air_date: undefined,
    media_type: "movie",
    genre_ids: [16, 10751], // Animation, Family
    overview: "A family-friendly movie for kids"
  }));
  
  return mockMovies;
};

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

  // Query for initial data
  const { data, isLoading } = useQuery({
    queryKey: ['kids-content', page, yearFilter, ratingFilter, searchQuery],
    queryFn: () => fetchKidsContent(page),
  });

  // Mock data for the various content sections
  const trendingContent = data?.slice(0, 5) || [];
  const topRatedContent = data?.slice(5, 10) || [];
  const recentContent = data?.slice(10, 15) || [];
  const popularContent = data?.slice(15, 20) || [];

  // Filter content
  useEffect(() => {
    if (data) {
      let filtered = [...data];
      
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          // Handle both movie and series types
          const title = 'title' in item ? item.title : item.name;
          return title?.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }
      
      if (yearFilter) {
        filtered = filtered.filter((item) => {
          // Handle both movie and series types
          const date = 'release_date' in item ? item.release_date : item.first_air_date;
          return date?.includes(yearFilter);
        });
      }
      
      setKidsContent(filtered);
      setHasMore(filtered.length >= 20);
    }
  }, [data, searchQuery, yearFilter, ratingFilter, setHasMore]);

  // Load more data
  useEffect(() => {
    if (page > 1) {
      fetchKidsContent(page).then(newData => {
        setKidsContent(prev => [...prev, ...newData]);
        setIsLoadingMore(false);
        setHasMore(newData.length > 0);
      });
    }
  }, [page, setIsLoadingMore, setHasMore]);

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
