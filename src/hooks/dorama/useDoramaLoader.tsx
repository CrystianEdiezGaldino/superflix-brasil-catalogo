
import { useState, useEffect } from "react";
import { MediaItem } from "@/types/movie";
import { fetchKoreanDramas, fetchPopularDoramas, fetchTopRatedDoramas, fetchKoreanMovies } from "@/services/tmdbApi";
import { toast } from "sonner";

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
  
  // Carrega os doramas iniciais (50 conteúdos inicialmente)
  useEffect(() => {
    const loadInitialDoramas = async () => {
      try {
        // Carregamos 50 conteúdos inicialmente
        const initialContent = await fetchKoreanDramas(1, 50);
        
        if (initialContent.length === 0) {
          toast.error("Não foi possível carregar os doramas. Tente novamente mais tarde.");
        }
        
        const filteredContent = filterDoramas(initialContent);
        setDoramas(filteredContent);
        
        console.log(`Carregados ${filteredContent.length} conteúdos coreanos iniciais`);
        
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Erro ao carregar conteúdo inicial:", error);
        toast.error("Erro ao carregar doramas. Tente novamente mais tarde.");
        setIsLoadingInitial(false);
      }
    };
    
    loadInitialDoramas();
  }, [filterDoramas]);
  
  // Carrega doramas populares, mais bem avaliados e filmes coreanos
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
    
    const loadKoreanMovies = async () => {
      try {
        const movies = await fetchKoreanMovies(12);
        setKoreanMovies(movies);
        setIsLoadingMovies(false);
      } catch (error) {
        console.error("Erro ao carregar filmes coreanos:", error);
        toast.error("Erro ao carregar filmes coreanos.");
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
