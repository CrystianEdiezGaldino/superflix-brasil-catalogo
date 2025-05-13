
import { useState, useEffect } from "react";
import { ContentCalendarItem } from "@/types/calendar";
import { format, addDays, subDays, isSameDay, parseISO, isAfter, isBefore } from "date-fns";
import { MediaItem } from "@/types/movie";

// Refactored hook for content calendar using more robust patterns
export const useContentCalendar = () => {
  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch calendar data
    const fetchCalendar = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        // For now, we're using mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for calendar items
        const mockCalendarItems: MediaItem[] = [
          {
            id: 1,
            title: "Filme Recente 1",
            name: "Filme Recente 1",
            overview: "Um filme recentemente lançado",
            poster_path: "/path/to/poster1.jpg",
            backdrop_path: "/path/to/backdrop1.jpg",
            vote_average: 8.1,
            vote_count: 230,
            media_type: "movie",
            release_date: "2025-04-15",
            genres: [],
          },
          {
            id: 2,
            title: "Série Nova",
            name: "Série Nova",
            overview: "Uma série que acaba de estrear",
            poster_path: "/path/to/poster2.jpg",
            backdrop_path: "/path/to/backdrop2.jpg",
            vote_average: 7.8,
            vote_count: 180,
            media_type: "tv",
            first_air_date: "2025-05-01",
            genres: [],
            original_language: "en"
          },
          {
            id: 3,
            title: "Dorama Esperado",
            name: "Dorama Esperado",
            overview: "Um dorama muito aguardado",
            poster_path: "/path/to/poster3.jpg",
            backdrop_path: "/path/to/backdrop3.jpg",
            vote_average: 8.5,
            vote_count: 320,
            media_type: "tv",
            first_air_date: "2025-05-20", // Futuro
            genres: [],
            original_language: "ko"
          },
          {
            id: 4,
            title: "Anime da Temporada",
            name: "Anime da Temporada",
            overview: "O anime mais popular da temporada",
            poster_path: "/path/to/poster4.jpg",
            backdrop_path: "/path/to/backdrop4.jpg",
            vote_average: 9.0,
            vote_count: 450,
            media_type: "tv",
            first_air_date: "2025-03-10", // Passado
            genres: [],
            original_language: "ja",
          },
          {
            id: 5,
            title: "Anime Novo",
            name: "Anime Novo",
            overview: "Um novo anime lançado hoje",
            poster_path: "/path/to/poster5.jpg",
            backdrop_path: "/path/to/backdrop5.jpg",
            vote_average: 8.7,
            vote_count: 320,
            media_type: "tv",
            release_date: format(new Date(), "yyyy-MM-dd"),
            first_air_date: format(new Date(), "yyyy-MM-dd"),
            genres: [],
            original_language: "ja",
          }
        ];

        // Convert MediaItem to ContentCalendarItem with is_new flag
        const castedItems: ContentCalendarItem[] = mockCalendarItems.map((item, index) => ({
          ...item,
          is_new: index % 2 === 0 // Just for demonstration, alternating items are marked as new
        }));

        setCalendarItems(castedItems);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar dados do calendário:", error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  // Filter functions for different content types
  
  // Today's releases
  const todayReleases = calendarItems.filter(item => {
    const releaseDate = item.release_date || item.first_air_date;
    return releaseDate && isSameDay(parseISO(releaseDate), new Date());
  });

  // Recent content (last 45 days)
  const recentContent = calendarItems.filter(item => {
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return false;
    
    const parsedDate = parseISO(releaseDate);
    const fortyFiveDaysAgo = subDays(new Date(), 45);
    const today = new Date();
    
    return isAfter(parsedDate, fortyFiveDaysAgo) && isBefore(parsedDate, today);
  });

  // Upcoming content (next 20 days)
  const upcomingContent = calendarItems.filter(item => {
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return false;
    
    const parsedDate = parseISO(releaseDate);
    const today = new Date();
    const twentyDaysLater = addDays(today, 20);
    
    return isAfter(parsedDate, today) && isBefore(parsedDate, twentyDaysLater);
  });

  return {
    calendarItems,
    todayReleases,
    recentContent,
    upcomingContent,
    isLoading,
    error
  };
};
