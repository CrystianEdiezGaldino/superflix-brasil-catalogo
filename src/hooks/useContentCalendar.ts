
import { useState, useEffect } from "react";
import { ContentCalendarItem } from "@/types/calendar";
import { format, addDays, subDays, isSameDay, parseISO, isAfter, isBefore } from "date-fns";

// Mock data function for the content calendar
export const useContentCalendar = () => {
  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch from an API
    const fetchCalendar = async () => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockCalendarItems: ContentCalendarItem[] = [
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
            first_air_date: "",
            genres: [],
            networks: [{id: 1, name: "Netflix", logo_path: "/logo.jpg"}],
            episode_run_time: [],
            original_language: "en",
            is_new: true
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
            release_date: "",
            first_air_date: "2025-05-01",
            genres: [],
            networks: [{id: 2, name: "HBO", logo_path: "/logo.jpg"}],
            episode_run_time: [],
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
            release_date: "",
            first_air_date: "2025-05-20", // Futuro
            genres: [],
            networks: [{id: 3, name: "Viki", logo_path: "/logo.jpg"}],
            episode_run_time: [],
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
            release_date: "",
            first_air_date: "2025-03-10", // Passado
            genres: [],
            networks: [{id: 4, name: "Crunchyroll", logo_path: "/logo.jpg"}],
            episode_run_time: [],
            original_language: "ja",
            is_new: true
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
            networks: [{id: 4, name: "Crunchyroll", logo_path: "/logo.jpg"}],
            episode_run_time: [],
            original_language: "ja",
            is_new: true
          }
        ];

        setCalendarItems(mockCalendarItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do calendário:", error);
        setIsLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  // Filter for today's releases
  const todayReleases = calendarItems.filter(item => {
    const releaseDate = item.release_date || item.first_air_date;
    return releaseDate && isSameDay(parseISO(releaseDate), new Date());
  });

  // Filter for recent content (last 45 days)
  const recentContent = calendarItems.filter(item => {
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return false;
    
    const parsedDate = parseISO(releaseDate);
    const fortyFiveDaysAgo = subDays(new Date(), 45);
    const today = new Date();
    
    return isAfter(parsedDate, fortyFiveDaysAgo) && isBefore(parsedDate, today);
  });

  // Filter for upcoming content (next 20 days)
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
    isLoading
  };
};
