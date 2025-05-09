
import { useState, useEffect } from "react";
import { Series } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularDoramas, fetchTopRatedDoramas } from "@/services/tmdbApi";
import { toast } from "sonner";

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
  
  // Carrega os doramas iniciais (30 doramas inicialmente)
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        // Carregamos 30 doramas inicialmente
        const initialDoramas = await fetchKoreanDramas(1, 30);
        
        if (initialDoramas.length === 0) {
          toast.error("Não foi possível carregar os doramas. Tente novamente mais tarde.");
        }
        
        const filteredDoramas = filterDoramas(initialDoramas);
        setDoramas(filteredDoramas);
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Erro ao carregar doramas iniciais:", error);
        toast.error("Erro ao carregar doramas. Tente novamente mais tarde.");
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, [filterDoramas]);
  
  // Carrega doramas populares e mais bem avaliados
  useEffect(() => {
    const loadPopularDoramas = async () => {
      try {
        const popular = await fetchPopularDoramas(12);
        const filteredPopular = filterDoramas(popular);
        setPopularDoramas(filteredPopular);
        setIsLoadingPopular(false);
      } catch (error) {
        console.error("Erro ao carregar doramas populares:", error);
        toast.error("Erro ao carregar doramas populares.");
        setIsLoadingPopular(false);
      }
    };
    
    const loadTopRatedDoramas = async () => {
      try {
        const topRated = await fetchTopRatedDoramas(12);
        const filteredTopRated = filterDoramas(topRated);
        setTopRatedDoramas(filteredTopRated);
        setIsLoadingTopRated(false);
      } catch (error) {
        console.error("Erro ao carregar doramas mais bem avaliados:", error);
        toast.error("Erro ao carregar doramas mais bem avaliados.");
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
