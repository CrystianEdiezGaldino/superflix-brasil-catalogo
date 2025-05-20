
import { MediaItem } from "@/types/movie";
import { fetchKidsAnimes, fetchKidsAnimations, fetchKidsMovies, fetchKidsSeries, fetchTrendingKidsContent } from "./tmdb/kids";

export const fetchKidsContent = async (): Promise<MediaItem[]> => {
  try {
    // Fetch from different categories
    const [animations, movies, series, animes, trending] = await Promise.all([
      fetchKidsAnimations(),
      fetchKidsMovies(),
      fetchKidsSeries(),
      fetchKidsAnimes(),
      fetchTrendingKidsContent()
    ]);
    
    // Combine and remove duplicates
    const allContent = [...trending, ...animations, ...movies, ...series, ...animes];
    const uniqueContent = allContent.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
    
    return uniqueContent;
  } catch (error) {
    console.error("Error fetching kids content:", error);
    return [];
  }
}
