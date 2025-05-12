
import { useQuery } from "@tanstack/react-query";
import { MediaItem, Series } from "@/types/movie";

// Extending MediaItem directly to ensure compatibility
export interface ContentCalendarItem extends MediaItem {
  release_date: string;
  episode_number?: number;
  season_number?: number;
  is_new?: boolean;
}

// Function to fetch from the content calendar endpoint
const fetchContentCalendar = async (): Promise<ContentCalendarItem[]> => {
  try {
    // Using the endpoint provided in the requirements
    const response = await fetch("https://superflixapi.nexus/conteudo");
    
    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and ensure all items conform to MediaItem + ContentCalendarItem properties
    return data.map((item: any) => {
      const mediaType = item.media_type || 'tv';
      
      // Base properties required for all MediaItem types
      const baseItem = {
        id: item.id || 0,
        title: item.title || '',
        name: item.name || '',
        overview: item.overview || '',
        poster_path: item.poster_path || '',
        backdrop_path: item.backdrop_path || '',
        media_type: mediaType,
        release_date: item.release_date || '',
        first_air_date: item.first_air_date || '',
        vote_average: item.vote_average || 0,
        vote_count: item.vote_count || 0,
        genres: item.genres || [],
        networks: item.networks || [],
        episode_run_time: item.episode_run_time || [],
        original_language: item.original_language || '',
        // ContentCalendarItem specific fields
        episode_number: item.episode_number,
        season_number: item.season_number,
        is_new: item.is_new || false
      };
      
      return baseItem as ContentCalendarItem;
    });
  } catch (error) {
    console.error("Error fetching content calendar:", error);
    // Return empty array with proper typing
    return [];
  }
};

export const useContentCalendar = () => {
  const { 
    data: calendarItems = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["contentCalendar"],
    queryFn: fetchContentCalendar,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
  });

  // Get today's date for reference
  const today = new Date();
  
  // Filter for upcoming content (within next 20 days)
  const upcomingContent = calendarItems.filter(item => {
    const releaseDate = new Date(item.release_date);
    const diffDays = Math.ceil((releaseDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 20;
  });
  
  // Filter for recent content (within past 45 days)
  const recentContent = calendarItems.filter(item => {
    const releaseDate = new Date(item.release_date);
    const diffDays = Math.ceil((today.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 45;
  });
  
  // Filter for today's releases
  const todayReleases = calendarItems.filter(item => {
    const releaseDate = new Date(item.release_date);
    return (
      releaseDate.getDate() === today.getDate() &&
      releaseDate.getMonth() === today.getMonth() &&
      releaseDate.getFullYear() === today.getFullYear()
    );
  });

  return {
    calendarItems,
    upcomingContent,
    recentContent, 
    todayReleases,
    isLoading,
    error,
    refetch
  };
};
