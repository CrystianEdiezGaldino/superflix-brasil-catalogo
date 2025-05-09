
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchDoramaDetails, fetchSimilarDoramas } from "@/services/tmdbApi";
import { Series, MediaItem } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

export const useDoramaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isAdmin, hasTempAccess, hasTrialAccess, isLoading: subscriptionLoading } = useSubscription();
  
  // Check if user has access to content
  const hasAccess = isSubscribed || isAdmin || hasTempAccess || hasTrialAccess;

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

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    dorama: dorama as Series | undefined,
    similarDoramas: similarDoramas || [],
    isLoadingDorama,
    isLoadingSimilar,
    showPlayer,
    togglePlayer,
    authLoading,
    subscriptionLoading,
    user,
    hasAccess
  };
};
