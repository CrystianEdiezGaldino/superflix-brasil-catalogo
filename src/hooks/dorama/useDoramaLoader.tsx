import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularKoreanDramas, fetchTopRatedKoreanDramas, fetchKoreanMovies } from "@/services/tmdbApi";
import { toast } from "sonner";

// List of popular Korean drama IDs to prioritize
const POPULAR_KOREAN_DRAMAS_IDS = [
  67915,  // Crash Landing on You
  96162,  // Itaewon Class
  78191,  // Guardian: The Lonely and Great God (Goblin)
  93405,  // The King: Eternal Monarch
  62560,  // Descendants of the Sun
  93741,  // It's Okay to Not Be Okay
  67915,  // Strong Woman Do Bong Soon
  111110, // Vincenzo
  124589, // Alchemy of Souls
  110356, // True Beauty
  156441, // Business Proposal
  134506, // Twenty-Five Twenty-One
  136489, // Our Beloved Summer
  127198, // Nevertheless
  92088,  // Hospital Playlist
  137476, // Extraordinary Attorney Woo
  110316, // My Name
  96440,  // All of Us Are Dead
  124256, // Hometown Cha-Cha-Cha
  152322  // Reborn Rich
];

interface UseDoramaLoaderProps {
  filterDoramas: (contentList: MediaItem[]) => MediaItem[];
}

export const useDoramaLoader = ({ filterDoramas }: UseDoramaLoaderProps) => {
  const [doramas, setDoramas] = useState<MediaItem[]>([]);
  const [topRatedDoramas, setTopRatedDoramas] = useState<MediaItem[]>([]);
  const [popularDoramas, setPopularDoramas] = useState<MediaItem[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<MediaItem[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  
  // Load initial doramas (50 items initially)
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        // Load 50 items initially
        const initialContent = await fetchKoreanDramas(1, 50);
        
        if (initialContent.length === 0) {
          toast.error("Não foi possível carregar os doramas. Tente novamente mais tarde.");
        }
        
        // Prioritize popular Korean dramas in the results
        const prioritizedContent = [...initialContent];
        prioritizedContent.sort((a, b) => {
          // If item is in our popular list, prioritize it
          const aIndex = POPULAR_KOREAN_DRAMAS_IDS.indexOf(a.id);
          const bIndex = POPULAR_KOREAN_DRAMAS_IDS.indexOf(b.id);
          
          if (aIndex !== -1 && bIndex !== -1) {
            // Both are popular, sort by their position in the popular array
            return aIndex - bIndex;
          } else if (aIndex !== -1) {
            // Only a is popular, it comes first
            return -1;
          } else if (bIndex !== -1) {
            // Only b is popular, it comes first
            return 1;
          }
          
          // Otherwise, sort by vote_average (recent AND popular)
          return (b.vote_average || 0) - (a.vote_average || 0);
        });
        
        const filteredContent = filterDoramas(prioritizedContent);
        setDoramas(filteredContent);
        
        console.log(`Loaded ${filteredContent.length} initial Korean dramas`);
        
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Error loading initial content:", error);
        toast.error("Error loading doramas. Please try again later.");
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, [filterDoramas]);
  
  // Load popular doramas, top rated doramas and Korean movies
  useEffect(() => {
    const loadPopularDoramas = async () => {
      try {
        const popular = await fetchPopularKoreanDramas();
        
        // Prioritize known popular dramas
        const prioritizedPopular = [...popular];
        prioritizedPopular.sort((a, b) => {
          const aIndex = POPULAR_KOREAN_DRAMAS_IDS.indexOf(a.id);
          const bIndex = POPULAR_KOREAN_DRAMAS_IDS.indexOf(b.id);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          } else if (aIndex !== -1) {
            return -1;
          } else if (bIndex !== -1) {
            return 1;
          }
          
          return (b.vote_average || 0) - (a.vote_average || 0);
        });
        
        const filteredPopular = filterDoramas(prioritizedPopular);
        setPopularDoramas(filteredPopular);
        setIsLoadingPopular(false);
      } catch (error) {
        console.error("Error loading popular doramas:", error);
        toast.error("Error loading popular doramas.");
        setIsLoadingPopular(false);
      }
    };
    
    const loadTopRatedDoramas = async () => {
      try {
        const topRated = await fetchTopRatedKoreanDramas();
        const filteredTopRated = filterDoramas(topRated);
        setTopRatedDoramas(filteredTopRated);
        setIsLoadingTopRated(false);
      } catch (error) {
        console.error("Error loading top rated doramas:", error);
        toast.error("Error loading top rated doramas.");
        setIsLoadingTopRated(false);
      }
    };
    
    const loadKoreanMovies = async () => {
      try {
        const movies = await fetchKoreanMovies();
        setKoreanMovies(movies);
        setIsLoadingMovies(false);
      } catch (error) {
        console.error("Error loading Korean movies:", error);
        toast.error("Error loading Korean movies.");
        setIsLoadingMovies(false);
      }
    };
    
    loadPopularDoramas();
    loadTopRatedDoramas();
    loadKoreanMovies();
  }, [filterDoramas]);

  return {
    doramas,
    setDoramas,
    topRatedDoramas,
    popularDoramas,
    koreanMovies,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated,
    isLoadingMovies
  };
};
