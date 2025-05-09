
import { useEffect, useState } from "react";
import { MediaItem } from "@/types/movie";
import { useKidsFilters } from "./useKidsFilters";
import { useKidsPagination } from "./useKidsPagination";

export const useKidsContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kidsContent, setKidsContent] = useState<MediaItem[]>([]);
  const [trendingContent, setTrendingContent] = useState<MediaItem[]>([]);
  const [topRatedContent, setTopRatedContent] = useState<MediaItem[]>([]);
  const [recentContent, setRecentContent] = useState<MediaItem[]>([]);
  const [popularContent, setPopularContent] = useState<MediaItem[]>([]);

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

  // Mock data generation for kids content
  useEffect(() => {
    const fetchKidsContent = async () => {
      try {
        // This is mock data - in a real app, this would be API calls
        const generateMockKidsContent = (count: number, offset: number = 0): MediaItem[] => {
          return Array.from({ length: count }, (_, i) => ({
            id: offset + i + 1,
            title: `Kids Show ${offset + i + 1}`,
            poster_path: `/placeholder.svg`,
            backdrop_path: `/placeholder.svg`,
            vote_average: Math.floor(Math.random() * 5) + 5,
            release_date: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            media_type: Math.random() > 0.5 ? 'movie' : 'tv',
            genre_ids: [10751, 16], // Family, Animation genres
            overview: `A fun and educational show for kids of all ages. Follow the adventures in this exciting kids content!`
          }));
        };

        // Filter logic
        const filterContent = (content: MediaItem[]) => {
          return content.filter(item => {
            const matchesSearch = !searchQuery || 
                                  item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.overview?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesYear = !yearFilter || 
                                (item.release_date && item.release_date.startsWith(yearFilter));
            
            const matchesRating = !ratingFilter ||
                                  (item.vote_average >= parseInt(ratingFilter));
            
            return matchesSearch && matchesYear && matchesRating;
          });
        };

        // First time loading
        if (page === 1) {
          const mockTrendingContent = generateMockKidsContent(6);
          setTrendingContent(mockTrendingContent);
          
          const mockTopRatedContent = generateMockKidsContent(6, 10);
          setTopRatedContent(mockTopRatedContent);
          
          const mockRecentContent = generateMockKidsContent(6, 20);
          setRecentContent(mockRecentContent);
          
          const mockPopularContent = generateMockKidsContent(6, 30);
          setPopularContent(mockPopularContent);
          
          const initialContent = generateMockKidsContent(18);
          setKidsContent(filterContent(initialContent));
          setIsLoading(false);
        } 
        // For pagination
        else {
          setTimeout(() => {
            const newContent = generateMockKidsContent(8, (page - 1) * 8);
            const filteredNewContent = filterContent(newContent);
            
            setKidsContent(prev => [...prev, ...filteredNewContent]);
            setHasMore(page < 5); // Limit to 5 pages for this example
            setIsLoadingMore(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching kids content:", error);
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchKidsContent();
  }, [page, searchQuery, yearFilter, ratingFilter]);

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
