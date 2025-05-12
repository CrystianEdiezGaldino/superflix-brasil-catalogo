
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@/types/movie";

// Extending MediaItem to include the specific properties needed for calendar items
export interface ContentCalendarItem extends MediaItem {
  release_date: string;
  episode_number?: number;
  season_number?: number;
  is_new?: boolean;
  
  // Adding fields required for MediaItem
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  networks?: Array<{ id: number; name: string; logo_path: string }>;
  episode_run_time?: number[];
  name?: string;
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
    
    // Ensure all required fields are present for MediaItem compatibility
    return data.map((item: any) => ({
      ...item,
      media_type: item.media_type || 'tv',
      name: item.name || item.title || 'Unknown Title',
      vote_average: item.vote_average || 0,
      vote_count: item.vote_count || 0,
      genres: item.genres || [],
      networks: item.networks || [],
      episode_run_time: item.episode_run_time || [],
    }));
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
