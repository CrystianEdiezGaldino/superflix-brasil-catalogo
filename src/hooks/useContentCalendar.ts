
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { ContentCalendarItem } from "@/types/calendar";

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
            networks: [],
            episode_run_time: [],
            original_language: "en"
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
            networks: [],
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
            networks: [],
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
            networks: [],
            episode_run_time: [],
            original_language: "ja"
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

  return { calendarItems, isLoading };
};
