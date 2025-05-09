
import { useState, useEffect } from "react";
import { Series } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularDoramas, fetchTopRatedDoramas } from "@/services/tmdbApi";

interface UseDoramaLoaderProps {
  filterDoramas: (doramaList: Series[]) => Series[];
}

export const useDoramaLoader = ({ filterDoramas }: UseDoramaLoaderProps) => {
  const [doramas, setDoramas] = useState<Series[]>([]);
  const [topRatedDoramas, setTopRatedDoramas] = useState<Series[]>([]);
  const [popularDoramas, setPopularDoramas] = useState<Series[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(true);
  
  // Load initial doramas (30 doramas inicialmente)
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        // Carregamos os primeiros 30 doramas (pode ser ajustado)
        // Já que TMDB não tem endpoint específico para doramas, usamos a lista de IDs
        const initialDoramas = await fetchKoreanDramas(1, 30);
        const filteredDoramas = filterDoramas(initialDoramas);
        setDoramas(filteredDoramas);
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Error loading initial doramas:", error);
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, [filterDoramas]);
  
  // Load popular and top rated doramas
  useEffect(() => {
    const loadPopularDoramas = async () => {
      try {
        const popular = await fetchPopularDoramas(10);
        const filteredPopular = filterDoramas(popular);
        setPopularDoramas(filteredPopular);
        setIsLoadingPopular(false);
      } catch (error) {
        console.error("Error loading popular doramas:", error);
        setIsLoadingPopular(false);
      }
    };
    
    const loadTopRatedDoramas = async () => {
      try {
        const topRated = await fetchTopRatedDoramas(10);
        const filteredTopRated = filterDoramas(topRated);
        setTopRatedDoramas(filteredTopRated);
        setIsLoadingTopRated(false);
      } catch (error) {
        console.error("Error loading top rated doramas:", error);
        setIsLoadingTopRated(false);
      }
    };
    
    loadPopularDoramas();
    loadTopRatedDoramas();
  }, [filterDoramas]);

  return {
    doramas,
    setDoramas,
    topRatedDoramas,
    popularDoramas,
    isLoadingInitial,
    isLoadingPopular,
    isLoadingTopRated
  };
};
