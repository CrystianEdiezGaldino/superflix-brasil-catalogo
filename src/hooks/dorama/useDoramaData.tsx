
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchDoramaDetails, fetchSimilarDoramas } from "@/services/tmdbApi";
import { Series } from "@/types/movie";

export const useDoramaData = (id: string | undefined) => {
  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch dorama details
  const { data: dorama, isLoading: isLoadingDorama } = useQuery({
    queryKey: ["dorama", id],
    queryFn: () => fetchDoramaDetails(id || ""),
    enabled: !!id,
  });

  // Fetch similar doramas
  const { data: similarDoramas, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ["similar-doramas", id],
    queryFn: () => fetchSimilarDoramas(id || ""),
    enabled: !!id,
  });

  return {
    dorama: dorama as Series | undefined,
    similarDoramas: similarDoramas || [],
    isLoadingDorama,
    isLoadingSimilar
  };
};
